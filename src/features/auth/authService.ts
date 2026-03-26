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
  const { data, error } = await supabase
    .from('workspaces')
    .select('*, workspace_members!inner(user_id, role)')
    .order('created_at')

  if (error) throw error
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
  return data
}
