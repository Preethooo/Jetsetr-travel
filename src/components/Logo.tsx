type Props = { color?: string; className?: string; showMark?: boolean }

/** JETSETR: an orbit (the globe) crossed by a rising contrail, with the wordmark set wide. */
export default function Logo({ color = 'currentColor', className = '', showMark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} style={{ color }} aria-label="JETSETR">
      {showMark && (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.2" />
          <path d="M3.5 22.5C9.5 12 19 8 28 9.4" stroke="#C9A46A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M29 9.5 24 7l1.2 2.7-1.9 2.2z" fill="currentColor" />
        </svg>
      )}
      <span className="text-[15px] font-medium tracking-[0.42em] leading-none -mr-[0.42em]">JETSETR</span>
    </span>
  )
}
