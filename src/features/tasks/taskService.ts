import { supabase } from '@/lib/supabase'
import type { Task } from '@/types'

export async function getTasks(params?: { filter?: string }): Promise<Task[]> {
  let query = supabase.from('tasks').select('*, contact:contacts(id, first_name, last_name)')
    .is('completed_at', null).order('due_date', { ascending: true, nullsFirst: false })

  const today = new Date().toISOString().split('T')[0]

  if (params?.filter === 'today') query = query.eq('due_date', today)
  else if (params?.filter === 'overdue') query = query.lt('due_date', today)
  else if (params?.filter === 'week') {
    const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7)
    query = query.lte('due_date', weekEnd.toISOString().split('T')[0])
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createTask(task: Pick<Task, 'title' | 'due_date' | 'priority' | 'contact_id' | 'deal_id'>): Promise<Task> {
  const workspaceId = localStorage.getItem('currentWorkspaceId')
  const { data: user } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('tasks')
    .insert({ ...task, workspace_id: workspaceId, created_by: user?.user?.id })
    .select().single()
  if (error) throw error
  return data
}

export async function completeTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').update({ completed_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
