import { useState } from 'react'
import { useCreateContact } from './useContacts'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  onClose: () => void
}

export default function ContactForm({ onClose }: Props) {
  const createMutation = useCreateContact()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState('')

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createMutation.mutateAsync(form)
      toast.success('Contatto creato!')
      onClose()
    } catch {
      toast.error('Errore nella creazione')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Nuovo contatto</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome e Cognome */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Nome *</label>
              <input type="text" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)}
                required placeholder="Mario"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Cognome</label>
              <input type="text" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Rossi"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          </div>

          {/* Email e Telefono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                placeholder="mario@azienda.it"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Telefono</label>
              <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+39 333 ..."
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          </div>

          {/* Azienda e Ruolo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Azienda</label>
              <input type="text" value={form.company} onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Srl"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Ruolo</label>
              <input type="text" value={form.position} onChange={(e) => handleChange('position', e.target.value)}
                placeholder="CEO"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Tag</label>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer"
                  style={{ background: 'rgba(224,90,58,0.15)', color: 'var(--color-primary)' }}
                  onClick={() => removeTag(tag)}>
                  {tag} <X size={10} />
                </span>
              ))}
            </div>
            <input type="text" value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Scrivi e premi Invio"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}>
              Annulla
            </button>
            <button type="submit" disabled={createMutation.isPending || !form.first_name}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}>
              {createMutation.isPending ? 'Salvo...' : 'Crea contatto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
