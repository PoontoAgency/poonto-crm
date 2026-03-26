import { useState } from 'react'
import { useCreateWorkspace } from './useWorkspaces'
import { useAuth } from '@/features/auth/useAuth'
import { X, Building2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
}

const COLORS = ['#E05A3A', '#3B82F6', '#22C55E', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6', '#6366F1']

export default function WorkspaceForm({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#E05A3A')
  const { workspace } = useAuth()
  const createMutation = useCreateWorkspace()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        primary_color: color,
        parent_workspace_id: workspace?.id,
      })
      toast.success(`Workspace "${name}" creato!`)
      setName('')
      setColor('#E05A3A')
      onClose()
    } catch {
      toast.error('Errore nella creazione del workspace')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 rounded-xl border p-6 animate-fade-in"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(224,90,58,0.1)' }}
          >
            <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
              Nuovo workspace
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Crea un workspace per un nuovo cliente
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Nome workspace *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. TechSrl"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                background: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              autoFocus
            />
          </div>

          {/* Colore */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Colore primario
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full cursor-pointer flex-shrink-0"
                  style={{
                    background: c,
                    boxShadow: color === c
                      ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${c}`
                      : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: color }}
            >
              {name.charAt(0).toUpperCase() || 'W'}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                {name || 'Nome workspace'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Anteprima
              </p>
            </div>
          </div>

          {/* Azioni */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                background: 'transparent',
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!name.trim() || createMutation.isPending}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}
            >
              {createMutation.isPending ? 'Creazione...' : 'Crea workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
