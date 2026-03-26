import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, PieChart, CheckSquare, Plus, Settings, Building2, X } from 'lucide-react'

interface PaletteItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  group: string
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // ⌘K / Ctrl+K per aprire
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input quando si apre
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const goTo = useCallback(
    (path: string) => {
      navigate(path)
      setOpen(false)
    },
    [navigate]
  )

  // Items navigabili
  const allItems: PaletteItem[] = [
    // Navigazione
    { id: 'nav-dash', label: 'Dashboard', icon: <PieChart size={16} />, action: () => goTo('/'), group: 'Navigazione' },
    { id: 'nav-contacts', label: 'Contatti', icon: <User size={16} />, action: () => goTo('/contacts'), group: 'Navigazione' },
    { id: 'nav-pipeline', label: 'Pipeline', icon: <PieChart size={16} />, action: () => goTo('/pipeline'), group: 'Navigazione' },
    { id: 'nav-tasks', label: 'Attività', icon: <CheckSquare size={16} />, action: () => goTo('/tasks'), group: 'Navigazione' },
    { id: 'nav-workspaces', label: 'Workspace', icon: <Building2 size={16} />, action: () => goTo('/workspaces'), group: 'Navigazione' },
    { id: 'nav-settings', label: 'Impostazioni', icon: <Settings size={16} />, action: () => goTo('/settings'), group: 'Navigazione' },
    // Azioni rapide
    { id: 'act-new-contact', label: 'Nuovo contatto', description: 'Crea un contatto', icon: <Plus size={16} />, action: () => goTo('/contacts?new=1'), group: 'Azioni rapide' },
    { id: 'act-new-deal', label: 'Nuovo deal', description: 'Crea un deal nella pipeline', icon: <Plus size={16} />, action: () => goTo('/pipeline?new=1'), group: 'Azioni rapide' },
    { id: 'act-new-task', label: 'Nuova attività', description: 'Crea un task', icon: <Plus size={16} />, action: () => goTo('/tasks?new=1'), group: 'Azioni rapide' },
  ]

  // Filtro fuzzy
  const filtered = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
        )
      })
    : allItems

  // Raggruppa per gruppo
  const groups = filtered.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  // Navigazione tastiera
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      filtered[selectedIndex]?.action()
    }
  }

  if (!open) return null

  let flatIndex = -1

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-xl border overflow-hidden animate-fade-in"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cerca pagine, azioni..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text)' }}
          />
          <button
            onClick={() => setOpen(false)}
            className="px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Nessun risultato per "{query}"
              </p>
            </div>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <div
                  className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {group}
                </div>
                {items.map((item) => {
                  flatIndex++
                  const idx = flatIndex
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer"
                      style={{
                        background: idx === selectedIndex ? 'var(--color-surface-hover)' : 'transparent',
                        color: 'var(--color-text)',
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span style={{ color: idx === selectedIndex ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.description && (
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {item.description}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div
          className="px-4 py-2 border-t flex items-center gap-4 text-[10px]"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <span>↑↓ naviga</span>
          <span>⏎ seleziona</span>
          <span>esc chiudi</span>
        </div>
      </div>
    </div>
  )
}
