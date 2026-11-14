/**
 * PRD Phase 1 SEO NFR: unique titles and meta descriptions, OpenGraph tags and a
 * canonical URL for every page. Pages without their own entry get the site default.
 * Admin pages are marked noindex.
 */
import type { RouteLocationNormalized } from 'vue-router'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.idrp.in').replace(/\/$/, '')
const SITE_NAME = 'IIIT Dharwad Research Park (IDRP)'
const DEFAULT_IMAGE = '/campus/idrp_building.jpg'
const DEFAULT_DESCRIPTION =
  'IIIT Dharwad Research Park (IDRP) is a deep-tech incubator supporting founders from idea to scale with incubation, mentorship, labs and investor connect.'

/** Keyed by route name (see ROUTE_NAMES). */
const DESCRIPTIONS: Record<string, string> = {
  home: DEFAULT_DESCRIPTION,
  about: 'About IIIT Dharwad Research Park: our vision, campus and infrastructure, and how we translate research into ventures.',
  team: 'Meet the IDRP team running incubation, programmes and ecosystem building at IIIT Dharwad Research Park.',
  partners: 'Academic, technology, ecosystem and investor partners working with IIIT Dharwad Research Park.',
  mentors: 'Business and technology mentors who guide IDRP startups on product, market and fundraising.',
  investors: 'The IDRP investment committee guiding venture evaluation and investment readiness.',
  'pre-incubation': 'Yuva Udyami pre-incubation at IDRP: eligibility, benefits and seed support for student founders.',
  incubation: 'Udyami incubation at IDRP: resident and virtual incubation, faculty mentorship, labs and funding access.',
  nain: 'NAIN 2.0 at IDRP: student innovation projects supported by the Government of Karnataka.',
  cif: 'Common Instrumentation Facility at IDRP: shared prototyping, fabrication and test equipment.',
  leap: 'LEAP Innovation Labs Program: innovation labs across partner institutions in Karnataka.',
  'coe-quantum-ai': 'Centre of Excellence in Quantum AI and Computing at IIIT Dharwad Research Park.',
  cbde: 'Capacity Building for Design and Entrepreneurship (CBDE) programmes at IDRP.',
  rgep: 'Rajiv Gandhi Entrepreneurship Program (RGEP): taking innovations to prototype and MVP with IDRP.',
  courses: 'Technical Education Academy at IDRP: certification courses and workshops in emerging technologies.',
  'technical-education-academy': 'Technical Education Academy at IDRP: certification courses and workshops in emerging technologies.',
  'certification-courses': 'Certification courses from the IDRP Technical Education Academy.',
  workshops: 'Hands-on workshops from the IDRP Technical Education Academy.',
  'industry-research': 'Industry research and consulting with IIIT Dharwad faculty and IDRP labs.',
  facilities: 'Workspace, research labs, prototyping equipment and GPU compute available at IIIT Dharwad Research Park.',
  events: 'Upcoming and past IDRP events: Startup School, workshops, hackathons and ecosystem programmes.',
  startups: 'Explore the IDRP startup portfolio by stage and technology domain, and meet the founders.',
  matchmaking: 'Investor and startup matchmaking at IDRP: connect funded and early-stage ventures with investors.',
  'startup-matchmaking': 'Startups: share your profile to be matched with investors through IDRP.',
  'investor-matchmaking': 'Investors: share your thesis to meet relevant IDRP startups.',
  resources: 'IDRP newsletters and publications: quarterly updates from the research park.',
  careers: 'Open positions at IIIT Dharwad Research Park.',
  contact: 'Contact IIIT Dharwad Research Park, Pi Block, IIIT Dharwad, Karnataka.',
  'privacy-policy': 'How the IDRP website collects, uses and protects your personal data.',
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

export function applyRouteSeo(to: RouteLocationNormalized) {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title.trim() : ''
  const title = !pageTitle || to.name === 'home' ? `IDRP | ${SITE_NAME}` : `${pageTitle} | IDRP`
  const description =
    (typeof to.meta.description === 'string' && to.meta.description) ||
    DESCRIPTIONS[String(to.name ?? '')] ||
    DEFAULT_DESCRIPTION
  const url = `${SITE_URL}${to.path === '/' ? '/' : to.path.replace(/\/$/, '')}`
  const isPrivate = to.path.startsWith('/admin')

  document.title = title
  setMeta('name', 'description', description)
  setMeta('name', 'robots', isPrivate ? 'noindex, nofollow' : 'index, follow')
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', `${SITE_URL}${DEFAULT_IMAGE}`)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setCanonical(url)
}
