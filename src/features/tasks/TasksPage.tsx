import { useState } from 'react'
import { formatRelativeDate, isOverdue } from '@/lib/utils'
import { Plus, CheckCircle2, Circle, Calendar, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Task } from '@/types'

type Filter = 'today' | 'week' | 'overdue' | 'all'

const MOCK_TASKS: Task[] = [
  { id: 't1', workspace_id: 'w1', title: 'Richiamare Marco Rossi (TechSrl)', description: null, contact_id: '1', deal_id: 'd1', due_date: '2026-03-24', due_time: null, priority: 'high', assigned_to: null, completed_at: null, created_by: null, created_at: '2026-03-20', updated_at: '2026-03-20' },
  { id: 't2', workspace_id: 'w1', title: 'Inviare preventivo ABC Srl', description: null, contact_id: '2', deal_id: 'd3', due_date: '2026-03-25', due_time: null, priority: 'high', assigned_to: null, completed_at: null, created_by: null, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 't3', workspace_id: 'w1', title: 'Follow-up proposta XYZ Spa', description: null, contact_id: '3', deal_id: 'd4', due_date: '2026-03-26', due_time: null, priority: 'medium', assigned_to: null, completed_at: null, created_by: null, created_at: '2026-03-22', updated_at: '2026-03-22' },
  { id: 't4', workspace_id: 'w1', title: 'Preparare presentazione Poonto', description: null, contact_id: null, deal_id: null, due_date: '2026-03-26', due_time: null, priority: 'medium', assigned_to: null, completed_at: null, created_by: null, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 't5', workspace_id: 'w1', title: 'Riunione team settimanale', description: null, contact_id: null, deal_id: null, due_date: '2026-03-28', due_time: null, priority: 'low', assigned_to: null, completed_at: null, created_by: null, created_at: '2026-03-20', updated_at: '2026-03-20' },
  { id: 't6', workspace_id: 'w1', title: 'Review contratto FooInc', description: null, contact_id: '5', deal_id: 'd5', due_date: '2026-03-30', due_time: null, priority: 'low', assigned_to: null, completed_at: null, created_by: null, created_at: '2026-03-22', updated_at: '2026-03-22' },
]

const PRIORITY_STYLE = {
  high: { color: '#EF4444', label: 'Alta' },
  medium: { color: '#F59E0B', label: 'Media' },
  low: { color: '#3B82F6', label: 'Bassa' },
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [filter, setFilter] = useState<Filter>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDue, setNewDue] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const pendingTasks = tasks.filter(t => !t.completed_at)
  const filteredTasks = pendingTasks.filter(t => {
    if (!t.due_date) return filter === 'all'
    if (filter === 'today') return t.due_date === today
    if (filter === 'overdue') return t.due_date < today
    if (filter === 'week') {
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() + 7)
      return t.due_date <= weekEnd.toISOString().split('T')[0]
    }
    return true
  })

  // Raggruppa: scaduti, oggi, prossimi
  const overdue = filteredTasks.filter(t => t.due_date && t.due_date < today)
  const todayTasks = filteredTasks.filter(t => t.due_date === today)
  const upcoming = filteredTasks.filter(t => !t.due_date || t.due_date > today)

  function completeTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed_at: new Date().toISOString() } : t))
    toast.success('Task completato ✅')
  }

  function addTask() {
    if (!newTitle) return
    const task: Task = {
      id: `t${Date.now()}`, workspace_id: 'w1', title: newTitle, description: null,
      contact_id: null, deal_id: null, due_date: newDue || null, due_time: null,
      priority: 'medium', assigned_to: null, completed_at: null, created_by: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    setTasks(prev => [...prev, task])
    setNewTitle('')
    setNewDue('')
    setShowAdd(false)
    toast.success('Task creato!')
  }

  function TaskGroup({ title, icon, color, items }: { title: string; icon: React.ReactNode; color: string; items: Task[] }) {
    if (items.length === 0) return null
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="text-sm font-medium" style={{ color }}>{title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
            {items.length}
          </span>
        </div>
        <div className="space-y-1">
          {items.map(task => (
            <div key={task.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border group"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}>
              <button onClick={() => completeTask(task.id)} className="cursor-pointer flex-shrink-0"
                style={{ color: 'var(--color-text-muted)' }}>
                <Circle size={18} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>{task.title}</p>
              </div>
              {task.due_date && (
                <div className="flex items-center gap-1 text-xs flex-shrink-0"
                  style={{ color: isOverdue(task.due_date) ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                  <Calendar size={11} />
                  {formatRelativeDate(task.due_date)}
                </div>
              )}
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: PRIORITY_STYLE[task.priority].color }} title={PRIORITY_STYLE[task.priority].label} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Attività</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {pendingTasks.length} task in sospeso
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={14} /> Nuovo task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([['all', 'Tutti'], ['today', 'Oggi'], ['week', 'Questa settimana'], ['overdue', 'Scaduti']] as [Filter, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{
              background: filter === key ? 'rgba(224,90,58,0.15)' : 'var(--color-surface)',
              color: filter === key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: `1px solid ${filter === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Task groups */}
      <TaskGroup title="Scaduti" icon={<AlertCircle size={14} style={{ color: 'var(--color-danger)' }} />}
        color="var(--color-danger)" items={overdue} />
      <TaskGroup title="Oggi" icon={<Calendar size={14} style={{ color: 'var(--color-warning)' }} />}
        color="var(--color-warning)" items={todayTasks} />
      <TaskGroup title="Prossimi" icon={<CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />}
        color="var(--color-success)" items={upcoming} />

      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Nessun task 🎉</p>
        </div>
      )}

      {/* Add task inline */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-sm p-6 rounded-xl border animate-fade-in"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Nuovo task</h3>
              <button onClick={() => setShowAdd(false)} className="cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Cosa devi fare?" autoFocus
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-3"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              onKeyDown={(e) => { if (e.key === 'Enter') addTask() }} />
            <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-4"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            <button onClick={addTask} disabled={!newTitle}
              className="w-full py-2 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}>Crea task</button>
          </div>
        </div>
      )}
    </div>
  )
}
