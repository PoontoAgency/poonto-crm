import { useState } from 'react'
import { formatCurrency, getInitials, stringToColor } from '@/lib/utils'
import { Plus, MoreHorizontal, GripVertical, Trophy, XCircle } from 'lucide-react'
import type { Deal, PipelineStage } from '@/types'

// Mock stages
const MOCK_STAGES: PipelineStage[] = [
  { id: 's1', pipeline_id: 'p1', name: 'Lead', position: 1, probability: 20, color: '#6366F1', created_at: '' },
  { id: 's2', pipeline_id: 'p1', name: 'Contattato', position: 2, probability: 40, color: '#8B5CF6', created_at: '' },
  { id: 's3', pipeline_id: 'p1', name: 'Proposta', position: 3, probability: 60, color: '#EC4899', created_at: '' },
  { id: 's4', pipeline_id: 'p1', name: 'Negoziazione', position: 4, probability: 80, color: '#F59E0B', created_at: '' },
  { id: 's5', pipeline_id: 'p1', name: 'Chiuso', position: 5, probability: 100, color: '#22C55E', created_at: '' },
]

// Mock deals
const MOCK_DEALS: Deal[] = [
  { id: 'd1', workspace_id: 'w1', pipeline_id: 'p1', stage_id: 's1', contact_id: '1', name: 'Sito web TechSrl', value: 3000, currency: 'EUR', expected_close_date: '2026-04-15', owner_id: null, status: 'open', lost_reason: null, custom_fields: {}, position: 0, created_at: '2026-03-10', updated_at: '2026-03-25' },
  { id: 'd2', workspace_id: 'w1', pipeline_id: 'p1', stage_id: 's1', contact_id: '4', name: 'App mobile NewCo', value: 5000, currency: 'EUR', expected_close_date: '2026-04-20', owner_id: null, status: 'open', lost_reason: null, custom_fields: {}, position: 1, created_at: '2026-03-12', updated_at: '2026-03-24' },
  { id: 'd3', workspace_id: 'w1', pipeline_id: 'p1', stage_id: 's2', contact_id: '2', name: 'Branding ABC Srl', value: 1500, currency: 'EUR', expected_close_date: '2026-04-10', owner_id: null, status: 'open', lost_reason: null, custom_fields: {}, position: 0, created_at: '2026-03-15', updated_at: '2026-03-23' },
  { id: 'd4', workspace_id: 'w1', pipeline_id: 'p1', stage_id: 's3', contact_id: '3', name: 'E-commerce XYZ', value: 8000, currency: 'EUR', expected_close_date: '2026-05-01', owner_id: null, status: 'open', lost_reason: null, custom_fields: {}, position: 0, created_at: '2026-03-05', updated_at: '2026-03-22' },
  { id: 'd5', workspace_id: 'w1', pipeline_id: 'p1', stage_id: 's5', contact_id: '5', name: 'CRM FooInc', value: 2000, currency: 'EUR', expected_close_date: null, owner_id: null, status: 'won', lost_reason: null, custom_fields: {}, position: 0, created_at: '2026-02-20', updated_at: '2026-03-20' },
]

const CONTACT_NAMES: Record<string, string> = {
  '1': 'Marco Rossi', '2': 'Laura Bianchi', '3': 'Giuseppe Verdi',
  '4': 'Francesca Neri', '5': 'Alessandro Conti',
}

export default function PipelinePage() {
  const [deals, setDeals] = useState(MOCK_DEALS)
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [showNewDeal, setShowNewDeal] = useState(false)
  const [newDealStage, setNewDealStage] = useState<string | null>(null)
  const [newDealForm, setNewDealForm] = useState({ name: '', value: '' })

  const pipelineTotal = deals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.value, 0)

  function handleDragStart(dealId: string) { setDraggedDeal(dealId) }
  function handleDragEnd() { setDraggedDeal(null) }

  function handleDrop(stageId: string) {
    if (!draggedDeal) return
    setDeals(prev => prev.map(d => d.id === draggedDeal ? { ...d, stage_id: stageId } : d))
    setDraggedDeal(null)
  }

  function handleAddDeal(stageId: string) {
    if (!newDealForm.name) return
    const newDeal: Deal = {
      id: `d${Date.now()}`, workspace_id: 'w1', pipeline_id: 'p1', stage_id: stageId,
      contact_id: null, name: newDealForm.name, value: parseFloat(newDealForm.value) || 0,
      currency: 'EUR', expected_close_date: null, owner_id: null, status: 'open',
      lost_reason: null, custom_fields: {}, position: 0,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    setDeals(prev => [...prev, newDeal])
    setShowNewDeal(false)
    setNewDealForm({ name: '', value: '' })
    setNewDealStage(null)
  }

  function markDealWon(dealId: string) {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: 'won' as const, stage_id: 's5' } : d))
  }

  function markDealLost(dealId: string) {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: 'lost' as const } : d))
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Pipeline</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {formatCurrency(pipelineTotal)} in pipeline • {deals.filter(d => d.status === 'open').length} deal aperti
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {MOCK_STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage_id === stage.id)
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0)

          return (
            <div key={stage.id} className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}>

              {/* Column header */}
              <div className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{stage.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatCurrency(stageTotal)}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {stageDeals.map(deal => (
                  <div key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal.id)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing ${
                      draggedDeal === deal.id ? 'opacity-50' : ''
                    }`}
                    style={{
                      background: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = stage.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}>

                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{deal.name}</p>
                      <div className="flex gap-1">
                        {deal.status === 'open' && (
                          <>
                            <button onClick={() => markDealWon(deal.id)} title="Vinto" className="cursor-pointer opacity-40 hover:opacity-100">
                              <Trophy size={12} style={{ color: 'var(--color-success)' }} />
                            </button>
                            <button onClick={() => markDealLost(deal.id)} title="Perso" className="cursor-pointer opacity-40 hover:opacity-100">
                              <XCircle size={12} style={{ color: 'var(--color-danger)' }} />
                            </button>
                          </>
                        )}
                        {deal.status === 'won' && <Trophy size={12} style={{ color: 'var(--color-success)' }} />}
                      </div>
                    </div>

                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                      {formatCurrency(deal.value)}
                    </p>

                    {deal.contact_id && CONTACT_NAMES[deal.contact_id] && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium text-white"
                          style={{ background: stringToColor(CONTACT_NAMES[deal.contact_id]) }}>
                          {getInitials(CONTACT_NAMES[deal.contact_id])}
                        </div>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {CONTACT_NAMES[deal.contact_id]}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add deal button */}
                {showNewDeal && newDealStage === stage.id ? (
                  <div className="p-3 rounded-lg border animate-fade-in"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                    <input type="text" value={newDealForm.name}
                      onChange={(e) => setNewDealForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome deal" autoFocus
                      className="w-full px-2 py-1.5 rounded border text-sm outline-none mb-2"
                      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddDeal(stage.id) }} />
                    <input type="number" value={newDealForm.value}
                      onChange={(e) => setNewDealForm(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Valore €"
                      className="w-full px-2 py-1.5 rounded border text-sm outline-none mb-2"
                      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                    <div className="flex gap-2">
                      <button onClick={() => handleAddDeal(stage.id)}
                        className="text-xs px-3 py-1 rounded text-white cursor-pointer"
                        style={{ background: 'var(--color-primary)' }}>Aggiungi</button>
                      <button onClick={() => { setShowNewDeal(false); setNewDealStage(null) }}
                        className="text-xs px-3 py-1 rounded cursor-pointer"
                        style={{ color: 'var(--color-text-muted)' }}>Annulla</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setShowNewDeal(true); setNewDealStage(stage.id) }}
                    className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                    style={{ color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)' }}>
                    <Plus size={12} /> Aggiungi deal
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
