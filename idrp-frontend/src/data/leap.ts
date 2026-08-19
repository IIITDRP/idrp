import type { ProgramPageData } from '@/types/program'

export type LeapInstitution = {
  name: string
  city?: string
  state?: string
  description?: string
  logo?: string
}

export const leapPage: ProgramPageData = {
  hero: {
    eyebrow: 'Government Initiatives',
    title: 'LEAP – Innovation Labs Program',
    subtitle: '',
    image: '/leap-hero.jfif',
    imageAlt: 'LEAP Innovation Labs Program',
  },

  intro: {
    eyebrow: 'Overview',
    title: 'Building Innovation Labs Across Partner Institutions',
    paragraphs: [
      'The Innovation Lab is a transformative initiative launched under the support of the Karnataka Innovation and Technology Society (KITS), Department of Electronics, IT & BT, Government of Karnataka. It is designed to provide necessary lab equipment for learning and innovation across educational institutions in Karnataka — especially in Tier 2 and Tier 3 regions.',
      'With a grant support of INR 1.25 crores, the Innovation Lab will serve as a vibrant ecosystem for ideation, prototyping, and collaboration. It aims to empower students and faculty to explore frontier technologies in areas such as Biotechnology, Robotics, AgriTech, Cybersecurity, and AI/ML, while fostering inclusive access and inter-institutional engagement.',
      'The lab is not just a facility but a launchpad for regional transformation, aligned with the Local Economy Accelerator Program (LEAP), which envisions equitable growth and global visibility for Karnataka’s emerging tech clusters. Through structured mentorship, outreach programs, and hands-on innovation challenges, the lab will nurture the next generation of problem-solvers and changemakers.',
    ],
    image: '/leap/leap-intro.jpeg',
    imageAlt: 'LEAP Overview',
    details: [
      {
        label: 'Supporting Body',
        value: 'Karnataka Innovation and Technology Society (KITS), Dept. of Electronics, IT & BT, Government of Karnataka',
      },
      {
        label: 'Grant Support',
        value: 'INR 1.25 Crores',
      },
    ],
  },

  value: {
    eyebrow: 'Why This Initiative?',
    title: 'The Value of the Innovation Labs Program',
    items: [
      {
        title: 'Frontier Technology Access',
        description:
          'Equips institutions with lab infrastructure to explore Biotechnology, Robotics, AgriTech, Cybersecurity, and AI/ML.',
      },
      {
        title: 'Tier 2 & Tier 3 Reach',
        description:
          'Extends innovation infrastructure to educational institutions beyond major cities, prioritizing equitable access.',
      },
      {
        title: 'Regional Transformation',
        description:
          'Aligned with the Local Economy Accelerator Program (LEAP), driving equitable growth and global visibility for Karnataka’s emerging tech clusters.',
      },
      {
        title: 'Structured Mentorship',
        description:
          'Outreach programs and hands-on innovation challenges nurture the next generation of problem-solvers and changemakers.',
      },
    ],
    image: '/leap/leap-value.jpeg',
    imageAlt: 'LEAP Value',
  },

  cta: {
    eyebrow: 'Get Involved',
    title: 'Partner With LEAP',
    description: 'Connect with IDRP to explore how your institution can join the LEAP Innovation Labs Program.',
    primaryActionLabel: 'Contact Us',
    primaryActionTo: '/contact',
  },
}

export const leapInstitutions: LeapInstitution[] = [
  {
    name: 'G Madegowda Institute of Technology',
    city: 'Mandya',
    state: 'Karnataka',
    logo: '/leap/institutions/gmit.png',
  },
  {
    name: 'Kuvempu University',
    city: 'Shivamogga',
    state: 'Karnataka',
    logo: '/leap/institutions/kuvempu.png',
  },
  {
    name: 'KK Government Engineering College, K.R. Pet',
    city: 'Krishnarajpet',
    state: 'Karnataka',
    logo: '/leap/institutions/krpet.jpg',
  },
  {
    name: 'UBDT College of Engineering',
    city: 'Davangere',
    state: 'Karnataka',
    logo: '/leap/institutions/ubdt.png',
  },
  {
    name: 'Government Polytechnic, K.R. Pete',
    city: 'Krishnarajpet',
    state: 'Karnataka',
    logo: '/leap/institutions/gpt-krpete.png',
  },
  {
    name: 'Organic Farming Research Center, Keladi Shivappa Nayaka University of Agricultural and Horticultural Sciences (KSNUAHS)',
    city: 'Iruvakki, Shivamogga',
    state: 'Karnataka',
  },
  {
    name: 'Government Engineering College, Kushalnagar',
    city: 'Kushalnagar',
    state: 'Karnataka',
    logo: '/leap/institutions/kushalnagar.jpg',
  },
]
