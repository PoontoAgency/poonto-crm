import type { ReactNode } from 'react'

export default function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description?: string; action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        {icon}
      </div>
      <h3 className="text-base font-medium mb-1" style={{ color: 'var(--color-text)' }}>{title}</h3>
      {description && <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>}
      {action}
    </div>
  )
}
