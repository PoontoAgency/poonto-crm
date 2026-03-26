import { supabase } from '@/lib/supabase'

interface AiResponse {
  content: string
  tokens?: number
}

/**
 * Genera riassunto AI per un contatto
 */
export async function generateContactSummary(contactId: string): Promise<AiResponse> {
  const { data, error } = await supabase.functions.invoke('ai-summary', {
    body: { entity_type: 'contact', entity_id: contactId },
  })
  if (error) throw error
  return data
}

/**
 * Genera score AI per un contatto
 */
export async function generateContactScore(contactId: string): Promise<AiResponse> {
  const { data, error } = await supabase.functions.invoke('ai-score', {
    body: { entity_type: 'contact', entity_id: contactId },
  })
  if (error) throw error
  return data
}

/**
 * Genera suggerimenti per un contatto
 */
export async function generateSuggestions(contactId: string): Promise<AiResponse> {
  const { data, error } = await supabase.functions.invoke('ai-suggest', {
    body: { entity_type: 'contact', entity_id: contactId },
  })
  if (error) throw error
  return data
}

/**
 * Componi email/nota con AI
 */
export async function composeWithAi(params: {
  contact_id: string
  purpose: string
  tone: 'formal' | 'friendly' | 'persuasive'
  type: 'email' | 'note'
}): Promise<AiResponse> {
  const { data, error } = await supabase.functions.invoke('ai-compose', {
    body: params,
  })
  if (error) throw error
  return data
}

/**
 * Morning briefing
 */
export async function getMorningBriefing(): Promise<AiResponse> {
  const workspaceId = localStorage.getItem('currentWorkspaceId')
  const { data, error } = await supabase.functions.invoke('ai-briefing', {
    body: { workspace_id: workspaceId },
  })
  if (error) throw error
  return data
}
