import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { ENQUIRY_TYPES, type EnquiryType } from '@/constants'
import { useInView } from '@/hooks/useInView'
import Stagger from '@/components/Stagger'

// Set VITE_ENQUIRY_ENDPOINT (e.g. a Formspree / Getform / your own API URL) to receive submissions as JSON.
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined

type Props = { type: EnquiryType; destination: string; onTypeChange: (t: EnquiryType) => void }

const inputCls =
  'w-full bg-transparent border-0 border-b border-navy/20 focus:border-navy focus:ring-0 outline-none py-3 text-base text-navy placeholder:text-navy/35 transition-colors'

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[11px] tracking-[0.2em] uppercase text-navy/55">{label}</span>
      {children}
    </label>
  )
}

const Select = ({ name, options, required }: { name: string; options: string[]; required?: boolean }) => (
  <select name={name} required={required} defaultValue="" className={`${inputCls} appearance-none cursor-pointer`}>
    <option value="" disabled>
      Select
    </option>
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
)

function TypeFields({ type, destination }: { type: EnquiryType; destination: string }) {
  switch (type) {
    case 'destination':
      return (
        <>
          <Field label="Destination(s)" className="sm:col-span-2">
            <input name="destination" required defaultValue={destination} key={destination} placeholder="e.g. Japan, Maldives" className={inputCls} />
          </Field>
          <Field label="Trip type">
            <Select name="tripType" required options={['Outbound — travelling abroad', 'Inbound — visiting us']} />
          </Field>
          <Field label="Travellers">
            <input name="travellers" type="number" min={1} placeholder="2" className={inputCls} />
          </Field>
          <Field label="Departing">
            <input name="from" type="date" className={inputCls} />
          </Field>
          <Field label="Returning">
            <input name="to" type="date" className={inputCls} />
          </Field>
          <Field label="Budget per person" className="sm:col-span-2">
            <Select name="budget" options={['Value', 'Mid-range', 'Premium', 'Luxury', 'Not sure yet']} />
          </Field>
        </>
      )
    case 'cruise':
      return (
        <>
          <Field label="Cruise region">
            <Select name="region" required options={['Mediterranean', 'Caribbean', 'Alaska', 'Northern Europe', 'Asia', 'Middle East', 'River cruise', 'Expedition / Polar', 'Open to ideas']} />
          </Field>
          <Field label="Preferred cruise line">
            <input name="line" placeholder="Any" className={inputCls} />
          </Field>
          <Field label="Sailing month">
            <input name="month" type="month" className={inputCls} />
          </Field>
          <Field label="Nights">
            <Select name="nights" options={['3–5', '6–9', '10–14', '15+']} />
          </Field>
          <Field label="Cabin">
            <Select name="cabin" options={['Interior', 'Ocean view', 'Balcony', 'Suite']} />
          </Field>
          <Field label="Guests">
            <input name="guests" type="number" min={1} placeholder="2" className={inputCls} />
          </Field>
        </>
      )
    case 'mice':
      return (
        <>
          <Field label="Company">
            <input name="company" required className={inputCls} />
          </Field>
          <Field label="Event type">
            <Select name="eventType" required options={['Meeting', 'Incentive trip', 'Conference', 'Exhibition', 'Corporate travel account']} />
          </Field>
          <Field label="Number of delegates">
            <input name="delegates" type="number" min={1} placeholder="50" className={inputCls} />
          </Field>
          <Field label="Preferred location">
            <input name="location" placeholder="City or country" className={inputCls} />
          </Field>
          <Field label="Event dates" className="sm:col-span-2">
            <input name="dates" placeholder="e.g. 12–15 March, flexible" className={inputCls} />
          </Field>
        </>
      )
    default:
      return (
        <Field label="Subject" className="sm:col-span-2">
          <input name="subject" placeholder="How can we help?" className={inputCls} />
        </Field>
      )
  }
}

export default function EnquiryForm({ type, destination, onTypeChange }: Props) {
  const { ref, inView } = useInView<HTMLElement>(0.1)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => setStatus('idle'), [type])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = { enquiryType: type, ...Object.fromEntries(new FormData(form)) }
    setStatus('sending')
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        console.info('[enquiry] no VITE_ENQUIRY_ENDPOINT set — payload:', data)
      }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="enquire" ref={ref} className="bg-white px-6 sm:px-8 md:px-20 lg:px-32 py-24 md:py-36">
      <div className="grid lg:grid-cols-12 gap-14 lg:gap-16">
        <Stagger visible={inView} className="lg:col-span-4">
          <p className="text-xs tracking-[0.3em] uppercase text-navy/60 mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-gold" />
            Enquire
          </p>
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-light uppercase leading-[1.2] tracking-wide text-navy">
            Plan your next journey
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-navy/65 max-w-sm">
            Tell us a little about your trip. A consultant will come back with ideas and a quote — usually within one
            working day.
          </p>
        </Stagger>

        <Stagger visible={inView} delay={150} className="lg:col-span-8">
          <div role="tablist" className="flex flex-wrap gap-2 mb-10">
            {ENQUIRY_TYPES.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={type === t.id}
                onClick={() => onTypeChange(t.id)}
                className={`px-5 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase border transition-colors duration-300 ${
                  type === t.id ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy/70 hover:border-navy hover:text-navy'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {status === 'sent' ? (
            <div className="py-16 border-t border-navy/15">
              <h3 className="text-2xl font-light uppercase tracking-wide text-navy">Thank you — we’re on it.</h3>
              <p className="mt-4 text-sm text-navy/65">A JETSETR consultant will be in touch shortly.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-xs tracking-[0.25em] uppercase text-navy underline underline-offset-8">
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} key={type} className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              <Field label="Full name">
                <input name="name" required autoComplete="name" className={inputCls} />
              </Field>
              <Field label="Email">
                <input name="email" type="email" required autoComplete="email" className={inputCls} />
              </Field>
              <Field label="Phone">
                <input name="phone" type="tel" autoComplete="tel" className={inputCls} />
              </Field>
              <Field label="Preferred contact">
                <Select name="contactBy" options={['Email', 'Phone', 'WhatsApp']} />
              </Field>

              <TypeFields type={type} destination={destination} />

              <Field label="Anything else we should know?" className="sm:col-span-2">
                <textarea name="message" rows={3} required={type === 'general'} className={`${inputCls} resize-none`} />
              </Field>

              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-6 pt-2">
                <p className="text-xs text-navy/50">
                  {status === 'error' ? 'Something went wrong — please try again.' : 'No obligation. We never share your details.'}
                </p>
                <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-4 group disabled:opacity-50">
                  <span className="text-sm tracking-[0.3em] uppercase text-navy">{status === 'sending' ? 'Sending…' : 'Send enquiry'}</span>
                  <span className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <ArrowRight size={18} />
                  </span>
                </button>
              </div>
            </form>
          )}
        </Stagger>
      </div>
    </section>
  )
}
