import { useEffect } from 'react'
import { X } from 'lucide-react'
import { DARK, NAV_LINKS } from '@/constants'
import Logo from '@/components/Logo'

type Props = { open: boolean; onClose: () => void }

export default function MobileMenu({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-500 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      style={{ background: DARK, transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      aria-hidden={!open}
    >
      <div className={`h-full flex flex-col transition-transform duration-500 ${open ? 'translate-y-0' : '-translate-y-8'}`}>
        <div className="flex items-center justify-between px-6 sm:px-8 pt-8 sm:pt-12">
          <Logo color="#ffffff" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="flex-1 flex flex-col justify-center">
          {NAV_LINKS.map((l, i) => (
            <li
              key={l.label}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`,
              }}
            >
              <a
                href={l.href}
                onClick={onClose}
                className={`block px-8 sm:px-12 py-3 text-2xl sm:text-3xl font-normal tracking-wide uppercase transition-colors ${
                  i === 0 ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-8 px-8 sm:px-12 pb-10 text-xs tracking-[0.2em] uppercase text-white/60">
          <a href="#enquire" onClick={onClose} className="hover:text-white transition-colors">Enquire</a>
          <a href="#about" onClick={onClose} className="hover:text-white transition-colors">About</a>
        </div>
      </div>
    </div>
  )
}
