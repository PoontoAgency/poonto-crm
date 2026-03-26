import { getInitials, stringToColor } from '@/lib/utils'

interface Props {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-6 h-6 text-[9px]', md: 'w-8 h-8 text-xs', lg: 'w-12 h-12 text-base' }

export default function Avatar({ name, src, size = 'md' }: Props) {
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
  }
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-medium text-white flex-shrink-0`}
      style={{ background: stringToColor(name) }}>
      {getInitials(name)}
    </div>
  )
}
