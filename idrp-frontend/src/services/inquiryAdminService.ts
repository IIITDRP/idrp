import { adminFetch } from '@/services/authService'
import type { PageResponse } from '@/services/httpClient'

export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM'

export type Inquiry = {
  id: number
  formType: string
  sourcePage?: string
  fullName: string
  email: string
  phone?: string
  organization?: string
  message?: string
  payload: Record<string, unknown>
  consentGiven: boolean
  status: InquiryStatus
  adminNotes?: string
  handledBy?: string
  createdAt: string
  updatedAt?: string
}

export type InquiryPage = PageResponse<Inquiry> & { totalElements: number; totalPages: number; number: number }

export type InquirySummary = {
  newCount: number
  inProgressCount: number
  resolvedCount: number
  total: number
}

export type InquiryQuery = {
  page?: number
  size?: number
  status?: InquiryStatus | ''
  formType?: string
  search?: string
}

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  SPAM: 'Spam',
}

export const inquiryFormTypeLabels: Record<string, string> = {
  contact: 'Contact',
  partner: 'Partnership',
  'program-application': 'Programme application',
  'course-application': 'Course application',
  'workshop-application': 'Workshop application',
  'event-registration': 'Event registration',
  'service-inquiry': 'Service enquiry',
  'startup-matchmaking': 'Startup matchmaking',
  'investor-matchmaking': 'Investor matchmaking',
  'job-application': 'Job application',
}

export const inquiryAdminService = {
  async list(query: InquiryQuery = {}): Promise<InquiryPage> {
    const params = new URLSearchParams({
      page: String(query.page ?? 0),
      size: String(query.size ?? 20),
    })
    if (query.status) params.set('status', query.status)
    if (query.formType) params.set('formType', query.formType)
    if (query.search?.trim()) params.set('search', query.search.trim())
    return adminFetch<InquiryPage>(`/api/inquiries?${params}`)
  },

  async summary(): Promise<InquirySummary> {
    return adminFetch<InquirySummary>('/api/inquiries/summary')
  },

  async update(id: number, status: InquiryStatus, adminNotes: string): Promise<Inquiry> {
    return adminFetch<Inquiry>(`/api/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    })
  },

  async remove(id: number): Promise<void> {
    await adminFetch<null>(`/api/inquiries/${id}`, { method: 'DELETE' })
  },
}

/** Spreadsheet-friendly export of the rows currently loaded. */
export function inquiriesToCsv(rows: Inquiry[]): string {
  const header = ['Received', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Organisation', 'Message', 'Page', 'Notes']
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? '' : String(value)
    // Neutralise spreadsheet formulas (CSV injection) and quote every cell.
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
    return `"${safe.replace(/"/g, '""')}"`
  }
  const lines = rows.map((row) =>
    [
      row.createdAt,
      inquiryFormTypeLabels[row.formType] ?? row.formType,
      inquiryStatusLabels[row.status],
      row.fullName,
      row.email,
      row.phone,
      row.organization,
      row.message,
      row.sourcePage,
      row.adminNotes,
    ]
      .map(escape)
      .join(','),
  )
  return [header.map(escape).join(','), ...lines].join('\r\n')
}
