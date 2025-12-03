import { ReactNode } from 'react'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-soft">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="text-sm md:text-base text-ink-soft">{children}</div>
    </div>
  )
}
