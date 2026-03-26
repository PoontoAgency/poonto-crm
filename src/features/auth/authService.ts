import { supabase } from '@/lib/supabase'
import type { Workspace } from '@/types'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  // Prima recupera gli ID dei workspace dell'utente
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) return []

  const { data: memberships, error: memErr } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.user.id)

  if (memErr || !memberships?.length) return []

  const wsIds = memberships.map(m => m.workspace_id)

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .in('id', wsIds)
    .order('created_at')

  if (error) return []
  return data || []
}

export async function createWorkspace(
  name: string,
  slug: string,
  logoUrl?: string,
  primaryColor?: string
): Promise<Workspace> {
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) throw new Error('Non autenticato')

  const { data, error } = await supabase
    .from('workspaces')
    .insert({
      name,
      slug,
      logo_url: logoUrl || null,
      primary_color: primaryColor || '#E05A3A',
      owner_id: user.user.id,
    })
    .select()
    .single()

  if (error) throw error

  // Aspetta un attimo che il trigger auto_add_workspace_owner faccia il suo lavoro
  await new Promise(r => setTimeout(r, 200))

  return data
}

