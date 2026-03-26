import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { getUserWorkspaces } from './authService'

/** Hook per gestire l'autenticazione e il workspace corrente */
export function useAuth() {
  const { user, workspace, workspaces, isLoading, setUser, setWorkspace, setWorkspaces, setLoading, clear } = useAuthStore()

  useEffect(() => {
    // Recupera sessione iniziale
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        loadWorkspaces()
      } else {
        setLoading(false)
      }
    })

    // Ascolta cambi di stato auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadWorkspaces()
        } else {
          clear()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadWorkspaces() {
    try {
      const ws = await getUserWorkspaces()
      setWorkspaces(ws)
      // Seleziona il primo workspace (o quello salvato in localStorage)
      const savedId = localStorage.getItem('currentWorkspaceId')
      const current = ws.find(w => w.id === savedId) || ws[0] || null
      setWorkspace(current)
      if (current) localStorage.setItem('currentWorkspaceId', current.id)
    } catch {
      // Se fallisce (es. Supabase non configurato), procedi comunque
    } finally {
      setLoading(false)
    }
  }

  function switchWorkspace(ws: typeof workspace) {
    setWorkspace(ws)
    if (ws) localStorage.setItem('currentWorkspaceId', ws.id)
  }

  return { user, workspace, workspaces, isLoading, switchWorkspace }
}
