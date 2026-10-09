/**
 * ADMIN DEMO MODE
 * ---------------------------------------------------------------------
 * Lets admins try the full admin panel (login + CRUD + uploads) before the
 * Spring Boot backend is deployed. Every admin API call is answered in the
 * browser from localStorage, seeded with the site's current content.
 * Nothing is sent to a server and nothing changes on the public website.
 *
 * Enabled when VITE_ADMIN_DEMO_MODE=true, or when VITE_ADMIN_DEMO_MODE is
 * unset and no VITE_API_BASE_URL is configured. Set VITE_ADMIN_DEMO_MODE=false
 * (or set VITE_API_BASE_URL) once the real backend is live.
 */

const demoFlag = import.meta.env.VITE_ADMIN_DEMO_MODE

export const ADMIN_DEMO_MODE =
  demoFlag === 'true' || (demoFlag !== 'false' && !import.meta.env.VITE_API_BASE_URL)

export const DEMO_ADMIN_EMAIL = 'admin@idrp.in'
export const DEMO_ADMIN_PASSWORD = 'admin@123'

const STORAGE_PREFIX = 'idrp_admin_demo_'

// localStorage is ~5MB per origin, so uploads are stored inline as data URLs
// with a much smaller cap than the backend's 100MB.
const DEMO_MAX_UPLOAD_BYTES = 2 * 1024 * 1024

type DemoRecord = Record<string, unknown> & { id: number }

const seedFiles = import.meta.glob<unknown[]>('@/mocks/admin-demo-seed/*.json', {
  import: 'default',
})

// Fields the backend fills with defaults but the seed files leave out.
const seedDefaults: Record<string, Record<string, unknown>> = {
  partners: { active: true },
  startups: { gallery: [], founders: [], teamMembers: [], techFacultyMentors: [] },
  mentors: { active: true },
  'team-members': { active: true },
  'board-members': { active: true },
}

const collections = new Set([
  'events',
  'startups',
  'programs',
  'resources',
  'partners',
  'mentors',
  'team-members',
  'board-members',
])

async function loadSeed(collection: string): Promise<DemoRecord[]> {
  let items: Record<string, unknown>[]

  if (collection === 'events') {
    const { events } = await import('@/data/events')
    items = events as unknown as Record<string, unknown>[]
  } else {
    const loader = Object.entries(seedFiles).find(([path]) =>
      path.endsWith(`/${collection}.json`),
    )?.[1]
    items = loader ? ((await loader()) as Record<string, unknown>[]) : []
  }

  const now = new Date().toISOString()

  return items.map((item, index) => ({
    ...seedDefaults[collection],
    ...item,
    id: index + 1,
    createdAt: now,
    updatedAt: now,
  }))
}

function writeCollection(collection: string, items: DemoRecord[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(items))
  } catch {
    throw new Error(
      'Demo storage is full. Remove some uploaded files or use "Reset demo data" in the banner.',
    )
  }
}

async function readCollection(collection: string): Promise<DemoRecord[]> {
  const stored = localStorage.getItem(STORAGE_PREFIX + collection)

  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // corrupted entry - fall through and reseed
    }
  }

  const seeded = await loadSeed(collection)
  writeCollection(collection, seeded)
  return seeded
}

export function resetAdminDemoData() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key))
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

async function handleUpload(body: BodyInit | null | undefined) {
  const file = body instanceof FormData ? body.get('file') : null

  if (!(file instanceof File)) {
    throw new Error('No file selected.')
  }

  if (file.size > DEMO_MAX_UPLOAD_BYTES) {
    throw new Error('In demo mode, uploads are limited to 2MB. The live admin panel will allow 100MB.')
  }

  return {
    fileName: file.name,
    fileUrl: await readFileAsDataUrl(file),
    fileType: file.type,
    fileSize: file.size,
  }
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

/** Drop-in replacement for adminFetch's network call while demo mode is on. */
export async function demoAdminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()
  const [, collection, rawId] = path.split('?')[0].split('/').filter(Boolean)

  // Small delay so loading states behave like they will against the real API.
  await new Promise((resolve) => setTimeout(resolve, 150))

  if (collection === 'files' && rawId === 'upload' && method === 'POST') {
    return (await handleUpload(options.body)) as T
  }

  if (!collection || !collections.has(collection)) {
    throw new Error('This action is not available in demo mode.')
  }

  const items = await readCollection(collection)
  const id = rawId === undefined ? undefined : Number(rawId)
  const index = id === undefined ? -1 : items.findIndex((item) => item.id === id)
  const payload = typeof options.body === 'string' ? JSON.parse(options.body) : {}
  const now = new Date().toISOString()

  if (method === 'GET' && id === undefined) {
    return clone({ content: items }) as T
  }

  if (method === 'POST' && id === undefined) {
    const created: DemoRecord = {
      ...payload,
      id: items.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      createdAt: now,
      updatedAt: now,
    }
    writeCollection(collection, [created, ...items])
    return clone(created) as T
  }

  if (index === -1) {
    throw new Error('Record not found.')
  }

  if (method === 'GET') {
    return clone(items[index]) as T
  }

  if (method === 'PUT') {
    const updated: DemoRecord = { ...items[index], ...payload, id: items[index].id, updatedAt: now }
    items[index] = updated
    writeCollection(collection, items)
    return clone(updated) as T
  }

  if (method === 'DELETE') {
    items.splice(index, 1)
    writeCollection(collection, items)
    return null as T
  }

  throw new Error('This action is not available in demo mode.')
}
