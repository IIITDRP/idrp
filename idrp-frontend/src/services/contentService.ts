/**
 * PUBLIC CONTENT: database first, static snapshot as fallback
 * ---------------------------------------------------------------------
 * Every public page renders its static data (src/data/*.ts) immediately, then swaps
 * in the live records from the backend once they arrive. If the API is unreachable or
 * errors, the static snapshot simply stays on screen - the site never goes blank.
 *
 * The static files are also the source of the backend seed (npm run export-seed), so
 * the fallback and the initial database content are the same data.
 *
 * Set VITE_CONTENT_SOURCE=static to skip the API entirely (e.g. a static-only build).
 */
import { shallowRef, type ShallowRef } from 'vue'
import { publicFetch, type PageResponse } from '@/services/httpClient'
import type { Startup, StartupDomain, StartupPerson, StartupStatus } from '@/types/startups'
import type { EventItem } from '@/types/events'
import type { Mentor } from '@/types/mentors'
import type { Partner, PartnerCategory, PartnerKey } from '@/types/partners'
import type { TeamMember } from '@/types/team'
import type { InvestmentCommitteeMember } from '@/types/investmentCommittee'
import type { Newsletter } from '@/types/newsletter'
import type { Stat } from '@/data/home'

export const CONTENT_FROM_API = import.meta.env.VITE_CONTENT_SOURCE !== 'static'

const resolved = new Map<string, unknown>()
const inflight = new Map<string, Promise<unknown>>()

/**
 * Returns a ref that starts as `fallback` and is replaced by `load()`'s result.
 * Results are cached for the session, so navigating back to a page shows live data
 * immediately without refetching.
 */
export function useRemoteContent<T>(key: string, fallback: T, load: () => Promise<T>): ShallowRef<T> {
  const data = shallowRef<T>((resolved.has(key) ? resolved.get(key) : fallback) as T)

  if (!CONTENT_FROM_API || resolved.has(key)) {
    return data
  }

  let request = inflight.get(key) as Promise<T> | undefined
  if (!request) {
    request = load()
    inflight.set(key, request)
    request
      .then((value) => resolved.set(key, value))
      .catch((error) => console.warn(`[content] "${key}" unavailable, showing static data:`, error))
      .finally(() => inflight.delete(key))
  }

  request.then((value) => (data.value = value)).catch(() => undefined)
  return data
}

async function fetchAll<T>(path: string): Promise<T[]> {
  const separator = path.includes('?') ? '&' : '?'
  const page = await publicFetch<PageResponse<T>>(`${path}${separator}page=0&size=500`)
  return page.content ?? []
}

const byDisplayOrder = (a: { displayOrder?: number | null }, b: { displayOrder?: number | null }) =>
  (a.displayOrder ?? 0) - (b.displayOrder ?? 0)

const orUndefined = (value: string | null | undefined) => (value ? value : undefined)

// ---------------------------------------------------------------- startups
type ApiPerson = { name: string; role?: string; linkedin?: string; email?: string; imageUrl?: string }
type ApiStartup = {
  id: number
  name: string
  sector?: string
  statuses?: StartupStatus[]
  domains?: StartupDomain[]
  logo?: string
  website?: string
  onePager?: string
  brief?: string
  contactEmail?: string
  techFacultyMentors?: ApiPerson[]
  founders?: ApiPerson[]
  teamMembers?: ApiPerson[]
}

const toPerson = (person: ApiPerson): StartupPerson => ({
  name: person.name,
  role: orUndefined(person.role),
  linkedin: orUndefined(person.linkedin),
  email: orUndefined(person.email),
  image: orUndefined(person.imageUrl),
})

export async function loadStartups(): Promise<Startup[]> {
  const items = await fetchAll<ApiStartup>('/api/startups')
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    sector: item.sector ?? '',
    statuses: item.statuses ?? [],
    domains: item.domains?.length ? item.domains : ['OTHER'],
    logo: orUndefined(item.logo),
    website: orUndefined(item.website),
    onePager: orUndefined(item.onePager),
    brief: orUndefined(item.brief),
    contactEmail: orUndefined(item.contactEmail),
    techFacultyMentors: (item.techFacultyMentors ?? []).map(toPerson),
    founders: (item.founders ?? []).map(toPerson),
    teamMembers: (item.teamMembers ?? []).map(toPerson),
  }))
}

// ---------------------------------------------------------------- events
type ApiEvent = Omit<EventItem, 'imageFit'> & { imageFit?: string | null }

export async function loadEvents(): Promise<EventItem[]> {
  const items = await fetchAll<ApiEvent>('/api/events')
  return items.map((item) => ({
    ...item,
    initiative: orUndefined(item.initiative),
    time: orUndefined(item.time),
    mode: orUndefined(item.mode),
    registerUrl: orUndefined(item.registerUrl),
    brochureUrl: orUndefined(item.brochureUrl),
    galleryUrl: orUndefined(item.galleryUrl),
    imageFit: item.imageFit === 'contain' ? 'contain' : 'cover',
    gallery: item.gallery ?? [],
  }))
}

// ---------------------------------------------------------------- mentors
type ApiMentor = {
  name: string
  designation?: string
  organization?: string
  bio?: string
  linkedinUrl?: string
  profileImageUrl?: string
}

export async function loadMentors(): Promise<Mentor[]> {
  const items = await fetchAll<ApiMentor>('/api/mentors')
  return items.map((item) => ({
    name: item.name,
    role: item.designation ?? '',
    image: item.profileImageUrl ?? '',
    imageAlt: item.name,
    organization: orUndefined(item.organization),
    bio: orUndefined(item.bio),
    linkedin: orUndefined(item.linkedinUrl),
  }))
}

// ---------------------------------------------------------------- partners
type ApiPartner = {
  name: string
  category?: string
  websiteUrl?: string
  logoUrl?: string
  description?: string
  abbr?: string
  accentColor?: string
}

const FALLBACK_COLORS = [
  'linear-gradient(135deg,#0f766e,#14b8a6)',
  'linear-gradient(135deg,#2563eb,#60a5fa)',
  'linear-gradient(135deg,#7c3aed,#a78bfa)',
  'linear-gradient(135deg,#b45309,#f59e0b)',
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

/** Regroups live partners under the static category headings (title, icon, colours). */
export function loadPartnerCategories(templates: PartnerCategory[]) {
  return async (): Promise<PartnerCategory[]> => {
    const items = await fetchAll<ApiPartner>('/api/partners')
    const keys = templates.map((template) => template.key)
    const partners: Partner[] = items.map((item, index) => {
      const category = (keys.includes(item.category as PartnerKey) ? item.category : 'ecosystem') as PartnerKey
      return {
        name: item.name,
        abbr: item.abbr || initials(item.name),
        color: item.accentColor || FALLBACK_COLORS[index % FALLBACK_COLORS.length]!,
        category,
        description: orUndefined(item.description),
        logo: orUndefined(item.logoUrl),
        websiteUrl: orUndefined(item.websiteUrl),
      }
    })
    return templates.map((template) => ({
      ...template,
      partners: partners.filter((partner) => partner.category === template.key),
    }))
  }
}

// ---------------------------------------------------------------- team / board
type ApiPerson2 = {
  name: string
  designation?: string
  boardType?: string
  profileImageUrl?: string
  linkedinUrl?: string
  profileUrl?: string
  displayOrder?: number
}

export async function loadTeamMembers(): Promise<TeamMember[]> {
  const items = await fetchAll<ApiPerson2>('/api/team-members')
  return [...items].sort(byDisplayOrder).map((item) => ({
    name: item.name,
    role: item.designation ?? '',
    image: orUndefined(item.profileImageUrl),
    imageAlt: item.name,
    linkedinUrl: orUndefined(item.linkedinUrl),
    profileUrl: orUndefined(item.profileUrl),
  }))
}

export const INVESTMENT_COMMITTEE_BOARD_TYPE = 'Investment Committee'

export async function loadInvestmentCommittee(): Promise<InvestmentCommitteeMember[]> {
  const items = await fetchAll<ApiPerson2>('/api/board-members')
  return items
    .filter((item) => (item.boardType ?? INVESTMENT_COMMITTEE_BOARD_TYPE) === INVESTMENT_COMMITTEE_BOARD_TYPE)
    .sort(byDisplayOrder)
    .map((item) => ({
      name: item.name,
      role: item.designation ?? '',
      image: item.profileImageUrl ?? '',
      imageAlt: item.name,
      linkedinUrl: orUndefined(item.linkedinUrl),
      profileUrl: orUndefined(item.profileUrl),
    }))
}

// ---------------------------------------------------------------- newsletters
type ApiResource = {
  id: number
  slug: string
  title: string
  type: string
  summary?: string
  previewText?: string
  fileUrl?: string
  coverImageUrl?: string
  publishDate?: string
  issueNumber?: string
  dateLabel?: string
  totalPages?: number
  highlights?: string[]
  displayOrder?: number
  active?: boolean
}

const NEWSLETTER_GRADIENTS = [
  'linear-gradient(180deg, #0f3d6e 0%, #0b2f57 45%, #08213c 100%)',
  'linear-gradient(180deg, #0f766e 0%, #115e59 45%, #0b3b39 100%)',
  'linear-gradient(180deg, #4338ca 0%, #3730a3 45%, #1e1b4b 100%)',
]

/** KH-01: newsletters in reverse chronological order. Static gradients are kept per slug. */
export function loadNewsletters(staticNewsletters: Newsletter[]) {
  return async (): Promise<Newsletter[]> => {
    const items = await fetchAll<ApiResource>('/api/resources?type=NEWSLETTER')
    const gradients = new Map(staticNewsletters.map((item) => [item.slug, item.coverGradient]))
    return items
      .filter((item) => item.type === 'NEWSLETTER')
      .sort((a, b) => (a.publishDate ?? '').localeCompare(b.publishDate ?? '') || byDisplayOrder(a, b))
      .map((item, index) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        issue: item.issueNumber ?? String(index + 1).padStart(2, '0'),
        date: item.dateLabel ?? item.publishDate ?? '',
        description: item.summary ?? '',
        preview: item.previewText ?? item.summary ?? '',
        highlights: item.highlights ?? [],
        coverGradient: gradients.get(item.slug) ?? NEWSLETTER_GRADIENTS[index % NEWSLETTER_GRADIENTS.length]!,
        pdfUrl: orUndefined(item.fileUrl),
        totalPages: item.totalPages ?? undefined,
        previewImage: orUndefined(item.coverImageUrl),
        visible: item.active !== false,
      }))
  }
}

// ---------------------------------------------------------------- home counters
type ApiImpactNumber = { label: string; value: string; displayOrder?: number }

/** HP-03: home page counters. Icons stay in the static file, matched by label. */
export function loadImpactStats(staticStats: Stat[]) {
  return async (): Promise<Stat[]> => {
    const items = await fetchAll<ApiImpactNumber>('/api/impact-numbers')
    const icons = new Map(staticStats.map((stat) => [stat.label.toLowerCase(), stat.icon]))
    const defaultIcon = staticStats[0]?.icon ?? ''
    return [...items].sort(byDisplayOrder).map((item) => {
      const match = /^([^\d]*)([\d,.]+)(.*)$/.exec(item.value.trim())
      const icon = icons.get(item.label.toLowerCase()) ?? defaultIcon
      if (!match) {
        return { label: item.label, textValue: item.value, icon }
      }
      return {
        label: item.label,
        prefix: match[1] || undefined,
        target: Number(match[2]!.replace(/,/g, '')),
        suffix: match[3] || undefined,
        icon,
      }
    })
  }
}
