import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkspace } from '@/features/auth/authService'
import { useAuthStore } from '@/store/authStore'
import { Building2, Upload, Palette, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

const STEPS = ['Azienda', 'Contatti', 'Personalizza']

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const { setWorkspace, setWorkspaces } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    sector: '',
    color: '#E05A3A',
  })

  async function handleComplete() {
    setLoading(true)
    try {
      const slug = form.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      const ws = await createWorkspace(form.companyName, slug, undefined, form.color)
      setWorkspace(ws)
      setWorkspaces([ws])
      navigate('/')
    } catch {
      // Supabase non configurato — vai alla dashboard comunque
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i <= step ? 'text-white' : ''
              }`} style={{
                background: i <= step ? 'var(--color-primary)' : 'var(--color-surface)',
                color: i <= step ? 'white' : 'var(--color-text-muted)',
                border: i > step ? '1px solid var(--color-border)' : 'none',
              }}>
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-12 h-0.5" style={{
                  background: i < step ? 'var(--color-primary)' : 'var(--color-border)',
                }} />
              )}
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

          {/* Step 1: Azienda */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Building2 size={24} style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  La tua azienda
                </h2>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Nome azienda
                </label>
                <input type="text" value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="es. Poonto S.r.l."
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Settore
                </label>
                <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <option value="">Seleziona...</option>
                  <option value="agency">Agenzia / Marketing</option>
                  <option value="tech">Tecnologia</option>
                  <option value="retail">Commercio</option>
                  <option value="services">Servizi</option>
                  <option value="manufacturing">Produzione</option>
                  <option value="other">Altro</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Import contatti */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Upload size={24} style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Importa contatti
                </h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Puoi importare i tuoi contatti da un file CSV o Excel, oppure iniziare da zero e aggiungerli dopo.
              </p>
              <div className="border-2 border-dashed rounded-xl p-8 text-center mb-4 cursor-pointer hover:opacity-80"
                style={{ borderColor: 'var(--color-border)' }}>
                <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Trascina un file CSV qui
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  oppure clicca per selezionare
                </p>
              </div>
              <button className="w-full py-2 rounded-lg text-sm cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
                onClick={() => setStep(2)}>
                Salta — inizio da zero →
              </button>
            </div>
          )}

          {/* Step 3: Personalizza */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Palette size={24} style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Personalizza
                </h2>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  Colore principale
                </label>
                <div className="flex gap-3 flex-wrap">
                  {['#E05A3A', '#3B82F6', '#22C55E', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#6366F1'].map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      style={{
                        background: c,
                        boxShadow: form.color === c ? `0 0 0 3px var(--color-bg), 0 0 0 5px ${c}` : 'none',
                      }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}>
                <ArrowLeft size={14} /> Indietro
              </button>
            ) : <div />}

            {step < 2 ? (
              <button onClick={() => setStep(step + 1)}
                disabled={step === 0 && !form.companyName}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--color-primary)' }}>
                Avanti <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={loading}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--color-primary)' }}>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Sparkles size={14} /> Inizia</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
