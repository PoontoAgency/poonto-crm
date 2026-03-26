import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import { X, Trophy, XCircle, Calendar, DollarSign, User } from 'lucide-react'
import { toast } from 'sonner'
import type { Deal } from '@/types'

interface Props {
  deal: Deal & { contactName?: string }
  onClose: () => void
  onWin?: (id: string) => void
  onLose?: (id: string) => void
}

export default function DealSlideOver({ deal, onClose, onWin, onLose }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(deal.name)
  const [value, setValue] = useState(deal.value)

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />

      {/* Slide panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto animate-slide-in-right"
        style={{ background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{deal.name}</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Value */}
          <div className="text-center py-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {formatCurrency(deal.value)}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {deal.status === 'won' ? '✅ Vinto' : deal.status === 'lost' ? '❌ Perso' : '🔵 Aperto'}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {deal.contactName && (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Contatto</span>
                <div className="flex items-center gap-2">
                  <Avatar name={deal.contactName} size="sm" />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{deal.contactName}</span>
                </div>
              </div>
            )}

            {deal.expected_close_date && (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Chiusura prevista</span>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {formatDate(deal.expected_close_date)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-2">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Creato</span>
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>{formatDate(deal.created_at)}</span>
            </div>
          </div>

          {/* Actions */}
          {deal.status === 'open' && (
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => { onWin?.(deal.id); onClose(); toast.success('Deal vinto! 🎉') }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                <Trophy size={14} /> Vinto
              </button>
              <button onClick={() => { onLose?.(deal.id); onClose(); toast.info('Deal perso') }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                <XCircle size={14} /> Perso
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
