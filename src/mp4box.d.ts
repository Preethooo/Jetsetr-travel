declare module 'mp4box' {
  export interface MP4Sample {
    number: number
    track_id: number
    timescale: number
    cts: number
    dts: number
    duration: number
    is_sync: boolean
    data: Uint8Array
  }
  export interface MP4VideoTrack {
    id: number
    codec: string
    timescale: number
    duration: number
    nb_samples: number
    video: { width: number; height: number }
  }
  export interface MP4Info {
    duration: number
    timescale: number
    videoTracks: MP4VideoTrack[]
  }
  export type MP4ArrayBuffer = ArrayBuffer & { fileStart: number }
  export interface MP4File {
    onReady?: (info: MP4Info) => void
    onError?: (e: string) => void
    onSamples?: (id: number, user: unknown, samples: MP4Sample[]) => void
    appendBuffer(data: MP4ArrayBuffer): number
    start(): void
    stop(): void
    flush(): void
    setExtractionOptions(id: number, user?: unknown, options?: { nbSamples?: number }): void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTrackById(id: number): any
  }
  export class DataStream {
    static BIG_ENDIAN: boolean
    constructor(buffer?: ArrayBuffer, byteOffset?: number, endianness?: boolean)
    buffer: ArrayBuffer
  }
  export function createFile(): MP4File
  const MP4Box: { createFile: typeof createFile; DataStream: typeof DataStream }
  export default MP4Box
}
