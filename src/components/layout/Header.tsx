import { useState } from 'react'
import { useUiStore } from '@/store/uiStore'
import { useAuth } from '@/features/auth/useAuth'
import { signOut } from '@/features/auth/authService'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, Search } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import CommandPalette from '@/components/ui/CommandPalette'

export default function Header() {
  const { toggleSidebar } = useUiStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 md:px-8 border-b"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

        {/* Left: hamburger (mobile) + search */}
        <div className="flex items-center gap-3">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <Menu size={18} />
          </button>

          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', minWidth: '220px' }}>
            <Search size={14} />
            <span>Cerca... ⌘K</span>
          </button>
        </div>

        {/* Right: user */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{ background: 'var(--color-primary)', color: 'white' }}>
            {getInitials(user?.email || 'U')}
          </div>
          <button onClick={handleLogout} title="Logout"
            className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {paletteOpen && <CommandPalette />}
    </>
  )
}

