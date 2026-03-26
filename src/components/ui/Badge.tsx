import { X } from 'lucide-react'
import { stringToColor } from '@/lib/utils'

interface Props {
  label: string
  color?: string
  removable?: boolean
  onRemove?: () => void
}

export default function Badge({ label, color, removable, onRemove }: Props) {
  const bg = color || stringToColor(label)
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `${bg}20`, color: bg }}>
      {label}
      {removable && onRemove && (
        <button onClick={onRemove} className="cursor-pointer hover:opacity-70"><X size={10} /></button>
      )}
    </span>
  )
}
