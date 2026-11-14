<template>
  <div class="facilities-view">
    <ProgramHeroSection v-bind="facilitiesHero" />

    <nav aria-label="On this page" class="border-b border-slate-200 bg-white px-4 sm:px-6">
      <ul class="mx-auto flex max-w-6xl flex-wrap gap-2 py-4" role="list">
        <li v-for="group in facilityGroups" :key="group.id">
          <a
            :href="`#${group.id}`"
            class="inline-flex min-h-[44px] items-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
          >
            {{ group.eyebrow }}
          </a>
        </li>
      </ul>
    </nav>

    <section
      v-for="(group, index) in facilityGroups"
      :id="group.id"
      :key="group.id"
      class="scroll-mt-24 px-4 py-16 sm:px-6 md:px-16 md:py-20"
      :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
      :aria-labelledby="`${group.id}-heading`"
    >
      <div class="mx-auto max-w-6xl">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {{ group.eyebrow }}
          </p>
          <h2 :id="`${group.id}-heading`" class="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {{ group.title }}
          </h2>
          <p class="mt-4 text-base leading-7 text-slate-600">{{ group.description }}</p>
          <RouterLink
            v-if="group.link"
            :to="group.link.to"
            class="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {{ group.link.label }} →
          </RouterLink>
        </div>

        <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
          <li
            v-for="item in group.items"
            :key="item.title"
            class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <img
              :src="item.image"
              :alt="item.imageAlt"
              loading="lazy"
              width="400"
              height="260"
              class="aspect-[4/3] w-full object-cover"
            />
            <div class="p-5">
              <h3 class="text-base font-bold text-slate-900">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <div class="pt-16">
      <ProgramCTASection v-bind="facilitiesCta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramHeroSection from '@/components/program/ProgramHeroSection.vue'
import ProgramCTASection from '@/components/program/ProgramCTASection.vue'
import { facilitiesCta, facilitiesHero, facilityGroups } from '@/data/facilities'
</script>
