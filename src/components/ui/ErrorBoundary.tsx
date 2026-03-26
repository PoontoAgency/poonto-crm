import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-danger)' }}>Qualcosa è andato storto</p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
            style={{ background: 'var(--color-primary)' }}>Riprova</button>
        </div>
      )
    }
    return this.props.children
  }
}
