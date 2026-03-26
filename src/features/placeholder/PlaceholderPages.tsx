import { LayoutDashboard, Users, Kanban, CheckSquare, Building2, Settings } from 'lucide-react'

function PlaceholderPage({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <Icon size={28} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{title}</h1>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        In arrivo nella prossima milestone 🚀
      </p>
    </div>
  )
}

export function DashboardPage() { return <PlaceholderPage title="Dashboard" icon={LayoutDashboard} /> }
export function ContactsPage() { return <PlaceholderPage title="Contatti" icon={Users} /> }
export function PipelinePage() { return <PlaceholderPage title="Pipeline" icon={Kanban} /> }
export function TasksPage() { return <PlaceholderPage title="Attività" icon={CheckSquare} /> }
export function WorkspacesPage() { return <PlaceholderPage title="Workspace" icon={Building2} /> }
export function SettingsPage() { return <PlaceholderPage title="Impostazioni" icon={Settings} /> }
