/**
 * PRD Phase 1 SV-03: Infrastructure and Lab Access.
 * Everything here restates facts already published elsewhere on the site (About page
 * campus gallery, Udyami incubation page, CIF and CoE Quantum AI pages). Seat counts
 * and pricing are not listed because IDRP has not published them yet.
 */
export type FacilityItem = {
  title: string
  description: string
  image: string
  imageAlt: string
}

export type FacilityGroup = {
  id: string
  eyebrow: string
  title: string
  description: string
  items: FacilityItem[]
  link?: { label: string; to: string }
}

export const facilitiesHero = {
  eyebrow: 'Services & Facilities',
  title: 'Infrastructure and Lab Access',
  subtitle:
    'Workspace, research labs, prototyping equipment and compute available to IDRP startups, researchers and partners.',
  image: '/campus/idrp_building.jpg',
  imageAlt: 'The IIIT Dharwad Research Park building',
}

export const facilityGroups: FacilityGroup[] = [
  {
    id: 'workspace',
    eyebrow: 'Workspace',
    title: 'Workspace for incubated startups',
    description:
      'Incubated startups can work from the IDRP building on the IIIT Dharwad campus (resident model), engage remotely (virtual model), or combine both. Workspace and infrastructure access is optional and is arranged as part of incubation.',
    link: { label: 'See the Udyami incubation programme', to: '/programs/incubation' },
    items: [
      {
        title: 'Workspaces',
        description: 'Desk space for resident startup teams inside the research park.',
        image: '/campus/idrp_workspace.jpeg',
        imageAlt: 'Startup workspace inside the IDRP building',
      },
      {
        title: 'Collaboration zones',
        description: 'Open areas for team work, founder meetings and peer collaboration.',
        image: '/campus/idrp_workspace_2.jpeg',
        imageAlt: 'Collaborative workspace inside IDRP',
      },
      {
        title: 'Meeting rooms',
        description: 'Rooms for investor, mentor and customer meetings.',
        image: '/campus/idrp_meeting.jpeg',
        imageAlt: 'Meeting room at IDRP',
      },
      {
        title: 'Presentation and event spaces',
        description: 'Spaces for pitch sessions, workshops and talks.',
        image: '/campus/idrp_presentation.jpeg',
        imageAlt: 'Presentation and session space at IDRP',
      },
    ],
  },
  {
    id: 'labs',
    eyebrow: 'Research labs',
    title: 'Specialised labs',
    description:
      'Domain labs at IIIT Dharwad Research Park support research translation and prototyping in deep-tech areas.',
    items: [
      {
        title: '5G Lab',
        description: 'Infrastructure for next-generation wireless and telecom experimentation.',
        image: '/campus/idrp_5g_lab.jpeg',
        imageAlt: '5G laboratory at IDRP',
      },
      {
        title: 'Drone Lab',
        description: 'Space and equipment for building and testing unmanned aerial systems.',
        image: '/campus/idrp_drone_lab.jpeg',
        imageAlt: 'Drone laboratory at IDRP',
      },
      {
        title: 'NLP Lab',
        description: 'Natural language processing research and product development.',
        image: '/campus/idrp_nlp.jpeg',
        imageAlt: 'Natural language processing lab at IDRP',
      },
      {
        title: 'Speech Lab',
        description: 'Speech processing and voice technology research.',
        image: '/campus/idrp_speech_lab.jpeg',
        imageAlt: 'Speech laboratory at IDRP',
      },
      {
        title: 'VLSI Lab',
        description: 'Chip design and VLSI research and development.',
        image: '/campus/idrp_vlsi_lab.jpg',
        imageAlt: 'VLSI laboratory at IDRP',
      },
    ],
  },
  {
    id: 'prototyping',
    eyebrow: 'Prototyping',
    title: 'Common Instrumentation Facility (CIF)',
    description:
      'A Government of Karnataka initiative (Department of Electronics, IT, BT) giving startups, researchers and academic teams shared access to fabrication and test equipment, so they do not have to buy it themselves.',
    link: { label: 'About the Common Instrumentation Facility', to: '/programs/cif' },
    items: [
      {
        title: '3D printing',
        description: 'Additive manufacturing for rapid prototypes and enclosures.',
        image: '/cif/img4.jpeg',
        imageAlt: '3D printing machine at the CIF',
      },
      {
        title: 'Laser cutting',
        description: 'Precision cutting for mechanical parts and housings.',
        image: '/cif/img2.jpeg',
        imageAlt: 'Laser cutting machine at the CIF',
      },
      {
        title: 'Lathe and drilling',
        description: 'Machining tools for mechanical prototyping.',
        image: '/cif/img1.jpeg',
        imageAlt: 'Lathe machine at the CIF',
      },
      {
        title: 'Electronics test and measurement',
        description: 'Test and measurement instruments and soldering stations for hardware development.',
        image: '/cif/img5.jpeg',
        imageAlt: 'Electronic test and measurement instruments at the CIF',
      },
    ],
  },
  {
    id: 'compute',
    eyebrow: 'Compute',
    title: 'Compute and storage',
    description:
      'GPU compute and shared storage for AI and data-intensive work, alongside the Centre of Excellence in Quantum AI and Computing.',
    link: { label: 'About the CoE in Quantum AI and Computing', to: '/programs/coe-quantum-ai' },
    items: [
      {
        title: 'L40 GPU server',
        description: 'NVIDIA L40-based server for model training, inference and simulation.',
        image: '/cif/img10.jpeg',
        imageAlt: 'L40 GPU server at the CIF',
      },
      {
        title: 'Network-attached storage',
        description: 'Shared storage for datasets and project files.',
        image: '/cif/img11.jpeg',
        imageAlt: 'Network-attached storage unit at the CIF',
      },
      {
        title: 'Workstations',
        description: 'Engineering workstations for design and development.',
        image: '/cif/img3.jpeg',
        imageAlt: 'Workstation at the CIF',
      },
    ],
  },
]

export const facilitiesCta = {
  eyebrow: 'Access',
  title: 'Need lab time, equipment or workspace?',
  description:
    'Tell us what you are building and what you need. The IDRP team will confirm availability and the terms of access.',
  primaryActionLabel: 'Request access',
  primaryActionTo: '/contact',
  secondaryActionLabel: 'Apply for incubation',
  secondaryActionTo: '/apply/incubation',
}
