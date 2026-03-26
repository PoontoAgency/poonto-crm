import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Workspace } from '@/types'

interface AuthState {
  user: User | null
  workspace: Workspace | null
  workspaces: Workspace[]
  isLoading: boolean

  setUser: (user: User | null) => void
  setWorkspace: (workspace: Workspace | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  workspace: null,
  workspaces: [],
  isLoading: true,

  setUser: (user) => set({ user }),
  setWorkspace: (workspace) => set({ workspace }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, workspace: null, workspaces: [], isLoading: false }),
}))
