/**
 * contactService.ts — CRUD contatti su Supabase
 */
import { supabase } from '@/lib/supabase'
import type { Contact, Activity } from '@/types'

/** Lista contatti con ricerca e filtri */
export async function getContacts(params?: {
  search?: string
  tags?: string[]
  score?: string
}): Promise<Contact[]> {
  let query = supabase
    .from('contacts')
    .select('*')
    .is('deleted_at', null)
    .order('first_name')

  if (params?.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%,company.ilike.%${params.search}%`
    )
  }

  if (params?.tags?.length) {
    query = query.overlaps('tags', params.tags)
  }

  if (params?.score) {
    query = query.eq('ai_score', params.score)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

/** Singolo contatto per ID */
export async function getContact(id: string): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/** Timeline attività di un contatto */
export async function getContactActivities(contactId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}

/** Crea nuovo contatto */
export async function createContact(
  contact: Pick<Contact, 'first_name' | 'last_name' | 'email' | 'phone' | 'company' | 'position' | 'tags'>
): Promise<Contact> {
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) throw new Error('Non autenticato')

  // Prendi il workspace corrente
  const workspaceId = localStorage.getItem('currentWorkspaceId')

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      ...contact,
      workspace_id: workspaceId,
      created_by: user.user.id,
      owner_id: user.user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/** Aggiorna contatto */
export async function updateContact(
  id: string,
  updates: Partial<Contact>
): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/** Soft delete contatto */
export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

/** Aggiungi attività a un contatto */
export async function addActivity(activity: {
  contact_id: string
  deal_id?: string
  type: Activity['type']
  content: string
  metadata?: Record<string, unknown>
}): Promise<Activity> {
  const { data: user } = await supabase.auth.getUser()
  const workspaceId = localStorage.getItem('currentWorkspaceId')

  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...activity,
      workspace_id: workspaceId,
      created_by: user?.user?.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
