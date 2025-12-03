import { SelectHTMLAttributes } from 'react'
import classNames from 'classnames'

export default function SelectSimple({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={classNames(
        'border border-border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30',
        'text-base text-ink placeholder:text-ink-soft shadow-sm w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}
