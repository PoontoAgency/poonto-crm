import { formatRelativeDate } from '@/lib/utils'
import type { Activity } from '@/types'
import { StickyNote, Mail, Phone, Calendar, ArrowRight, CheckCircle2, Paperclip, Sparkles, Cog } from 'lucide-react'

const ICON_MAP: Record<Activity['type'], React.ReactNode> = {
  note: <StickyNote size={14} />,
  email: <Mail size={14} />,
  call: <Phone size={14} />,
  meeting: <Calendar size={14} />,
  deal_move: <ArrowRight size={14} />,
  task_complete: <CheckCircle2 size={14} />,
  file: <Paperclip size={14} />,
  ai_insight: <Sparkles size={14} />,
  system: <Cog size={14} />,
}

const TYPE_LABELS: Record<Activity['type'], string> = {
  note: 'Nota', email: 'Email', call: 'Chiamata', meeting: 'Meeting',
  deal_move: 'Deal spostato', task_complete: 'Task completato',
  file: 'File', ai_insight: 'AI Insight', system: 'Sistema',
}

interface Props {
  activities: Activity[]
}

export default function Timeline({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Nessuna attività ancora
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, idx) => (
        <div key={activity.id} className="flex gap-3 py-3 animate-fade-in">
          {/* Icon */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              {ICON_MAP[activity.type]}
            </div>
            {idx < activities.length - 1 && (
              <div className="w-px flex-1 mt-1" style={{ background: 'var(--color-border)' }} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                {TYPE_LABELS[activity.type]}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {formatRelativeDate(activity.created_at)}
              </span>
            </div>
            {activity.content && (
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>{activity.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
