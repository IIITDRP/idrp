/** PRD Phase 1 SP-02: every startup has exactly one status. */
export type StartupStatus = 'PRE_INCUBATED' | 'INCUBATED' | 'FUNDED'

/** PRD Phase 1 SP-03 domain taxonomy (plus OTHER). A startup may carry several. */
export type StartupDomain =
  | 'HEALTH_TECH'
  | 'AI_SAAS'
  | 'IOT_SMART_ENERGY'
  | 'TRAVEL_TECH'
  | 'DEEP_TECH'
  | 'AUTO_TECH'
  | 'EDTECH'
  | 'PLATFORM_TECH'
  | 'OTHER'

export interface StartupStat {
  value: string
  label: string
}

export interface StartupPerson {
  name: string
  role?: string
  linkedin?: string
  email?: string
  image?: string
}

export interface Startup {
  id: number
  name: string
  /** Free-text sector shown on the card, e.g. "AI / MENTAL HEALTH". */
  sector: string
  status: StartupStatus
  domains: StartupDomain[]
  logo?: string
  website?: string
  onePager?: string
  brief?: string
  contactEmail?: string
  techFacultyMentors: StartupPerson[]
  founders: StartupPerson[]
  teamMembers: StartupPerson[]
}

export interface StartupsHero {
  imageSrc: string
  imageAlt: string
  eyebrow: string
  title: string
  description: string
}

export interface StartupsIntro {
  eyebrow: string
  title: string
  paragraphs: string[]
  imageSrc: string
  imageAlt: string
}
