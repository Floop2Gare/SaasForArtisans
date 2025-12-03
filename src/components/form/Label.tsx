import { ReactNode } from 'react'

export default function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-base font-semibold text-ink">
      {children}
    </label>
  )
}
