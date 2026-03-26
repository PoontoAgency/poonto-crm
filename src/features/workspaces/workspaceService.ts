/**
 * workspaceService.ts — CRUD workspace su Supabase
 */
import { supabase } from '@/lib/supabase'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '@/types'

/** Lista workspace dell'utente corrente */
export async function getWorkspaces(): Promise<Workspace[]> {
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) return []

  // Workspace dove l'utente è membro
  const { data: memberships, error: memErr } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.user.id)

  if (memErr) throw memErr
  if (!memberships?.length) return []

  const ids = memberships.map(m => m.workspace_id)

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .in('id', ids)
    .order('name')

  if (error) throw error
  return data || []
}

/** Singolo workspace */
export async function getWorkspace(id: string): Promise<Workspace> {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/** Workspace figli (per agenzia) */
export async function getChildWorkspaces(parentId: string): Promise<Workspace[]> {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('parent_workspace_id', parentId)
    .order('name')

  if (error) throw error
  return data || []
}

/** Crea nuovo workspace (figlio, per agenzia) */
export async function createWorkspace(input: {
  name: string
  slug?: string
  logo_url?: string
  primary_color?: string
  parent_workspace_id?: string
}): Promise<Workspace> {
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) throw new Error('Non autenticato')

  const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const { data, error } = await supabase
    .from('workspaces')
    .insert({
      name: input.name,
      slug,
      logo_url: input.logo_url || null,
      primary_color: input.primary_color || '#E05A3A',
      owner_id: user.user.id,
      parent_workspace_id: input.parent_workspace_id || null,
      plan: 'free',
      settings: {},
    })
    .select()
    .single()

  if (error) throw error

  // Auto-aggiungi il creatore come owner
  await supabase.from('workspace_members').insert({
    workspace_id: data.id,
    user_id: user.user.id,
    role: 'owner',
    accepted_at: new Date().toISOString(),
  })

  return data
}

/** Aggiorna workspace */
export async function updateWorkspace(
  id: string,
  updates: Partial<Pick<Workspace, 'name' | 'logo_url' | 'primary_color' | 'settings'>>
): Promise<Workspace> {
  const { data, error } = await supabase
    .from('workspaces')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/** Membri di un workspace */
export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const { data, error } = await supabase
    .from('workspace_members')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('invited_at')

  if (error) throw error
  return data || []
}

/** Invita membro al workspace */
export async function inviteMember(input: {
  workspace_id: string
  email: string
  role: WorkspaceRole
}): Promise<void> {
  // In fase 1, creiamo direttamente il record
  // In produzione, si invierebbe un'email di invito
  const { error } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: input.workspace_id,
      user_id: input.email, // placeholder — in produzione, lookup user by email
      role: input.role,
    })

  if (error) throw error
}

/** Elimina workspace */
export async function deleteWorkspace(id: string): Promise<void> {
  // Prima elimina i membri
  await supabase.from('workspace_members').delete().eq('workspace_id', id)
  // Poi il workspace
  const { error } = await supabase.from('workspaces').delete().eq('id', id)
  if (error) throw error
}
