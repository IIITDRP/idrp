<script setup lang="ts">
import { computed, ref } from 'vue'
import StartupCard from '@/components/startups/StartupCard.vue'
import StartupDetailModal from '@/components/startups/StartupDetailModal.vue'
import { domainLabels, domainOrder, statusLabels, statusOrder } from '@/data/startups'
import type { Startup, StartupDomain, StartupStatus } from '@/types/startups'

type SortOption = 'name-asc' | 'name-desc' | 'status'

const props = defineProps<{
  startups: Startup[]
}>()

// PRD SP-04: multi-select chips. Within a group chips are OR-ed, across groups AND-ed.
const selectedStatuses = ref<StartupStatus[]>([])
const selectedDomains = ref<StartupDomain[]>([])
const searchQuery = ref('')
const sortBy = ref<SortOption>('name-asc')
const openStartup = ref<Startup | null>(null)

function toggle<T>(list: T[], value: T) {
  const index = list.indexOf(value)
  if (index === -1) list.push(value)
  else list.splice(index, 1)
}

function personText(people: Startup['founders'] | undefined) {
  return (people ?? []).map((person) => `${person.name} ${person.role ?? ''}`).join(' ')
}

function matchesSearch(startup: Startup, query: string) {
  if (!query) return true
  return [
    startup.name,
    startup.sector,
    startup.brief ?? '',
    startup.statuses.map((status) => statusLabels[status]).join(' '),
    startup.domains.map((domain) => domainLabels[domain]).join(' '),
    personText(startup.founders),
    personText(startup.teamMembers),
    personText(startup.techFacultyMentors),
  ]
    .join(' ')
    .toLowerCase()
    .includes(query)
}

const matchesStatus = (startup: Startup) =>
  selectedStatuses.value.length === 0 ||
  startup.statuses.some((status) => selectedStatuses.value.includes(status))

const matchesDomain = (startup: Startup) =>
  selectedDomains.value.length === 0 ||
  startup.domains.some((domain) => selectedDomains.value.includes(domain))

const highestStage = (startup: Startup) => Math.max(-1, ...startup.statuses.map((status) => statusOrder.indexOf(status)))

const visibleStartups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const list = props.startups.filter(
    (startup) => matchesStatus(startup) && matchesDomain(startup) && matchesSearch(startup, query),
  )

  if (sortBy.value === 'name-desc') return list.sort((a, b) => b.name.localeCompare(a.name))
  if (sortBy.value === 'status') {
    return list.sort(
      (a, b) =>
        highestStage(b) - highestStage(a) ||
        a.name.localeCompare(b.name),
    )
  }
  return list.sort((a, b) => a.name.localeCompare(b.name))
})

// Chip counts reflect the other active filters, so a chip never promises results it can't show.
const statusCounts = computed(() => {
  const counts = Object.fromEntries(statusOrder.map((status) => [status, 0])) as Record<StartupStatus, number>
  props.startups.filter(matchesDomain).forEach((startup) => startup.statuses.forEach((status) => counts[status]++))
  return counts
})

const domainCounts = computed(() => {
  const counts = Object.fromEntries(domainOrder.map((domain) => [domain, 0])) as Record<StartupDomain, number>
  props.startups.filter(matchesStatus).forEach((startup) => startup.domains.forEach((domain) => counts[domain]++))
  return counts
})

// Hide domains no startup uses at all (e.g. a new taxonomy value before data exists).
const usedDomains = computed(() =>
  domainOrder.filter((domain) => props.startups.some((startup) => startup.domains.includes(domain))),
)

const hasActiveFilters = computed(
  () => selectedStatuses.value.length > 0 || selectedDomains.value.length > 0 || !!searchQuery.value,
)

function resetFilters() {
  selectedStatuses.value = []
  selectedDomains.value = []
  searchQuery.value = ''
  sortBy.value = 'name-asc'
}

const chipBase =
  'inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2'
const chipOn = 'bg-[var(--color-primary)] text-white shadow-md'
const chipOff =
  'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
</script>

<template>
  <section class="bg-slate-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16 lg:py-20" aria-labelledby="portfolio-heading">
    <div class="mx-auto max-w-7xl">
      <div class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <span class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            Portfolio Directory
          </span>
          <h2 id="portfolio-heading" class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore Our Startup Portfolio
          </h2>
          <p class="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Filter by stage and technology domain, then open a startup to meet its founders and
            mentors.
          </p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" aria-live="polite">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Results</p>
          <p class="mt-1 text-3xl font-bold text-slate-900">{{ visibleStartups.length }}</p>
          <p class="text-sm text-slate-500">
            of {{ startups.length }} startup{{ startups.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <div class="mb-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row">
          <label class="sr-only" for="startup-search">Search startups</label>
          <input
            id="startup-search"
            v-model.trim="searchQuery"
            type="search"
            placeholder="Search by startup, founder, mentor, sector..."
            class="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[var(--color-primary)]/40 focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
          <label class="sr-only" for="startup-sort">Sort startups</label>
          <select
            id="startup-sort"
            v-model="sortBy"
            class="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[var(--color-primary)]/40 focus:ring-2 focus:ring-[var(--color-primary-soft)] sm:min-w-[180px]"
          >
            <option value="name-asc">Sort: A–Z</option>
            <option value="name-desc">Sort: Z–A</option>
            <option value="status">Sort: Stage</option>
          </select>
        </div>

        <fieldset>
          <legend class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Stage</legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in statusOrder"
              :key="status"
              type="button"
              :aria-pressed="selectedStatuses.includes(status)"
              :class="[chipBase, selectedStatuses.includes(status) ? chipOn : chipOff]"
              @click="toggle(selectedStatuses, status)"
            >
              {{ statusLabels[status] }}
              <span class="text-xs font-bold opacity-75">({{ statusCounts[status] }})</span>
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Domain</legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="domain in usedDomains"
              :key="domain"
              type="button"
              :aria-pressed="selectedDomains.includes(domain)"
              :class="[chipBase, selectedDomains.includes(domain) ? chipOn : chipOff]"
              @click="toggle(selectedDomains, domain)"
            >
              {{ domainLabels[domain] }}
              <span class="text-xs font-bold opacity-75">({{ domainCounts[domain] }})</span>
            </button>
          </div>
        </fieldset>

        <div v-if="hasActiveFilters" class="flex justify-end">
          <button
            type="button"
            class="min-h-[44px] rounded-full px-4 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            @click="resetFilters"
          >
            Clear all filters
          </button>
        </div>
      </div>

      <ul v-if="visibleStartups.length > 0" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" role="list">
        <li v-for="startup in visibleStartups" :key="startup.id">
          <StartupCard :startup="startup" @open="openStartup = startup" />
        </li>
      </ul>

      <div
        v-else
        class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm"
      >
        <h3 class="text-xl font-semibold text-slate-900">
          {{ startups.length === 0 ? 'No startups available yet' : 'No startups match your filters' }}
        </h3>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Try removing a stage or domain, or clearing your search.
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          @click="resetFilters"
        >
          Clear all filters
        </button>
      </div>
    </div>

    <StartupDetailModal :startup="openStartup" @close="openStartup = null" />
  </section>
</template>
