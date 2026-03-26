import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import OnboardingWizard from '@/features/onboarding/OnboardingWizard'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ContactsPage from '@/features/contacts/ContactsPage'
import ContactDetail from '@/features/contacts/ContactDetail'
import PipelinePage from '@/features/pipeline/PipelinePage'
import TasksPage from '@/features/tasks/TasksPage'
import SettingsPage from '@/features/settings/SettingsPage'
import WorkspacesPage from '@/features/workspaces/WorkspacesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pagine pubbliche */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* Pagine protette con layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/workspaces" element={<WorkspacesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
