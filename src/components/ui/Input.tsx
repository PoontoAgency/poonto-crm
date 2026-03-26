import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...rest }: InputProps) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>}
      <input
        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
        style={{
          background: 'var(--color-bg)',
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          color: 'var(--color-text)',
        }}
        {...rest}
      />
      {error && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...rest }: TextareaProps) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>}
      <textarea
        className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-y min-h-[80px]"
        style={{
          background: 'var(--color-bg)',
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          color: 'var(--color-text)',
        }}
        {...rest}
      />
      {error && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  )
}
