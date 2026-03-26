import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp, Users, Kanban, CheckSquare,
  Calendar, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react'

// Mock KPI
const KPI = {
  pipeline: { value: 19500, change: 12, up: true },
  deals: { value: 8, hot: 2 },
  tasks: { today: 3, overdue: 2 },
  contacts: { total: 47, newThisWeek: 5 },
}

const RECENT_ACTIVITIES = [
  { id: '1', text: 'Stefano ha chiuso deal FooInc (€2.000)', time: '2h fa', icon: '💰' },
  { id: '2', text: 'Nuova proposta inviata a XYZ Spa', time: '5h fa', icon: '📄' },
  { id: '3', text: 'Marco Rossi ha aperto la proposta 2 volte', time: 'ieri', icon: '👀' },
  { id: '4', text: 'Laura Bianchi aggiunta ai contatti', time: 'ieri', icon: '👤' },
  { id: '5', text: 'Task "Follow-up ABC Srl" completato', time: '2 giorni fa', icon: '✅' },
]

const TODAY_TASKS = [
  { id: '1', title: 'Follow-up proposta XYZ Spa', priority: 'medium' as const },
  { id: '2', title: 'Preparare presentazione Poonto', priority: 'medium' as const },
  { id: '3', title: 'Richiamare Marco Rossi', priority: 'high' as const },
]

const PIPELINE_DATA = [
  { name: 'Lead', value: 8000, color: '#6366F1' },
  { name: 'Contattato', value: 1500, color: '#8B5CF6' },
  { name: 'Proposta', value: 8000, color: '#EC4899' },
  { name: 'Negoziazione', value: 0, color: '#F59E0B' },
  { name: 'Chiuso', value: 2000, color: '#22C55E' },
]

const PRIORITY_DOT = { high: '#EF4444', medium: '#F59E0B', low: '#3B82F6' }

export default function DashboardPage() {
  const maxPipelineValue = Math.max(...PIPELINE_DATA.map(d => d.value), 1)

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Buongiorno Stefano 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={<TrendingUp size={18} />} label="Pipeline" value={formatCurrency(KPI.pipeline.value)}
          sub={`${KPI.pipeline.up ? '+' : '-'}${KPI.pipeline.change}%`} subUp={KPI.pipeline.up} />
        <KpiCard icon={<Kanban size={18} />} label="Deal aperti" value={String(KPI.deals.value)}
          sub={`${KPI.deals.hot} caldi`} />
        <KpiCard icon={<CheckSquare size={18} />} label="Task oggi" value={String(KPI.tasks.today)}
          sub={`${KPI.tasks.overdue} scaduti`} subUp={false} />
        <KpiCard icon={<Users size={18} />} label="Contatti" value={String(KPI.contacts.total)}
          sub={`+${KPI.contacts.newThisWeek} questa settimana`} subUp />
      </div>

      {/* AI Briefing */}
      <div className="rounded-xl border p-5 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(224,90,58,0.08), rgba(99,102,241,0.05))', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>AI Briefing</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          Oggi hai <strong>3 task</strong> da completare. Il deal <strong>E-commerce XYZ</strong> è in fase proposta 
          per <strong>€8.000</strong> — Giuseppe Verdi ha aperto il preventivo 2 volte ieri. 
          Suggerimento: <span style={{ color: 'var(--color-primary)' }}>chiamalo entro le 11</span>. 
          Marco Rossi non risponde da 14 giorni — considera un follow-up.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="rounded-xl border p-5"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-text)' }}>
            📈 Pipeline
          </h3>
          <div className="space-y-3">
            {PIPELINE_DATA.map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.name}</span>
                  <span style={{ color: 'var(--color-text)' }}>{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--color-bg)' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / maxPipelineValue) * 100}%`,
                      background: item.color,
                      minWidth: item.value > 0 ? '8px' : '0',
                    }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t flex justify-between text-sm"
            style={{ borderColor: 'var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Totale pipeline</span>
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              {formatCurrency(PIPELINE_DATA.reduce((s, d) => s + d.value, 0))}
            </span>
          </div>
        </div>

        {/* Tasks Today + Recent Activity */}
        <div className="space-y-6">
          {/* Today Tasks */}
          <div className="rounded-xl border p-5"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
              📋 Task di oggi
            </h3>
            <div className="space-y-2">
              {TODAY_TASKS.map(task => (
                <div key={task.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: PRIORITY_DOT[task.priority] }} />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{task.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border p-5"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
              🕐 Attività recenti
            </h3>
            <div className="space-y-3">
              {RECENT_ACTIVITIES.map(a => (
                <div key={a.id} className="flex items-start gap-3">
                  <span className="text-sm flex-shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{a.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, sub, subUp }: {
  icon: React.ReactNode; label: string; value: string; sub: string; subUp?: boolean
}) {
  return (
    <div className="rounded-xl border p-4"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: 'var(--color-text-muted)' }}>{icon}</div>
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{value}</p>
      <div className="flex items-center gap-1">
        {subUp !== undefined && (
          subUp
            ? <ArrowUpRight size={12} style={{ color: 'var(--color-success)' }} />
            : <ArrowDownRight size={12} style={{ color: 'var(--color-danger)' }} />
        )}
        <span className="text-xs" style={{ color: subUp ? 'var(--color-success)' : subUp === false ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
          {sub}
        </span>
      </div>
    </div>
  )
}
