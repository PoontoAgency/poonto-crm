import { NavLink } from 'react-router-dom'
import { useUiStore } from '@/store/uiStore'
import WorkspaceSwitcher from '@/features/workspaces/WorkspaceSwitcher'
import {
  LayoutDashboard, Users, Kanban, CheckSquare,
  Settings, Building2, X
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts', icon: Users, label: 'Contatti' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/tasks', icon: CheckSquare, label: 'Attività' },
  { to: '/workspaces', icon: Building2, label: 'Workspace' },
  { to: '/settings', icon: Settings, label: 'Impostazioni' },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUiStore()

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b"
          style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'var(--color-primary)' }}>
              P
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              Poonto CRM
            </span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}
            style={{ color: 'var(--color-text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="py-3">
          <WorkspaceSwitcher />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'active-nav' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'rgba(224, 90, 58, 0.1)' : 'transparent',
              })}
              end={to === '/'}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Poonto CRM v0.1.0
          </p>
        </div>
      </aside>
    </>
  )
}
