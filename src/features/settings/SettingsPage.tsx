import { useState } from 'react'
import { Building2, Users, Kanban, Palette, Bell, Save, Plus, GripVertical, Trash2, Mail } from 'lucide-react'
import { toast } from 'sonner'

type Tab = 'company' | 'team' | 'pipeline' | 'fields' | 'notifications'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'company', label: 'Azienda', icon: <Building2 size={16} /> },
  { key: 'team', label: 'Team', icon: <Users size={16} /> },
  { key: 'pipeline', label: 'Pipeline', icon: <Kanban size={16} /> },
  { key: 'fields', label: 'Campi custom', icon: <Palette size={16} /> },
  { key: 'notifications', label: 'Notifiche', icon: <Bell size={16} /> },
]

const DEFAULT_STAGES = [
  { id: '1', name: 'Lead', color: '#6366F1', prob: 20 },
  { id: '2', name: 'Contattato', color: '#8B5CF6', prob: 40 },
  { id: '3', name: 'Proposta', color: '#EC4899', prob: 60 },
  { id: '4', name: 'Negoziazione', color: '#F59E0B', prob: 80 },
  { id: '5', name: 'Chiuso', color: '#22C55E', prob: 100 },
]

const DEFAULT_TEAM = [
  { id: '1', name: 'Stefano Colicino', email: 'stefano@poonto.it', role: 'owner' as const },
  { id: '2', name: 'Marco Bianchi', email: 'marco@poonto.it', role: 'admin' as const },
  { id: '3', name: 'Laura Verdi', email: 'laura@poonto.it', role: 'member' as const },
]

const FIELD_TYPES = ['Testo', 'Numero', 'Data', 'Dropdown', 'Checkbox', 'URL']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('company')

  // Company state
  const [companyName, setCompanyName] = useState('Poonto S.r.l.')
  const [companyEmail, setCompanyEmail] = useState('info@poonto.it')
  const [companyPhone, setCompanyPhone] = useState('+39 02 1234567')
  const [companyVat, setCompanyVat] = useState('IT12345678901')
  const [primaryColor, setPrimaryColor] = useState('#E05A3A')

  // Pipeline state
  const [stages, setStages] = useState(DEFAULT_STAGES)
  const [newStageName, setNewStageName] = useState('')

  // Team state
  const [team] = useState(DEFAULT_TEAM)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  // Custom fields state
  const [fields, setFields] = useState<{ id: string; name: string; type: string; entity: string }[]>([
    { id: '1', name: 'Sito web', type: 'URL', entity: 'Contatto' },
    { id: '2', name: 'Budget', type: 'Numero', entity: 'Deal' },
  ])
  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState('Testo')
  const [newFieldEntity, setNewFieldEntity] = useState('Contatto')

  // Notifications state
  const [notifications, setNotifications] = useState([
    { key: 'deal_new', label: 'Nuovo deal', desc: 'Quando viene creato un deal', email: true, app: true },
    { key: 'deal_won', label: 'Deal vinto', desc: 'Quando un deal viene chiuso come vinto', email: true, app: true },
    { key: 'task_overdue', label: 'Task scaduto', desc: 'Quando un task supera la scadenza', email: true, app: true },
    { key: 'contact_new', label: 'Nuovo contatto', desc: 'Quando viene aggiunto un contatto', email: false, app: true },
    { key: 'ai_alert', label: 'Alert AI', desc: 'Suggerimenti e insight automatici', email: false, app: true },
  ])

  function handleSaveCompany() {
    toast.success('Profilo azienda salvato')
  }

  function handleAddStage() {
    if (!newStageName.trim()) return
    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6']
    setStages([...stages, {
      id: Date.now().toString(),
      name: newStageName.trim(),
      color: colors[stages.length % colors.length],
      prob: Math.min((stages.length + 1) * 20, 100),
    }])
    setNewStageName('')
    toast.success('Stadio aggiunto')
  }

  function handleRemoveStage(id: string) {
    setStages(stages.filter(s => s.id !== id))
    toast.success('Stadio rimosso')
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return
    toast.success(`Invito inviato a ${inviteEmail}`)
    setInviteEmail('')
  }

  function handleAddField() {
    if (!newFieldName.trim()) return
    setFields([...fields, { id: Date.now().toString(), name: newFieldName.trim(), type: newFieldType, entity: newFieldEntity }])
    setNewFieldName('')
    toast.success('Campo aggiunto')
  }

  function handleRemoveField(id: string) {
    setFields(fields.filter(f => f.id !== id))
    toast.success('Campo rimosso')
  }

  function toggleNotification(key: string, channel: 'email' | 'app') {
    setNotifications(notifications.map(n =>
      n.key === key ? { ...n, [channel]: !n[channel] } : n
    ))
  }

  function handleSaveNotifications() {
    toast.success('Preferenze notifiche salvate')
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Impostazioni</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs sidebar */}
        <div className="md:w-48 flex md:flex-col gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer"
              style={{
                background: activeTab === tab.key ? 'rgba(224,90,58,0.1)' : 'transparent',
                color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 rounded-xl border p-6"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

          {/* === COMPANY === */}
          {activeTab === 'company' && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Profilo azienda</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Nome azienda</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email aziendale</label>
                  <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Telefono</label>
                  <input type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>P.IVA</label>
                  <input type="text" value={companyVat} onChange={(e) => setCompanyVat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Colore primario</label>
                <div className="flex gap-3">
                  {['#E05A3A', '#3B82F6', '#22C55E', '#8B5CF6', '#EC4899', '#F59E0B'].map(c => (
                    <button key={c} onClick={() => setPrimaryColor(c)}
                      className="w-8 h-8 rounded-full cursor-pointer"
                      style={{ background: c, boxShadow: primaryColor === c ? `0 0 0 3px var(--color-bg), 0 0 0 5px ${c}` : 'none' }} />
                  ))}
                </div>
              </div>

              <button onClick={handleSaveCompany}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer mt-2"
                style={{ background: 'var(--color-primary)' }}>
                <Save size={14} /> Salva modifiche
              </button>
            </div>
          )}

          {/* === TEAM === */}
          {activeTab === 'team' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Team</h3>
              </div>

              {/* Invite form */}
              <div className="flex gap-2 mb-5 p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@esempio.it"
                  className="flex-1 px-3 py-1.5 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border text-sm outline-none cursor-pointer"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button onClick={handleInvite}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer"
                  style={{ background: 'var(--color-primary)' }}>
                  <Mail size={12} /> Invita
                </button>
              </div>

              <div className="space-y-1">
                {team.map(m => (
                  <div key={m.id} className="flex items-center justify-between py-3 px-3 rounded-lg"
                    style={{ background: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ background: m.role === 'owner' ? 'var(--color-primary)' : m.role === 'admin' ? '#8B5CF6' : 'var(--color-text-muted)' }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{m.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{m.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: m.role === 'owner' ? 'rgba(224,90,58,0.1)' : m.role === 'admin' ? 'rgba(139,92,246,0.1)' : 'var(--color-bg)',
                        color: m.role === 'owner' ? 'var(--color-primary)' : m.role === 'admin' ? '#8B5CF6' : 'var(--color-text-secondary)',
                      }}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === PIPELINE === */}
          {activeTab === 'pipeline' && (
            <div className="animate-fade-in">
              <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>Stadi pipeline</h3>

              <div className="space-y-2 mb-4">
                {stages.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 py-2 px-3 rounded-lg group"
                    style={{ background: 'var(--color-bg)' }}>
                    <GripVertical size={14} style={{ color: 'var(--color-text-muted)', cursor: 'grab' }} />
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-sm flex-1" style={{ color: 'var(--color-text)' }}>{s.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{s.prob}%</span>
                    {stages.length > 2 && (
                      <button onClick={() => handleRemoveStage(s.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded cursor-pointer"
                        style={{ color: 'var(--color-danger)' }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input type="text" value={newStageName} onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="Nuovo stadio..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                <button onClick={handleAddStage}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
                  style={{ background: 'var(--color-primary)' }}>
                  <Plus size={14} /> Aggiungi
                </button>
              </div>
            </div>
          )}

          {/* === CUSTOM FIELDS === */}
          {activeTab === 'fields' && (
            <div className="animate-fade-in">
              <h3 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>Campi personalizzati</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Aggiungi campi custom ai contatti e ai deal.
              </p>

              {fields.length > 0 && (
                <div className="space-y-2 mb-4">
                  {fields.map(f => (
                    <div key={f.id} className="flex items-center gap-3 py-2 px-3 rounded-lg group"
                      style={{ background: 'var(--color-bg)' }}>
                      <span className="text-sm flex-1" style={{ color: 'var(--color-text)' }}>{f.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{f.type}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(224,90,58,0.08)', color: 'var(--color-primary)' }}>{f.entity}</span>
                      <button onClick={() => handleRemoveField(f.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded cursor-pointer"
                        style={{ color: 'var(--color-danger)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <input type="text" value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Nome campo"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                  className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={newFieldEntity} onChange={(e) => setNewFieldEntity(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <option value="Contatto">Contatto</option>
                  <option value="Deal">Deal</option>
                </select>
                <button onClick={handleAddField}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
                  style={{ background: 'var(--color-primary)' }}>
                  <Plus size={14} /> Aggiungi
                </button>
              </div>
            </div>
          )}

          {/* === NOTIFICATIONS === */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Notifiche</h3>

              {/* Header */}
              <div className="flex items-center justify-end gap-8 px-3 text-[10px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}>
                <span>In-app</span>
                <span>Email</span>
              </div>

              {notifications.map(n => (
                <div key={n.key} className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ background: 'transparent' }}>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{n.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{n.desc}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <ToggleSwitch checked={n.app} onChange={() => toggleNotification(n.key, 'app')} />
                    <ToggleSwitch checked={n.email} onChange={() => toggleNotification(n.key, 'email')} />
                  </div>
                </div>
              ))}

              <button onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer mt-2"
                style={{ background: 'var(--color-primary)' }}>
                <Save size={14} /> Salva preferenze
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-9 h-5 rounded-full cursor-pointer flex-shrink-0"
      style={{
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        transition: 'background 0.2s',
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
        style={{
          left: checked ? '18px' : '2px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}
