<script setup lang="ts">
import SectionHeading from '@/components/common/SectionHeading.vue'

type ResearchPublication = {
  title: string
  authors: string[]
  journal: string
  publisher: string
  year: number
  doi: string
  researchAreas: string[]
  summary: string
}

withDefaults(
  defineProps<{
    publications: ResearchPublication[]
    eyebrow?: string
    title?: string
    description?: string
  }>(),
  {
    eyebrow: 'Research',
    title: 'Research Publications',
    description: 'Peer-reviewed research emerging from this Centre of Excellence.',
  },
)
</script>

<template>
  <section class="bg-slate-50 px-6 py-16 md:px-16 md:py-20 lg:py-24">
    <div class="mx-auto max-w-6xl">
      <SectionHeading :eyebrow="eyebrow" :title="title" :description="description" class="mb-12" />

      <div v-if="publications.length" class="flex flex-col gap-6">
        <article
          v-for="pub in publications"
          :key="pub.doi"
          class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="area in pub.researchAreas"
              :key="area"
              class="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]"
            >
              {{ area }}
            </span>
          </div>

          <h3 class="mt-5 text-2xl font-bold leading-tight text-slate-900">
            {{ pub.title }}
          </h3>

          <p class="mt-2 text-sm font-medium text-slate-500">
            {{ pub.authors.join(', ') }}
          </p>

          <div class="mt-5 flex flex-wrap gap-4 border-y border-slate-100 py-4 text-sm text-slate-600">
            <div>
              <span class="font-semibold text-slate-800">Journal:</span>
              {{ pub.journal }}
            </div>
            <div>
              <span class="font-semibold text-slate-800">Publisher:</span>
              {{ pub.publisher }}
            </div>
            <div>
              <span class="font-semibold text-slate-800">Year:</span>
              {{ pub.year }}
            </div>
          </div>

          <p class="mt-5 text-base leading-7 text-slate-600">
            {{ pub.summary }}
          </p>

          <a
            :href="`https://doi.org/${pub.doi}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold !text-white transition hover:opacity-90"
          >
            View Paper
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5M6 12v6a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 18v-3"
              />
            </svg>
          </a>
        </article>
      </div>

      <div v-else class="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p class="mb-4 text-4xl">📄</p>
        <p class="font-semibold text-slate-500">No publications recorded yet.</p>
      </div>
    </div>
  </section>
</template>
