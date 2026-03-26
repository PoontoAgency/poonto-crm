import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--color-primary)', color: 'white' },
  secondary: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
  ghost: { background: 'transparent', color: 'var(--color-text-secondary)' },
  danger: { background: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
}

const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export default function Button({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...rest }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      style={variantStyles[variant]}
      disabled={disabled || loading}
      {...rest}>
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon ? icon : null}
      {children}
    </button>
  )
}
