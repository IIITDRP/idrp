import { adminFetch } from '@/services/authService'
import type { PageResponse } from '@/services/httpClient'

/** Home page impact counters (PRD HP-03), e.g. value "60+" with label "Number of Startups". */
export type ImpactNumberPayload = {
  value: string
  label: string
  displayOrder: number
  visible: boolean
}

export type ImpactNumber = ImpactNumberPayload & {
  id: number
  createdAt?: string
  updatedAt?: string
}

export const impactNumberAdminService = {
  async getAll(): Promise<ImpactNumber[]> {
    const data = await adminFetch<PageResponse<ImpactNumber>>('/api/impact-numbers?page=0&size=100')
    return [...data.content].sort((a, b) => a.displayOrder - b.displayOrder)
  },

  async create(payload: ImpactNumberPayload): Promise<ImpactNumber> {
    return adminFetch<ImpactNumber>('/api/impact-numbers', { method: 'POST', body: JSON.stringify(payload) })
  },

  async update(id: number, payload: ImpactNumberPayload): Promise<ImpactNumber> {
    return adminFetch<ImpactNumber>(`/api/impact-numbers/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },

  async remove(id: number): Promise<void> {
    await adminFetch<null>(`/api/impact-numbers/${id}`, { method: 'DELETE' })
  },
}
