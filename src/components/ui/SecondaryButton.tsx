import { ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

export default function SecondaryButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        'bg-white text-ink font-semibold px-5 py-3 rounded-xl border border-border hover:border-primary transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30',
        'w-full md:w-auto text-base',
        className,
      )}
      {...rest}
    />
  )
}
