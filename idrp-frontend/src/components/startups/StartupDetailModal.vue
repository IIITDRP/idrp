<script setup lang="ts">
/**
 * PRD SP-05 startup detail modal. Headless UI's Dialog provides the focus trap, closes on
 * Esc and on backdrop click, and returns focus to the "View details" button on close.
 */
import { computed, ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X } from 'lucide-vue-next'
import { domainLabels, statusLabels } from '@/data/startups'
import type { Startup, StartupPerson } from '@/types/startups'
import { domainBadgeClass, statusBadgeClass } from '@/components/startups/startupBadges'

const props = defineProps<{
  startup: Startup | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Keep rendering the last startup while the leave transition plays.
const shown = ref<Startup | null>(props.startup)
watch(
  () => props.startup,
  (value) => {
    if (value) shown.value = value
  },
)

const isOpen = computed(() => props.startup !== null)

const foundingTeam = computed<StartupPerson[]>(() => {
  const people = [...(shown.value?.founders ?? []), ...(shown.value?.teamMembers ?? [])]
  const seen = new Set<string>()
  return people.filter((person) => {
    const key = `${person.name.trim().toLowerCase()}|${person.email?.trim().toLowerCase() ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const websiteLabel = computed(() => shown.value?.website?.replace(/^https?:\/\//, '') ?? '')
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog class="relative z-[60]" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/60" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              v-if="shown"
              class="w-full max-w-3xl rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
              <div class="flex items-start gap-4 border-b border-slate-200 p-5 sm:p-7">
                <div
                  class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <img
                    v-if="shown.logo"
                    :src="shown.logo"
                    :alt="`${shown.name} logo`"
                    class="h-full w-full object-contain"
                  />
                  <span v-else class="text-xl font-extrabold text-[var(--color-primary)]" aria-hidden="true">
                    {{ shown.name.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <DialogTitle class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {{ shown.name }}
                  </DialogTitle>
                  <p class="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {{ shown.sector }}
                  </p>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span
                      v-for="status in shown.statuses"
                      :key="status"
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="statusBadgeClass[status]"
                    >
                      {{ statusLabels[status] }}
                    </span>
                    <span
                      v-for="domain in shown.domains"
                      :key="domain"
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="domainBadgeClass"
                    >
                      {{ domainLabels[domain] }}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  aria-label="Close"
                  @click="emit('close')"
                >
                  <X class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div class="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-7">
                <section v-if="shown.brief">
                  <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">About</h3>
                  <p class="mt-2 text-sm leading-7 text-slate-600">{{ shown.brief }}</p>
                </section>

                <section v-if="foundingTeam.length">
                  <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {{ foundingTeam.length === 1 ? 'Founder' : 'Founding team' }}
                  </h3>
                  <ul class="mt-3 grid gap-3 sm:grid-cols-2" role="list">
                    <li
                      v-for="person in foundingTeam"
                      :key="`${person.name}-${person.email ?? ''}`"
                      class="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      <img
                        v-if="person.image"
                        :src="person.image"
                        :alt="person.name"
                        loading="lazy"
                        class="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                      <span
                        v-else
                        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-[var(--color-primary)]"
                        aria-hidden="true"
                      >
                        {{ person.name.charAt(0).toUpperCase() }}
                      </span>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-slate-900">{{ person.name }}</p>
                        <p v-if="person.role" class="text-xs text-slate-500">{{ person.role }}</p>
                        <a
                          v-if="person.linkedin"
                          :href="person.linkedin"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="mt-1 inline-block text-xs font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          LinkedIn<span class="sr-only"> profile of {{ person.name }} (opens in a new tab)</span>
                        </a>
                      </div>
                    </li>
                  </ul>
                </section>

                <section v-if="shown.techFacultyMentors.length">
                  <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {{ shown.techFacultyMentors.length === 1 ? 'Tech faculty mentor' : 'Tech faculty mentors' }}
                  </h3>
                  <ul class="mt-3 grid gap-3 sm:grid-cols-2" role="list">
                    <li
                      v-for="mentor in shown.techFacultyMentors"
                      :key="mentor.name"
                      class="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      <img
                        v-if="mentor.image"
                        :src="mentor.image"
                        :alt="mentor.name"
                        loading="lazy"
                        class="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                      <span
                        v-else
                        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-[var(--color-primary)]"
                        aria-hidden="true"
                      >
                        {{ mentor.name.charAt(0).toUpperCase() }}
                      </span>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-slate-900">{{ mentor.name }}</p>
                        <p v-if="mentor.role" class="text-xs text-slate-500">{{ mentor.role }}</p>
                        <a
                          v-if="mentor.linkedin"
                          :href="mentor.linkedin"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="mt-1 inline-block text-xs font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          LinkedIn<span class="sr-only"> profile of {{ mentor.name }} (opens in a new tab)</span>
                        </a>
                      </div>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Links and contact</h3>
                  <div class="mt-3 flex flex-wrap gap-3">
                    <a
                      v-if="shown.website"
                      :href="shown.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-primary)] px-5 text-sm font-semibold !text-white transition hover:bg-[var(--color-primary-dark)]"
                    >
                      {{ websiteLabel }}
                    </a>
                    <a
                      v-if="shown.onePager"
                      :href="shown.onePager"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex min-h-[44px] items-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
                    >
                      View one-pager
                    </a>
                    <a
                      v-if="shown.contactEmail"
                      :href="`mailto:${shown.contactEmail}`"
                      class="inline-flex min-h-[44px] items-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
                    >
                      {{ shown.contactEmail }}
                    </a>
                    <p v-if="!shown.website && !shown.onePager && !shown.contactEmail" class="text-sm text-slate-500">
                      Contact details will be updated soon.
                    </p>
                  </div>
                </section>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
