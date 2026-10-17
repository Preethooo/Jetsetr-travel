import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { DARK, NAV_LINKS } from '@/constants'
import Logo from '@/components/Logo'

type Props = { isLight: boolean; onOpenMenu: () => void }

const ease = 'cubic-bezier(0.16,1,0.3,1)'
const entrance = (on: boolean, delay: number) => ({
  opacity: on ? 1 : 0,
  transform: on ? 'translateY(0)' : 'translateY(-12px)',
  transition: `opacity 0.6s ${ease} ${delay}ms, transform 0.6s ${ease} ${delay}ms, color 0.5s`,
})

export default function Navbar({ isLight, onOpenMenu }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [])
  const color = isLight ? '#ffffff' : DARK

  return (
    <nav
      className="absolute top-0 left-0 right-0 z-50 pointer-events-auto px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 flex items-center justify-between transition-colors duration-500"
      style={{ color }}
    >
      {/* Left: links (lg+) / hamburger (<lg) */}
      <div className="flex items-center gap-10 xl:gap-14">
        <a href="#top" className="hidden lg:block" style={entrance(mounted, 0)}>
          <Logo />
        </a>
        <ul className="hidden lg:flex items-center gap-8 xl:gap-10">
          {NAV_LINKS.map((l, i) => (
            <li key={l.label} style={entrance(mounted, i * 80 + 100)}>
              <a href={l.href} className="relative text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70 transition-opacity">
                {l.label}
                {i === 0 && <span className="absolute left-0 right-0 -bottom-3 h-[2px]" style={{ background: color }} />}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="lg:hidden flex flex-col gap-[5px] py-2"
          style={entrance(mounted, 100)}
        >
          <span className="block w-6 h-[2px] transition-colors duration-500" style={{ background: color }} />
          <span className="block w-6 h-[2px] transition-colors duration-500" style={{ background: color }} />
          <span className="block w-4 h-[2px] transition-colors duration-500" style={{ background: color }} />
        </button>
      </div>

      {/* Center logo below lg */}
      <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
        <a href="#top" className="block" style={entrance(mounted, 300)}>
          <Logo />
        </a>
      </div>

      {/* Right cluster */}
      <div className="hidden sm:flex items-center gap-8" style={entrance(mounted, 500)}>
        <a href="#enquire" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
          <span className="text-xs tracking-[0.2em] uppercase font-medium">Enquire</span>
          <span className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500" style={{ background: color }}>
            <ArrowRight size={10} color={isLight ? DARK : '#ffffff'} />
          </span>
        </a>
        <button onClick={onOpenMenu} className="text-xs tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity">
          Menu
        </button>
      </div>
    </nav>
  )
}
