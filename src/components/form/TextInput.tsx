import { InputHTMLAttributes } from 'react'
import classNames from 'classnames'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean
}

export default function TextInput({ fullWidth = true, className, ...rest }: TextInputProps) {
  return (
    <input
      className={classNames(
        'border border-border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30',
        'text-base text-ink placeholder:text-ink-soft shadow-sm',
        fullWidth ? 'w-full' : undefined,
        className,
      )}
      {...rest}
    />
  )
}
