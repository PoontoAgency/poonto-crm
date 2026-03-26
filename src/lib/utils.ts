import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isYesterday, isPast } from 'date-fns'
import { it } from 'date-fns/locale'

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format currency (EUR) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format date to Italian locale */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: it })
}

/** Relative date ("3 giorni fa", "oggi", "ieri") */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date)
  if (isToday(d)) return 'Oggi'
  if (isYesterday(d)) return 'Ieri'
  return formatDistanceToNow(d, { addSuffix: true, locale: it })
}

/** Check if a date is overdue */
export function isOverdue(date: string | Date): boolean {
  return isPast(new Date(date)) && !isToday(new Date(date))
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Generate a color from a string (for avatars, tags) */
export function stringToColor(str: string): string {
  const colors = [
    '#E05A3A', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#6366F1',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
