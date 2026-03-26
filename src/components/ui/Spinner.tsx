export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div className="rounded-full animate-spin"
      style={{
        width: size, height: size,
        border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
      }} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <Spinner size={32} />
    </div>
  )
}
