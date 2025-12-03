import { ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

export default function PrimaryButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        'bg-primary text-white font-semibold px-5 py-3 rounded-xl shadow-soft hover:bg-primary-muted transition focus:outline-none focus:ring-2 focus:ring-primary/40',
        'w-full md:w-auto text-base',
        className,
      )}
      {...rest}
    />
  )
}
