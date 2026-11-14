// Writes public/sitemap.xml and public/robots.txt (PRD Phase 1 SEO NFR).
// Runs automatically before every production build (npm run build).
// Static routes come from the router; detail pages from the static data.
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { projectRoot, withDataLoader } from './lib/loadData.mjs'

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.idrp.in').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const routerSource = await readFile(join(projectRoot, 'src', 'router', 'index.ts'), 'utf8')
const staticPaths = [...routerSource.matchAll(/createPageRoute\(\s*'([^']+)'/g)]
  .map((match) => match[1])
  .filter((path) => !path.includes(':') && !path.startsWith('/admin'))

const dynamicPaths = await withDataLoader(async (load) => {
  const { newsletters } = await load('/src/data/newsletters.ts')
  const { jobs } = await load('/src/data/careers.ts')
  const { certificationCourseDetailPages } = await load('/src/data/academyCatalog.ts')

  return [
    ...newsletters.filter((n) => n.visible !== false).map((n) => `/resources/newsletters/${n.slug}`),
    ...jobs.map((job) => `/careers/${job.slug}`),
    ...certificationCourseDetailPages.map((page) => `/courses/certification/${page.slug}`),
  ]
})

const priority = (path) => (path === '/' ? '1.0' : path.split('/').length <= 2 ? '0.8' : '0.6')
const paths = [...new Set([...staticPaths, ...dynamicPaths])].sort()

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map(
    (path) =>
      `  <url><loc>${SITE_URL}${path === '/' ? '/' : path}</loc><lastmod>${today}</lastmod><priority>${priority(path)}</priority></url>`,
  ),
  '</urlset>',
  '',
].join('\n')

const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin',
  'Disallow: /api/',
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n')

await writeFile(join(projectRoot, 'public', 'sitemap.xml'), xml, 'utf8')
await writeFile(join(projectRoot, 'public', 'robots.txt'), robots, 'utf8')
console.log(`sitemap.xml: ${paths.length} URLs (${SITE_URL}); robots.txt written`)
