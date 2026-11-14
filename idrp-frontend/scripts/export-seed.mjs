// Regenerates the backend seed JSON (idrp-backend/src/main/resources/seed/*.json) from
// the frontend's static data, so the website's offline fallback and the database's
// initial content are always the same data. Run after editing src/data/*.ts:
//
//   npm run export-seed
//
// Only the modules the website reads from the API are exported. jobs, programs,
// gallery-images and nain-projects seeds are left untouched (their pages are static).
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { projectRoot, withDataLoader } from './lib/loadData.mjs'

const seedDir = join(projectRoot, '..', 'idrp-backend', 'src', 'main', 'resources', 'seed')

const blank = (value) => (value === undefined || value === null || String(value).trim() === '' ? null : value)

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }
/** 'Jan–Mar 2025' -> '2025-01-01' (used to order newsletters newest first). */
function publishDateFromLabel(label) {
  const match = /([A-Za-z]{3})[A-Za-z]*.*?(\d{4})/.exec(label ?? '')
  if (!match || !MONTHS[match[1].toLowerCase()]) return null
  return `${match[2]}-${String(MONTHS[match[1].toLowerCase()]).padStart(2, '0')}-01`
}

const person = (p) => ({
  name: p.name,
  role: blank(p.role),
  linkedin: blank(p.linkedin),
  email: blank(p.email),
  imageUrl: blank(p.image),
})

async function writeSeed(name, records) {
  await writeFile(join(seedDir, `${name}.json`), JSON.stringify(records, null, 2) + '\n', 'utf8')
  console.log(`  ${name}.json  ${records.length} records`)
}

await withDataLoader(async (load) => {
  const { startups } = await load('/src/data/startups.ts')
  const { events } = await load('/src/data/events.ts')
  const { allMentors } = await load('/src/data/mentors.ts')
  const { partnerCategories } = await load('/src/data/partners.ts')
  const { teamMembers } = await load('/src/data/team.ts')
  const { investmentCommitteeMembers } = await load('/src/data/investmentCommittee.ts')
  const { newsletters } = await load('/src/data/newsletters.ts')
  const { stats } = await load('/src/data/home.ts')

  await mkdir(seedDir, { recursive: true })
  console.log(`Writing seed files to ${seedDir}`)

  await writeSeed(
    'startups',
    startups.map((s) => ({
      name: s.name,
      sector: blank(s.sector),
      status: s.status,
      domains: s.domains,
      logo: blank(s.logo),
      website: blank(s.website),
      onePager: blank(s.onePager),
      brief: blank(s.brief),
      contactEmail: blank(s.contactEmail),
      techFacultyMentors: (s.techFacultyMentors ?? []).map(person),
      founders: (s.founders ?? []).map(person),
      teamMembers: (s.teamMembers ?? []).map(person),
    })),
  )

  await writeSeed(
    'events',
    events.map((e) => ({
      slug: e.slug,
      title: e.title,
      category: e.category,
      initiative: blank(e.initiative),
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      displayDate: e.displayDate,
      time: blank(e.time),
      location: e.location,
      mode: blank(e.mode),
      image: e.image,
      imageFit: e.imageFit ?? 'cover',
      registerUrl: blank(e.registerUrl),
      brochureUrl: blank(e.brochureUrl),
      galleryUrl: blank(e.galleryUrl),
      visible: e.visible !== false,
      gallery: e.gallery ?? [],
    })),
  )

  await writeSeed(
    'mentors',
    allMentors.map((m) => ({
      name: m.name,
      designation: blank(m.role),
      organization: blank(m.organization),
      bio: blank(m.bio),
      linkedinUrl: blank(m.linkedin),
      profileImageUrl: blank(m.image),
      active: true,
    })),
  )

  await writeSeed(
    'partners',
    partnerCategories.flatMap((category) =>
      category.partners.map((p) => ({
        name: p.name,
        category: category.key,
        websiteUrl: blank(p.websiteUrl),
        logoUrl: blank(p.logo),
        description: blank(p.description),
        abbr: blank(p.abbr),
        accentColor: blank(p.color),
        active: true,
      })),
    ),
  )

  await writeSeed(
    'team-members',
    teamMembers.map((m, index) => ({
      name: m.name,
      designation: blank(m.role),
      profileImageUrl: blank(m.image),
      linkedinUrl: blank(m.linkedinUrl),
      profileUrl: blank(m.profileUrl),
      displayOrder: index + 1,
      active: true,
    })),
  )

  await writeSeed(
    'board-members',
    investmentCommitteeMembers.map((m, index) => ({
      name: m.name,
      designation: blank(m.role),
      boardType: 'Investment Committee',
      profileImageUrl: blank(m.image),
      linkedinUrl: blank(m.linkedinUrl),
      profileUrl: blank(m.profileUrl),
      displayOrder: index + 1,
      active: true,
    })),
  )

  await writeSeed(
    'resources',
    newsletters.map((n) => ({
      title: n.title,
      slug: n.slug,
      type: 'NEWSLETTER',
      summary: blank(n.description),
      previewText: blank(n.preview),
      fileUrl: blank(n.pdfUrl),
      coverImageUrl: blank(n.previewImage),
      issueNumber: blank(n.issue),
      dateLabel: blank(n.date),
      publishDate: publishDateFromLabel(n.date),
      highlights: n.highlights ?? [],
      totalPages: n.totalPages ?? null,
      author: 'IDRP',
      displayOrder: n.id,
      active: n.visible !== false,
    })),
  )

  await writeSeed(
    'impact-numbers',
    stats.map((s, index) => ({
      value: s.textValue ?? `${s.prefix ?? ''}${s.target ?? ''}${s.suffix ?? ''}`,
      label: s.label,
      displayOrder: index + 1,
      visible: true,
    })),
  )
})
