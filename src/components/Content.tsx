import { ArrowRight, ArrowDown } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import Stagger from '@/components/Stagger'
import Logo from '@/components/Logo'
import { scrollToTop, type EnquiryType } from '@/constants'

type EnquireFn = (type: EnquiryType, destination?: string) => void

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=75&auto=format&fit=crop`

const Eyebrow = ({ children }: { children: string }) => (
  <p className="text-xs tracking-[0.3em] uppercase text-navy/60 mb-5 flex items-center gap-3">
    <span className="w-6 h-px bg-gold" />
    {children}
  </p>
)

/* ---------------------------------------------------------------- About */

const PILLARS = [
  ['Decades in the industry', 'Long-standing supplier relationships that turn into better rates, rooms and recovery when plans change.'],
  ['One point of contact', 'A dedicated travel consultant from first idea to safe return — no call centres.'],
  ['Inbound & outbound', 'We send travellers worldwide and host visitors arriving to us, with on-ground teams.'],
  ['Support around the clock', 'Before, during and after the trip. If something moves, we move with it.'],
]

export function About() {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <section id="about" ref={ref} className="bg-sand px-6 sm:px-8 md:px-20 lg:px-32 py-24 md:py-36">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <Stagger visible={inView} className="lg:col-span-7">
          <Eyebrow>About JETSETR</Eyebrow>
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-light uppercase leading-[1.2] tracking-wide text-navy">
            Your ideal travel partner, <span className="text-navy/50">coming in or heading out.</span>
          </h2>
        </Stagger>
        <Stagger visible={inView} delay={150} className="lg:col-span-5 lg:pt-12">
          <p className="text-base md:text-lg leading-relaxed text-navy/75">
            JETSETR is a full-service travel agency built on years in the business. We plan outbound holidays for
            travellers going overseas and handle inbound journeys for guests visiting us — flights, stays, visas,
            transfers, cruises and corporate events, all under one roof.
          </p>
          <a href="#enquire" className="mt-8 inline-flex items-center gap-4 group">
            <span className="text-sm tracking-[0.3em] uppercase text-navy">Talk to a consultant</span>
            <span className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <ArrowRight size={16} />
            </span>
          </a>
        </Stagger>
      </div>

      <div className="mt-20 md:mt-28 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-navy/15">
        {PILLARS.map(([title, body], i) => (
          <Stagger key={title} visible={inView} delay={300 + i * 100} className="pt-8 pb-4 sm:pr-8">
            <p className="text-xs text-gold tracking-[0.2em] mb-4">0{i + 1}</p>
            <h3 className="text-sm tracking-[0.15em] uppercase font-medium text-navy mb-3">{title}</h3>
            <p className="text-sm leading-relaxed text-navy/65">{body}</p>
          </Stagger>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Services */

const SERVICES: { type: EnquiryType; tag: string; title: string; body: string; points: string[] }[] = [
  {
    type: 'destination',
    tag: 'Outbound',
    title: 'Holidays abroad',
    body: 'Hand-built itineraries worldwide, planned around how you like to travel.',
    points: ['Flights & stays', 'Visas & insurance', 'Tours & experiences'],
  },
  {
    type: 'destination',
    tag: 'Inbound',
    title: 'Visiting us',
    body: 'Ground handling for guests arriving from overseas — met, moved and looked after.',
    points: ['Airport transfers', 'Local guides', 'Curated tours'],
  },
  {
    type: 'cruise',
    tag: 'Cruises',
    title: 'Ocean & river',
    body: 'The right ship, cabin and sailing for your dates and budget — plus flights to the port.',
    points: ['Ocean & river', 'Expedition', 'Fly-cruise packages'],
  },
  {
    type: 'mice',
    tag: 'Corporate & MICE',
    title: 'Business travel',
    body: 'Meetings, incentives, conferences and events, managed end-to-end for teams of any size.',
    points: ['Venues & logistics', 'Group air & hotels', 'Incentive trips'],
  },
]

export function Services({ onEnquire }: { onEnquire: EnquireFn }) {
  const { ref, inView } = useInView<HTMLElement>(0.1)
  return (
    <section id="services" ref={ref} className="bg-white px-6 sm:px-8 md:px-20 lg:px-32 py-24 md:py-36">
      <Stagger visible={inView} className="max-w-2xl mb-14 md:mb-20">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-light uppercase leading-[1.2] tracking-wide text-navy">
          Four ways to travel with us
        </h2>
      </Stagger>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10">
        {SERVICES.map((s, i) => (
          <Stagger key={s.tag} visible={inView} delay={150 + i * 100} className="bg-white">
            <button
              onClick={() => onEnquire(s.type)}
              className="group h-full w-full text-left p-8 flex flex-col hover:bg-sand transition-colors duration-300"
            >
              <span className="text-[11px] tracking-[0.25em] uppercase text-gold">{s.tag}</span>
              <h3 className="mt-4 text-xl font-light uppercase tracking-wide text-navy">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">{s.body}</p>
              <ul className="mt-6 space-y-2 text-sm text-navy/80">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-navy/40" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-auto pt-10 inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-navy">
                Enquire
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Stagger>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- Destinations */

const DESTINATIONS = [
  { name: 'Japan', region: 'East Asia', note: 'Temples, onsen and autumn colour', best: 'Mar–May · Oct–Nov', img: img('1493976040374-85c8e12f0c0e') },
  { name: 'Maldives', region: 'Indian Ocean', note: 'Overwater villas and reef diving', best: 'Nov–Apr', img: img('1514282401047-d79a71a590e8') },
  { name: 'Santorini', region: 'Greece', note: 'Caldera sunsets and island hopping', best: 'May–Oct', img: img('1570077188670-e3a8d69ac5ff') },
  { name: 'Dubai', region: 'UAE', note: 'City breaks, desert camps and shopping', best: 'Nov–Mar', img: img('1512453979798-5ea266f8880c') },
  { name: 'Kenya', region: 'East Africa', note: 'Safari and the Great Migration', best: 'Jul–Oct', img: img('1516426122078-c23e76319801') },
  { name: 'Bali', region: 'Indonesia', note: 'Rice terraces, temples and beach villas', best: 'Apr–Oct', img: img('1537996194471-e657df975ab4') },
]

export function Destinations({ onEnquire }: { onEnquire: EnquireFn }) {
  const { ref, inView } = useInView<HTMLElement>(0.1)
  return (
    <section id="destinations" ref={ref} className="bg-sand px-6 sm:px-8 md:px-20 lg:px-32 py-24 md:py-36">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20">
        <Stagger visible={inView} className="max-w-2xl">
          <Eyebrow>Where to next</Eyebrow>
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-light uppercase leading-[1.2] tracking-wide text-navy">
            Our recommendations
          </h2>
        </Stagger>
        <Stagger visible={inView} delay={150} className="max-w-sm">
          <p className="text-sm leading-relaxed text-navy/65">
            A few places our travellers keep coming back from happy. Pick one and we’ll shape it around your dates,
            budget and pace.
          </p>
        </Stagger>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {DESTINATIONS.map((d, i) => (
          <Stagger key={d.name} visible={inView} delay={200 + i * 90}>
            <button onClick={() => onEnquire('destination', d.name)} className="group block w-full text-left">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy/10">
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between text-white">
                  <div>
                    <p className="text-[11px] tracking-[0.25em] uppercase text-white/75">{d.region}</p>
                    <h3 className="mt-2 text-3xl font-light uppercase tracking-wide">{d.name}</h3>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="text-sm text-navy/80">{d.note}</p>
                <p className="shrink-0 text-[11px] tracking-[0.15em] uppercase text-navy/50">Best {d.best}</p>
              </div>
            </button>
          </Stagger>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Footer */

export function Footer() {
  return (
    <footer className="bg-navy text-white px-6 sm:px-8 md:px-20 lg:px-32 pt-20 pb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div className="max-w-md">
          <Logo color="#ffffff" />
          <p className="mt-6 text-sm leading-relaxed text-white/60">
            Your travel partner for inbound and outbound journeys, cruises and corporate MICE.
          </p>
        </div>
        <a href="#enquire" className="inline-flex items-center gap-4 group">
          <span className="text-sm tracking-[0.3em] uppercase text-white/80">Start an enquiry</span>
          <span className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <ArrowRight size={16} />
          </span>
        </a>
      </div>
      <div className="mt-16 pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between gap-4 text-xs tracking-[0.15em] uppercase text-white/45">
        <p>© {new Date().getFullYear()} JETSETR. All rights reserved.</p>
        <a href="/" onClick={scrollToTop} className="inline-flex items-center gap-2 hover:text-white transition-colors">
          Back to top <ArrowDown size={12} className="rotate-180" />
        </a>
      </div>
    </footer>
  )
}
