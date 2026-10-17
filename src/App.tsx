import { useState } from 'react'
import { ArrowRight, ArrowDown, ChevronUp } from 'lucide-react'
import { useVideoScrub } from '@/hooks/useVideoScrub'
import { DARK, type EnquiryType } from '@/constants'
import Navbar from '@/components/Navbar'
import MobileMenu from '@/components/MobileMenu'
import Stagger from '@/components/Stagger'
import EnquiryForm from '@/components/EnquiryForm'
import { About, Services, Destinations, Footer } from '@/components/Content'

const VIDEO_SRC = '/videos/timeline-2.mp4'

const s1Opacity = (p: number) => (p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.08))
const s2Opacity = (p: number) =>
  p < 0.32 ? 0 : p < 0.4 ? (p - 0.32) / 0.08 : p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.08)
const s3Opacity = (p: number) => (p < 0.67 ? 0 : p < 0.75 ? (p - 0.67) / 0.08 : 1)

const sectionStyle = (opacity: number) => ({ opacity, transition: 'opacity 0.1s ease-out' })

/** Scroll the window so the scene sits at progress p. */
const scrollToProgress = (el: HTMLElement | null, p: number) => {
  if (!el) return
  window.scrollTo({ top: p * (el.offsetHeight - window.innerHeight), behavior: 'smooth' })
}

const softShadow = { textShadow: '0 1px 24px rgba(10,25,45,0.35)' }
const glow = { textShadow: '0 0 28px rgba(255,248,238,0.75)' }

export default function App() {
  const { containerRef, videoRef, canvasRef, scrollProgress: p, canvasLive } = useVideoScrub(VIDEO_SRC)
  const [menuOpen, setMenuOpen] = useState(false)
  const [enquiryType, setEnquiryType] = useState<EnquiryType>('general')
  const [destination, setDestination] = useState('')

  const o1 = s1Opacity(p)
  const o2 = s2Opacity(p)
  const o3 = s3Opacity(p)
  const isLight = p > 0.55

  const enquire = (type: EnquiryType, dest = '') => {
    setEnquiryType(type)
    setDestination(dest)
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <div ref={containerRef} className="relative h-[500vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden bg-sand">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${canvasLive ? 'opacity-100' : 'opacity-0'}`}
          />

          <div className="absolute inset-0 pointer-events-none">
            <Navbar isLight={isLight} onOpenMenu={() => setMenuOpen(true)} />

            {/* Section 1 — hero over the golden peaks */}
            <section className="absolute inset-0" style={sectionStyle(o1)} aria-hidden={o1 === 0}>
              <div className="h-full flex flex-col justify-center px-6 sm:px-8 md:px-20 lg:px-32">
                <Stagger visible={o1 > 0.3}>
                  <h1 className="text-[clamp(2rem,5vw,5rem)] font-light uppercase leading-[1.2] max-w-[14ch]" style={{ color: DARK, ...glow }}>
                    Your ideal travel partner
                  </h1>
                </Stagger>
              </div>
              <Stagger visible={o1 > 0.3} delay={300} className="absolute bottom-12 right-6 sm:right-8 md:right-12">
                <button
                  onClick={() => scrollToProgress(containerRef.current, 0.45)}
                  aria-label="Next"
                  className="pointer-events-auto w-12 h-12 rounded-full border bg-white/60 backdrop-blur-sm flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{ borderColor: `${DARK}80`, color: DARK }}
                >
                  <ArrowRight size={18} />
                </button>
              </Stagger>
            </section>

            {/* Section 2 — above the clouds */}
            <section className="absolute inset-0" style={sectionStyle(o2)} aria-hidden={o2 === 0}>
              <div className="h-full flex items-center justify-center px-6 sm:px-8">
                <Stagger visible={o2 > 0.3} className="max-w-[900px]">
                  <h2
                    className="text-[clamp(1.5rem,4.5vw,4.5rem)] font-extralight tracking-wide leading-[1.3] text-center uppercase"
                    style={{ color: DARK }}
                  >
                    Decades of journeys planned{' '}
                    <span style={{ color: `${DARK}CC` }}>with care and precision</span>{' '}
                    <span style={{ color: `${DARK}80` }}>across every frontier</span>
                  </h2>
                </Stagger>
              </div>
              <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4">
                <Stagger visible={o2 > 0.3} delay={200}>
                  <button
                    onClick={() => scrollToProgress(containerRef.current, 0.85)}
                    aria-label="Next"
                    className="pointer-events-auto w-12 h-12 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{ borderColor: `${DARK}66`, color: DARK }}
                  >
                    <ArrowDown size={18} />
                  </button>
                </Stagger>
                <Stagger visible={o2 > 0.3} delay={350} className="mt-4 flex flex-col items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${DARK}66` }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: DARK }} />
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${DARK}66` }} />
                </Stagger>
                <Stagger visible={o2 > 0.3} delay={500} className="mt-2">
                  <button
                    onClick={() => scrollToProgress(containerRef.current, 0)}
                    aria-label="Back to top"
                    className="pointer-events-auto w-10 h-10 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{ borderColor: `${DARK}4D`, color: `${DARK}CC` }}
                  >
                    <ChevronUp size={16} />
                  </button>
                </Stagger>
              </div>
            </section>

            {/* Section 3 — out over the ocean */}
            <section className="absolute inset-0" style={sectionStyle(o3)} aria-hidden={o3 === 0}>
              <div className="h-full flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32">
                <div className="max-w-2xl text-left" style={softShadow}>
                  <Stagger visible={o3 > 0.3}>
                    <p className="text-white/80 text-lg tracking-wide mb-4">Cruises | MICE | Holidays</p>
                  </Stagger>
                  <Stagger visible={o3 > 0.3} delay={150}>
                    <h2 className="text-[clamp(2rem,4vw,4rem)] font-light text-white leading-[1.2] uppercase tracking-wide mb-8">
                      Sail further,
                      <br />
                      travel smarter.
                    </h2>
                  </Stagger>
                  <Stagger visible={o3 > 0.3} delay={300}>
                    <a href="#enquire" className="pointer-events-auto inline-flex items-center gap-4 group">
                      <span className="text-sm tracking-[0.3em] text-white/90 uppercase">Plan your journey</span>
                      <span className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <ArrowRight size={16} />
                      </span>
                    </a>
                  </Stagger>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <About />
      <Services onEnquire={enquire} />
      <Destinations onEnquire={(t, d) => enquire(t, d)} />
      <EnquiryForm type={enquiryType} destination={destination} onTypeChange={setEnquiryType} />
      <Footer />

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  )
}
