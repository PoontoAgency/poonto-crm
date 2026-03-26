import { useState } from 'react'
import { Sparkles, Send, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  contactName: string
  onInsert?: (text: string) => void
}

const TONES = [
  { value: 'formal', label: 'Formale' },
  { value: 'friendly', label: 'Amichevole' },
  { value: 'persuasive', label: 'Persuasivo' },
] as const

export default function AiCompose({ contactName, onInsert }: Props) {
  const [purpose, setPurpose] = useState('')
  const [tone, setTone] = useState<'formal' | 'friendly' | 'persuasive'>('friendly')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!purpose) return
    setLoading(true)
    // Mock risposta AI per sviluppo
    await new Promise(r => setTimeout(r, 1500))
    setResult(
      `Ciao ${contactName},\n\n${purpose === 'follow-up'
        ? 'Volevo fare un follow-up sulla nostra ultima conversazione. Come sta procedendo il progetto? Saresti disponibile per una call veloce questa settimana?'
        : purpose === 'preventivo'
          ? 'Come discusso, in allegato trovi il preventivo dettagliato per il progetto. Ho incluso 3 opzioni di prezzo per adattarci meglio alle tue esigenze.'
          : 'Ti scrivo per condividere alcune novità che potrebbero interessarti. Abbiamo lanciato nuove funzionalità che si adattano perfettamente alle tue necessità.'
      }\n\nResto a disposizione per qualsiasi domanda.\n\nA presto,\nStefano — Poonto`
    )
    setLoading(false)
  }

  return (
    <div className="rounded-xl border p-5"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
        <h3 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>AI Compose</h3>
      </div>

      {!result ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Scopo</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
              <option value="">Seleziona...</option>
              <option value="follow-up">Follow-up</option>
              <option value="preventivo">Invia preventivo</option>
              <option value="novita">Condividi novità</option>
              <option value="meeting">Proponi meeting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Tono</label>
            <div className="flex gap-2">
              {TONES.map(t => (
                <button key={t.value} onClick={() => setTone(t.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  style={{
                    background: tone === t.value ? 'rgba(224,90,58,0.15)' : 'var(--color-bg)',
                    color: tone === t.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    border: `1px solid ${tone === t.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!purpose || loading}
            className="w-full py-2 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'var(--color-primary)' }}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Sparkles size={14} /> Genera</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea value={result} onChange={(e) => setResult(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-y"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
          <div className="flex gap-2">
            <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copiato!') }}
              className="flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              📋 Copia
            </button>
            <button onClick={() => { onInsert?.(result); toast.success('Inserito!') }}
              className="flex-1 py-2 rounded-lg text-xs font-medium text-white cursor-pointer flex items-center justify-center gap-1"
              style={{ background: 'var(--color-primary)' }}>
              <Send size={12} /> Usa
            </button>
          </div>
          <button onClick={() => setResult('')}
            className="w-full text-xs cursor-pointer py-1"
            style={{ color: 'var(--color-text-muted)' }}>
            ← Rigenera
          </button>
        </div>
      )}
    </div>
  )
}
