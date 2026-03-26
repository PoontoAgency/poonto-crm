import { supabase } from '@/lib/supabase'
import type { Pipeline, PipelineStage, Deal } from '@/types'

export async function getPipelines(): Promise<Pipeline[]> {
  const { data, error } = await supabase.from('pipelines').select('*').order('created_at')
  if (error) throw error
  return data || []
}

export async function getStages(pipelineId: string): Promise<PipelineStage[]> {
  const { data, error } = await supabase
    .from('pipeline_stages').select('*')
    .eq('pipeline_id', pipelineId).order('position')
  if (error) throw error
  return data || []
}

export async function getDeals(pipelineId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals').select('*, contact:contacts(id, first_name, last_name, avatar_url)')
    .eq('pipeline_id', pipelineId).order('position')
  if (error) throw error
  return data || []
}

export async function createDeal(deal: Pick<Deal, 'name' | 'value' | 'stage_id' | 'pipeline_id' | 'contact_id'>): Promise<Deal> {
  const workspaceId = localStorage.getItem('currentWorkspaceId')
  const { data, error } = await supabase
    .from('deals').insert({ ...deal, workspace_id: workspaceId }).select().single()
  if (error) throw error
  return data
}

export async function updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
  const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function moveDeal(id: string, stageId: string, position: number): Promise<void> {
  const { error } = await supabase.from('deals').update({ stage_id: stageId, position }).eq('id', id)
  if (error) throw error
}

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) throw error
}
