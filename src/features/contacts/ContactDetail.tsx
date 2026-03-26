import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Timeline from './Timeline'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import {
  ArrowLeft, Mail, Phone, Building2, MapPin,
  StickyNote, PhoneCall, Calendar, Paperclip, Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import type { Contact, Activity } from '@/types'

// Mock data per sviluppo
const MOCK_CONTACT: Contact = {
  id: '1', workspace_id: 'w1', first_name: 'Marco', last_name: 'Rossi',
  email: 'marco@techsrl.it', phone: '+39 333 1234567', company: 'TechSrl',
  position: 'CEO', address: 'Via Roma 10', city: 'Milano', province: 'MI', zip_code: '20100',
  avatar_url: null, tags: ['cliente', 'premium'], source: 'website',
  ai_score: 'hot', ai_summary: 'Interessato al progetto e-commerce. Budget confermato. Ha chiesto 2 preventivi. Risponde rapidamente alle email.',
  ai_updated_at: '2026-03-25T10:00:00Z',
  custom_fields: {}, owner_id: null, created_by: null,
  created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-25T14:00:00Z', deleted_at: null,
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', workspace_id: 'w1', contact_id: '1', deal_id: 'd1', type: 'note', content: 'Chiamata fatta. Interessato al progetto e-commerce. Budget circa €3.000-5.000', metadata: {}, created_by: null, created_at: '2026-03-25T14:00:00Z' },
  { id: '2', workspace_id: 'w1', contact_id: '1', deal_id: 'd1', type: 'email', content: 'Inviato preventivo dettagliato con 3 opzioni di prezzo', metadata: {}, created_by: null, created_at: '2026-03-24T11:00:00Z' },
  { id: '3', workspace_id: 'w1', contact_id: '1', deal_id: 'd1', type: 'deal_move', content: 'Deal "Sito web TechSrl" spostato da Lead a Contattato', metadata: {}, created_by: null, created_at: '2026-03-23T09:00:00Z' },
  { id: '4', workspace_id: 'w1', contact_id: '1', deal_id: null, type: 'call', content: 'Primo contatto telefonico positivo. Ha visitato i nostri lavori precedenti.', metadata: {}, created_by: null, created_at: '2026-03-20T16:00:00Z' },
  { id: '5', workspace_id: 'w1', contact_id: '1', deal_id: null, type: 'system', content: 'Contatto creato', metadata: {}, created_by: null, created_at: '2026-03-01T10:00:00Z' },
]

const SCORE_BADGE: Record<string, { label: string; color: string }> = {
  hot: { label: '🔥 Caldo', color: '#EF4444' }, warm: { label: '🟡 Tiepido', color: '#F59E0B' },
  cold: { label: '❄️ Freddo', color: '#3B82F6' }, unknown: { label: '—', color: '#555' },
}

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [noteText, setNoteText] = useState('')
  const [activities, setActivities] = useState(MOCK_ACTIVITIES)
  const contact = MOCK_CONTACT // In produzione: useContact(id)
  const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ')
  const score = SCORE_BADGE[contact.ai_score]

  function addNote(type: Activity['type']) {
    if (!noteText.trim()) return
    const newActivity: Activity = {
      id: `a${Date.now()}`, workspace_id: 'w1', contact_id: contact.id, deal_id: null,
      type, content: noteText, metadata: {}, created_by: null,
      created_at: new Date().toISOString(),
    }
    setActivities([newActivity, ...activities])
    setNoteText('')
    toast.success('Attività aggiunta!')
  }

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate('/contacts')}
        className="flex items-center gap-1 text-sm mb-4 cursor-pointer"
        style={{ color: 'var(--color-text-secondary)' }}>
        <ArrowLeft size={14} /> Contatti
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar — Info */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="text-center mb-4">
              <Avatar name={name} size="lg" />
              <h2 className="text-base font-semibold mt-3" style={{ color: 'var(--color-text)' }}>{name}</h2>
              {contact.position && <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{contact.position}</p>}
            </div>

            <div className="space-y-3 text-sm">
              {contact.company && (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Building2 size={14} /> {contact.company}
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Mail size={14} /> <a href={`mailto:${contact.email}`} style={{ color: 'var(--color-primary)' }}>{contact.email}</a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Phone size={14} /> {contact.phone}
                </div>
              )}
              {contact.city && (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <MapPin size={14} /> {contact.city} ({contact.province})
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Tag</p>
              <div className="flex gap-1 flex-wrap">
                {contact.tags.map(tag => <Badge key={tag} label={tag} />)}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Creato: {formatDate(contact.created_at)}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Aggiornato: {formatDate(contact.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Center — Timeline */}
        <div className="lg:col-span-6">
          {/* Quick compose */}
          <div className="rounded-xl border p-4 mb-4"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)}
              placeholder="Scrivi una nota, registra una chiamata..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none mb-3"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            <div className="flex gap-2">
              <button onClick={() => addNote('note')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(224,90,58,0.1)', color: 'var(--color-primary)' }}>
                <StickyNote size={12} /> Nota
              </button>
              <button onClick={() => addNote('call')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
                <PhoneCall size={12} /> Chiamata
              </button>
              <button onClick={() => addNote('email')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
                <Mail size={12} /> Email
              </button>
              <button onClick={() => addNote('meeting')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
                <Calendar size={12} /> Meeting
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border p-5"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-text)' }}>Timeline</h3>
            <Timeline activities={activities} />
          </div>
        </div>

        {/* Right sidebar — AI */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border p-5"
            style={{ background: 'linear-gradient(135deg, rgba(224,90,58,0.05), rgba(99,102,241,0.03))', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🤖</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>AI Insights</span>
            </div>

            {/* Score */}
            <div className="mb-4">
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Score</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: `${score.color}15`, color: score.color }}>
                {score.label}
              </span>
            </div>

            {/* Summary */}
            {contact.ai_summary && (
              <div className="mb-4">
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Riassunto</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {contact.ai_summary}
                </p>
              </div>
            )}

            {/* Suggestions */}
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>Suggerimenti</p>
              <div className="space-y-2">
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                  📞 Chiamare entro le 11 — momento migliore
                </div>
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                  📧 Inviare case study settore tech
                </div>
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                  💰 Proporre upsell manutenzione annuale
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
