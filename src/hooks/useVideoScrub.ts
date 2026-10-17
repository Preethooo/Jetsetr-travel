import { useEffect, useRef, useState } from 'react'
import MP4Box, { DataStream, type MP4File, type MP4Sample } from 'mp4box'

const LERP_TAU = 8
const SNAP = 0.002
const LRU_MAX = 24
const LEAD = 24
const WATCHDOG = 60000

type BankFrame = { ts: number; blob: Blob }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Codec-specific description box (avcC / hvcC / vpcC / av1C) minus its 8-byte header. */
function getDescription(file: MP4File, trackId: number): Uint8Array | undefined {
  const trak = file.getTrackById(trackId)
  for (const entry of trak.mdia.minf.stbl.stsd.entries) {
    const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
    if (box) {
      const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN)
      box.write(stream)
      return new Uint8Array(stream.buffer, 8)
    }
  }
  return undefined
}

/** Demux the mp4 into its video samples + decoder config. */
function demux(buffer: ArrayBuffer) {
  return new Promise<{ config: VideoDecoderConfig; samples: MP4Sample[] }>((resolve, reject) => {
    const file = MP4Box.createFile()
    const samples: MP4Sample[] = []
    let config: VideoDecoderConfig | null = null
    let total = 0

    file.onError = (e) => reject(new Error(e))
    file.onReady = (info) => {
      const track = info.videoTracks[0]
      if (!track) return reject(new Error('No video track'))
      total = track.nb_samples
      config = {
        codec: track.codec.startsWith('vp08') ? 'vp8' : track.codec,
        codedWidth: track.video.width,
        codedHeight: track.video.height,
        description: getDescription(file, track.id),
      }
      file.setExtractionOptions(track.id, null, { nbSamples: Infinity })
      file.start()
    }
    file.onSamples = (_id, _user, batch) => {
      samples.push(...batch)
      if (config && samples.length >= total) resolve({ config, samples })
    }

    const buf = buffer as ArrayBuffer & { fileStart: number }
    buf.fileStart = 0
    file.appendBuffer(buf)
    file.flush()
    // Some files report fewer samples than nb_samples; settle on what we got.
    setTimeout(() => (config && samples.length ? resolve({ config, samples }) : reject(new Error('Demux failed'))), 0)
  })
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Decode every sample → webp blobs, throttled so decode never runs more than LEAD frames ahead of encoding. */
async function buildBank(
  config: VideoDecoderConfig,
  samples: MP4Sample[],
  isCancelled: () => boolean,
): Promise<BankFrame[]> {
  const support = await VideoDecoder.isConfigSupported(config)
  if (!support.supported) throw new Error('Codec unsupported')

  const bank: BankFrame[] = []
  const canvas = document.createElement('canvas')
  canvas.width = config.codedWidth ?? 1920
  canvas.height = config.codedHeight ?? 1080
  const ctx = canvas.getContext('2d')!
  let pending = 0
  let failure: Error | null = null
  let encodeChain = Promise.resolve()

  const decoder = new VideoDecoder({
    output: (frame) => {
      pending++
      const ts = frame.timestamp
      encodeChain = encodeChain.then(async () => {
        try {
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        } finally {
          frame.close()
        }
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82))
        if (blob) bank.push({ ts, blob })
        pending--
      })
    },
    error: (e) => {
      failure = e instanceof Error ? e : new Error(String(e))
    },
  })
  decoder.configure(config)

  for (const s of samples) {
    if (isCancelled()) break
    if (failure) throw failure
    while ((pending > LEAD || decoder.decodeQueueSize > LEAD) && !failure && !isCancelled()) await sleep(4)
    decoder.decode(
      new EncodedVideoChunk({
        type: s.is_sync ? 'key' : 'delta',
        timestamp: (s.cts * 1e6) / s.timescale,
        duration: (s.duration * 1e6) / s.timescale,
        data: s.data,
      }),
    )
  }
  if (!isCancelled() && !failure) await decoder.flush().catch((e) => (failure = e))
  await encodeChain
  if (decoder.state !== 'closed') decoder.close()
  if (failure) throw failure
  if (!bank.length) throw new Error('Empty frame bank')
  return bank.sort((a, b) => a.ts - b.ts)
}

export function useVideoScrub(videoSrc: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canvasLive, setCanvasLive] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!video || !canvas || !container) return
    const ctx = canvas.getContext('2d')!

    const s = {
      bank: [] as BankFrame[],
      lru: new Map<number, ImageBitmap | null>(),
      current: 0,
      target: 0,
      ready: false,
      reverted: false,
      painted: false,
      building: false,
      dur: 0,
      span: 1,
      lastPaintIdx: -1,
      disposed: false,
    }

    // ---- scroll span / progress
    const measure = () => {
      s.span = Math.max(1, container.offsetHeight - window.innerHeight)
    }
    const getProgress = () => clamp(window.scrollY / s.span, 0, 1)
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    // ---- duration from the video element
    const onMeta = () => {
      if (Number.isFinite(video.duration)) s.dur = video.duration
    }
    video.addEventListener('loadedmetadata', onMeta)
    onMeta()

    // ---- frame bank lookup
    const nearestIndex = (t: number) => {
      const us = t * 1e6
      const b = s.bank
      let lo = 0
      let hi = b.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (b[mid].ts < us) lo = mid + 1
        else hi = mid
      }
      if (lo > 0 && Math.abs(b[lo - 1].ts - us) < Math.abs(b[lo].ts - us)) lo--
      return lo
    }

    const warmLRU = (i: number) => {
      for (let k = i - 1; k <= i + 2; k++) {
        if (k < 0 || k >= s.bank.length) continue
        if (s.lru.has(k)) {
          const v = s.lru.get(k)!
          s.lru.delete(k)
          s.lru.set(k, v)
          continue
        }
        s.lru.set(k, null)
        createImageBitmap(s.bank[k].blob)
          .then((bmp) => {
            if (s.disposed || !s.lru.has(k)) return bmp.close()
            s.lru.set(k, bmp)
          })
          .catch(() => s.lru.delete(k))
      }
      while (s.lru.size > LRU_MAX) {
        const oldest = s.lru.keys().next().value as number
        s.lru.get(oldest)?.close()
        s.lru.delete(oldest)
      }
    }

    const drawFrame = (t: number) => {
      const i = nearestIndex(t)
      warmLRU(i)
      if (i === s.lastPaintIdx) return
      const bmp = s.lru.get(i)
      if (!bmp) return
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
      s.lastPaintIdx = i
      if (!s.painted) {
        s.painted = true
        setCanvasLive(true)
      }
    }

    // ---- rAF loop
    let raf = 0
    let last = performance.now()
    let lastP = -1
    const reduced = prefersReducedMotion()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const p = getProgress()
      if (p !== lastP) {
        lastP = p
        setScrollProgress(p)
      }
      if (s.dur > 0) {
        s.target = p * s.dur
        if (reduced) s.current = s.target
        else {
          s.current += (s.target - s.current) * (1 - Math.exp(-dt * LERP_TAU))
          if (Math.abs(s.target - s.current) < SNAP) s.current = s.target
        }
        if (s.ready) drawFrame(s.current)
        else if (!video.seeking && Math.abs(video.currentTime - s.current) > 0.01) {
          video.currentTime = s.current
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // ---- build the frame bank after window load
    let watchdog = 0
    const build = async () => {
      if (reduced || typeof VideoDecoder === 'undefined' || s.building) return
      s.building = true
      watchdog = window.setTimeout(() => {
        if (s.ready) return
        s.reverted = true
        s.ready = false
        setCanvasLive(false)
      }, WATCHDOG)
      const cancelled = () => s.disposed || s.reverted
      try {
        const res = await fetch(videoSrc)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const { config, samples } = await demux(await res.arrayBuffer())
        if (cancelled()) return
        if (!s.dur && samples.length) {
          const lastS = samples[samples.length - 1]
          s.dur = (lastS.cts + lastS.duration) / lastS.timescale
        }
        let bank: BankFrame[]
        try {
          bank = await buildBank(config, samples, cancelled)
        } catch {
          if (cancelled()) return
          bank = await buildBank({ ...config, hardwareAcceleration: 'prefer-software' }, samples, cancelled)
        }
        if (cancelled()) return
        s.bank = bank
        s.ready = true
        clearTimeout(watchdog)
      } catch (err) {
        // Fall back to video.currentTime seeking (e.g. CORS or decode failure).
        console.warn('[useVideoScrub] frame bank unavailable, using video seek fallback', err)
        clearTimeout(watchdog)
      } finally {
        s.building = false
      }
    }
    if (document.readyState === 'complete') build()
    else window.addEventListener('load', build, { once: true })

    return () => {
      s.disposed = true
      cancelAnimationFrame(raf)
      clearTimeout(watchdog)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      window.removeEventListener('load', build)
      video.removeEventListener('loadedmetadata', onMeta)
      s.lru.forEach((b) => b?.close())
      s.lru.clear()
    }
  }, [videoSrc])

  return { containerRef, videoRef, canvasRef, scrollProgress, canvasLive }
}
