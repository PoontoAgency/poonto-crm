import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { ChevronDown, Plus, Check, Building2 } from 'lucide-react'
import type { Workspace } from '@/types'

export default function WorkspaceSwitcher() {
  const { workspace, workspaces, switchWorkspace } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Chiudi al click fuori
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSwitch(ws: Workspace) {
    switchWorkspace(ws)
    setOpen(false)
  }

  if (!workspaces.length) return null

  return (
    <div ref={ref} className="relative px-3 mb-2">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer"
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: workspace?.primary_color || 'var(--color-primary)' }}
        >
          {workspace?.name?.charAt(0).toUpperCase() || 'W'}
        </div>
        <span className="flex-1 text-left truncate text-xs font-medium">
          {workspace?.name || 'Workspace'}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--color-text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-3 right-3 top-full mt-1 rounded-lg border z-50 animate-fade-in overflow-hidden"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSwitch(ws)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs cursor-pointer"
                style={{
                  background: ws.id === workspace?.id ? 'var(--color-surface-hover)' : 'transparent',
                  color: 'var(--color-text)',
                }}
                onMouseEnter={(e) => {
                  if (ws.id !== workspace?.id) e.currentTarget.style.background = 'var(--color-surface-hover)'
                }}
                onMouseLeave={(e) => {
                  if (ws.id !== workspace?.id) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                  style={{ background: ws.primary_color || 'var(--color-primary)' }}
                >
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-left truncate">{ws.name}</span>
                {ws.id === workspace?.id && (
                  <Check size={12} style={{ color: 'var(--color-success)' }} />
                )}
              </button>
            ))}
          </div>

          <div
            className="border-t px-3 py-2"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              onClick={() => {
                setOpen(false)
                window.location.href = '/workspaces'
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(224,90,58,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Building2 size={12} />
              <span>Gestisci workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
