import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

/** Layout protetto: se non autenticato → login */
export default function AppLayout() {
  const { user, workspace, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!workspace) return <Navigate to="/onboarding" replace />

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
