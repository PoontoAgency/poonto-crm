import { useState } from 'react'
import { Building2, Users, Kanban, Palette, Bell } from 'lucide-react'

type Tab = 'company' | 'team' | 'pipeline' | 'fields' | 'notifications'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'company', label: 'Azienda', icon: <Building2 size={16} /> },
  { key: 'team', label: 'Team', icon: <Users size={16} /> },
  { key: 'pipeline', label: 'Pipeline', icon: <Kanban size={16} /> },
  { key: 'fields', label: 'Campi custom', icon: <Palette size={16} /> },
  { key: 'notifications', label: 'Notifiche', icon: <Bell size={16} /> },
]

const MOCK_STAGES = [
  { name: 'Lead', color: '#6366F1', prob: 20 },
  { name: 'Contattato', color: '#8B5CF6', prob: 40 },
  { name: 'Proposta', color: '#EC4899', prob: 60 },
  { name: 'Negoziazione', color: '#F59E0B', prob: 80 },
  { name: 'Chiuso', color: '#22C55E', prob: 100 },
]

const MOCK_TEAM = [
  { name: 'Stefano Colicino', email: 'stefano@poonto.it', role: 'owner' },
  { name: 'Marco Bianchi', email: 'marco@poonto.it', role: 'admin' },
  { name: 'Laura Verdi', email: 'laura@poonto.it', role: 'member' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('company')
  const [companyName, setCompanyName] = useState('Poonto S.r.l.')
  const [primaryColor, setPrimaryColor] = useState('#E05A3A')

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

          {activeTab === 'company' && (
            <div className="space-y-4">
              <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Profilo azienda</h3>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Nome azienda</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full max-w-sm px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
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
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer mt-2"
                style={{ background: 'var(--color-primary)' }}>Salva modifiche</button>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Team</h3>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer"
                  style={{ background: 'var(--color-primary)' }}>+ Invita</button>
              </div>
              <div className="space-y-2">
                {MOCK_TEAM.map(m => (
                  <div key={m.email} className="flex items-center justify-between py-3 border-b"
                    style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{m.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{m.email}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: m.role === 'owner' ? 'rgba(224,90,58,0.1)' : 'var(--color-bg)', color: m.role === 'owner' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div>
              <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>Stadi pipeline</h3>
              <div className="space-y-2">
                {MOCK_STAGES.map((s, idx) => (
                  <div key={s.name} className="flex items-center gap-3 py-2 px-3 rounded-lg"
                    style={{ background: 'var(--color-bg)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm flex-1" style={{ color: 'var(--color-text)' }}>{s.name}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.prob}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>Campi personalizzati</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Aggiungi campi custom ai contatti e ai deal.
              </p>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
                style={{ background: 'var(--color-primary)' }}>+ Aggiungi campo</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Notifiche</h3>
              {[
                { label: 'Nuovo deal', desc: 'Quando viene creato un deal', checked: true },
                { label: 'Deal vinto', desc: 'Quando un deal viene chiuso come vinto', checked: true },
                { label: 'Task scaduto', desc: 'Quando un task supera la scadenza', checked: true },
                { label: 'Nuovo contatto', desc: 'Quando viene aggiunto un contatto', checked: false },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{n.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{n.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={n.checked} className="cursor-pointer" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
