import type { CSSProperties, ReactNode } from 'react'

type Props = { visible: boolean; delay?: number; children: ReactNode; className?: string; style?: CSSProperties }

export default function Stagger({ visible, delay = 0, children, className = '', style }: Props) {
  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
