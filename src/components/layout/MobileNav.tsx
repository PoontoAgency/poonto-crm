import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Kanban, CheckSquare, Menu } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/contacts', icon: Users, label: 'Contatti' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/tasks', icon: CheckSquare, label: 'Attività' },
  { to: '/settings', icon: Menu, label: 'Altro' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className="flex-1 flex flex-col items-center py-2 gap-0.5"
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
          })}>
          <Icon size={18} />
          <span className="text-[10px]">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
