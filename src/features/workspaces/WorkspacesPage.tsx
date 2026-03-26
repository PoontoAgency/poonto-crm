import { useState } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { useDeleteWorkspace } from './useWorkspaces'
import WorkspaceForm from './WorkspaceForm'
import { Building2, Plus, Users, Calendar, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function WorkspacesPage() {
  const { workspace, workspaces, switchWorkspace } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const deleteMutation = useDeleteWorkspace()

  // Workspace figli (del workspace corrente come agenzia)
  const childWorkspaces = workspaces.filter(
    (ws) => ws.parent_workspace_id === workspace?.id
  )
  // Il workspace "padre" è quello senza parent (o il primo)
  const parentWorkspace = workspaces.find((ws) => !ws.parent_workspace_id)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare il workspace "${name}"? Questa azione è irreversibile.`)) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success(`Workspace "${name}" eliminato`)
    } catch {
      toast.error('Errore nell\'eliminazione')
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Workspace
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Gestisci i workspace della tua agenzia
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
          style={{ background: 'var(--color-primary)' }}
        >
          <Plus size={16} />
          Nuovo workspace
        </button>
      </div>

      {/* Owner workspace (agenzia) */}
      {parentWorkspace && (
        <div className="mb-8">
          <h3
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Workspace principale
          </h3>
          <WorkspaceCard
            ws={parentWorkspace}
            isActive={parentWorkspace.id === workspace?.id}
            isParent
            onSwitch={() => switchWorkspace(parentWorkspace)}
          />
        </div>
      )}

      {/* Workspace figli */}
      <div>
        <h3
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Workspace clienti ({childWorkspaces.length})
        </h3>

        {childWorkspaces.length === 0 ? (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <Building2
              size={40}
              className="mx-auto mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Nessun workspace cliente
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Crea un workspace per gestire il CRM dei tuoi clienti
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
              style={{ background: 'var(--color-primary)' }}
            >
              <Plus size={14} className="inline mr-1" />
              Crea il primo workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {childWorkspaces.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                ws={ws}
                isActive={ws.id === workspace?.id}
                onSwitch={() => switchWorkspace(ws)}
                onDelete={() => handleDelete(ws.id, ws.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form modale */}
      <WorkspaceForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}

function WorkspaceCard({
  ws,
  isActive,
  isParent,
  onSwitch,
  onDelete,
}: {
  ws: { id: string; name: string; primary_color: string; plan: string; created_at: string }
  isActive: boolean
  isParent?: boolean
  onSwitch: () => void
  onDelete?: () => void
}) {
  return (
    <div
      className="rounded-xl border p-4 transition-all"
      style={{
        background: 'var(--color-surface)',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
        boxShadow: isActive ? '0 0 0 1px var(--color-primary)' : 'none',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: ws.primary_color || 'var(--color-primary)' }}
          >
            {ws.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {ws.name}
            </h4>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: isParent ? 'rgba(224,90,58,0.1)' : 'var(--color-bg)',
                color: isParent ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              {isParent ? 'Agenzia' : ws.plan}
            </span>
          </div>
        </div>

        {isActive && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}
          >
            Attivo
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <span className="flex items-center gap-1">
          <Users size={12} /> 0 membri
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {formatDate(ws.created_at)}
        </span>
      </div>

      <div className="flex gap-2">
        {!isActive && (
          <button
            onClick={onSwitch}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <ExternalLink size={12} /> Entra
          </button>
        )}
        {onDelete && !isParent && (
          <button
            onClick={onDelete}
            className="px-2 py-1.5 rounded-lg text-xs cursor-pointer"
            style={{ color: 'var(--color-danger)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-danger-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
