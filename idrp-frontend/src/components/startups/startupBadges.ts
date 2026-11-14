import type { StartupStatus } from '@/types/startups'

export const statusBadgeClass: Record<StartupStatus, string> = {
  PRE_INCUBATED: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  INCUBATED: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
  FUNDED: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
}

export const domainBadgeClass = 'bg-slate-100 text-slate-700'
