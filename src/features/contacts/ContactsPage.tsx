import { useState } from 'react'
import { useContacts, useDeleteContact } from './useContacts'
import ContactForm from './ContactForm'
import { formatRelativeDate, getInitials, stringToColor } from '@/lib/utils'
import { Search, Plus, Trash2, Phone, Mail, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Contact, AiScore } from '@/types'

const SCORE_BADGE: Record<AiScore, { label: string; color: string; bg: string }> = {
  hot: { label: '🔥 Caldo', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  warm: { label: '🟡 Tiepido', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  cold: { label: '❄️ Freddo', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  unknown: { label: '—', color: '#555', bg: 'transparent' },
}

// Mock data per sviluppo senza Supabase
const MOCK_CONTACTS: Contact[] = [
  { id: '1', workspace_id: 'w1', first_name: 'Marco', last_name: 'Rossi', email: 'marco@techsrl.it', phone: '+39 333 1234567', company: 'TechSrl', position: 'CEO', tags: ['cliente', 'premium'], ai_score: 'hot', ai_summary: null, ai_updated_at: null, address: null, city: 'Milano', province: 'MI', zip_code: null, avatar_url: null, source: null, custom_fields: {}, owner_id: null, created_by: null, created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-25T14:00:00Z', deleted_at: null },
  { id: '2', workspace_id: 'w1', first_name: 'Laura', last_name: 'Bianchi', email: 'laura@abcsrl.it', phone: '+39 340 9876543', company: 'ABC Srl', position: 'Marketing Manager', tags: ['lead'], ai_score: 'warm', ai_summary: null, ai_updated_at: null, address: null, city: 'Roma', province: 'RM', zip_code: null, avatar_url: null, source: null, custom_fields: {}, owner_id: null, created_by: null, created_at: '2026-03-10T09:00:00Z', updated_at: '2026-03-24T11:00:00Z', deleted_at: null },
  { id: '3', workspace_id: 'w1', first_name: 'Giuseppe', last_name: 'Verdi', email: 'giuseppe@xyzspa.it', phone: '+39 328 5551234', company: 'XYZ Spa', position: 'CTO', tags: ['prospect'], ai_score: 'cold', ai_summary: null, ai_updated_at: null, address: null, city: 'Torino', province: 'TO', zip_code: null, avatar_url: null, source: null, custom_fields: {}, owner_id: null, created_by: null, created_at: '2026-03-15T08:00:00Z', updated_at: '2026-03-20T16:00:00Z', deleted_at: null },
  { id: '4', workspace_id: 'w1', first_name: 'Francesca', last_name: 'Neri', email: 'francesca@newco.it', phone: '+39 347 6667788', company: 'NewCo', position: 'Founder', tags: ['cliente'], ai_score: 'hot', ai_summary: null, ai_updated_at: null, address: null, city: 'Napoli', province: 'NA', zip_code: null, avatar_url: null, source: null, custom_fields: {}, owner_id: null, created_by: null, created_at: '2026-02-20T10:00:00Z', updated_at: '2026-03-26T09:00:00Z', deleted_at: null },
  { id: '5', workspace_id: 'w1', first_name: 'Alessandro', last_name: 'Conti', email: 'ale@fooinc.it', phone: '+39 351 2223344', company: 'FooInc', position: 'Sales Director', tags: ['partner'], ai_score: 'warm', ai_summary: null, ai_updated_at: null, address: null, city: 'Bologna', province: 'BO', zip_code: null, avatar_url: null, source: null, custom_fields: {}, owner_id: null, created_by: null, created_at: '2026-01-15T10:00:00Z', updated_at: '2026-03-22T12:00:00Z', deleted_at: null },
]

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const deleteMutation = useDeleteContact()

  // Usa dati reali se Supabase configurato, altrimenti mock
  const { data: supabaseContacts } = useContacts({ search })
  const contacts = supabaseContacts?.length ? supabaseContacts : MOCK_CONTACTS

  // Filtra mock localmente
  const filteredContacts = contacts.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.first_name.toLowerCase().includes(q) ||
      (c.last_name?.toLowerCase().includes(q)) ||
      (c.email?.toLowerCase().includes(q)) ||
      (c.company?.toLowerCase().includes(q))
    )
  })

  function toggleSelect(id: string) {
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedIds(next)
  }

  function handleBulkDelete() {
    selectedIds.forEach(id => deleteMutation.mutate(id))
    setSelectedIds(new Set())
    toast.success(`${selectedIds.size} contatti eliminati`)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Contatti</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredContacts.length} contatt{filteredContacts.length === 1 ? 'o' : 'i'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca contatti..."
              className="pl-9 pr-3 py-2 rounded-lg border text-sm outline-none w-56"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>

          {/* Bulk delete */}
          {selectedIds.size > 0 && (
            <button onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
              <Trash2 size={14} /> Elimina ({selectedIds.size})
            </button>
          )}

          {/* New contact */}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ background: 'var(--color-primary)' }}>
            <Plus size={14} /> Nuovo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox"
                    checked={selectedIds.size === filteredContacts.length && filteredContacts.length > 0}
                    onChange={() => {
                      if (selectedIds.size === filteredContacts.length) setSelectedIds(new Set())
                      else setSelectedIds(new Set(filteredContacts.map(c => c.id)))
                    }}
                    className="rounded cursor-pointer" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--color-text-secondary)' }}>Azienda</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--color-text-secondary)' }}>Contatto</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}>Tag</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--color-text-secondary)' }}>Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell" style={{ color: 'var(--color-text-secondary)' }}>Ultimo contatto</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => {
                const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ')
                const score = SCORE_BADGE[contact.ai_score]
                return (
                  <tr key={contact.id}
                    className="cursor-pointer"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3">
                      <input type="checkbox"
                        checked={selectedIds.has(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded cursor-pointer" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                          style={{ background: stringToColor(name) }}>
                          {getInitials(name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</p>
                          {contact.position && (
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{contact.position}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {contact.company && (
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          <Building2 size={13} /> {contact.company}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            <Mail size={11} /> {contact.email}
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            <Phone size={11} /> {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(224,90,58,0.15)', color: 'var(--color-primary)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: score.bg, color: score.color }}>
                        {score.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {formatRelativeDate(contact.updated_at)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {search ? 'Nessun contatto trovato' : 'Nessun contatto ancora'}
            </p>
          </div>
        )}
      </div>

      {/* Modal nuovo contatto */}
      {showForm && <ContactForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
