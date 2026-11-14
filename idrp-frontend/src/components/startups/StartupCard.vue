<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { domainLabels, statusLabels } from '@/data/startups'
import type { Startup } from '@/types/startups'
import { domainBadgeClass, statusBadgeClass } from '@/components/startups/startupBadges'

const props = defineProps<{
  startup: Startup
}>()

defineEmits<{
  (e: 'open'): void
}>()

const logoBroken = ref(false)
const initial = computed(() => props.startup.name.charAt(0).toUpperCase())

watch(
  () => props.startup.logo,
  () => {
    logoBroken.value = false
  },
)
</script>

<template>
  <article
    class="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="flex items-start gap-4">
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      >
        <img
          v-if="!logoBroken && startup.logo"
          :src="startup.logo"
          :alt="`${startup.name} logo`"
          loading="lazy"
          class="h-full w-full object-contain"
          @error="logoBroken = true"
        />
        <span v-else class="text-xl font-extrabold text-[var(--color-primary)]" aria-hidden="true">
          {{ initial }}
        </span>
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="text-lg font-bold leading-snug tracking-tight text-slate-900">
          {{ startup.name }}
        </h3>
        <p class="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          {{ startup.sector || 'Sector to be updated' }}
        </p>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusBadgeClass[startup.status]">
        {{ statusLabels[startup.status] }}
      </span>
      <span
        v-for="domain in startup.domains"
        :key="domain"
        class="rounded-full px-3 py-1 text-xs font-semibold"
        :class="domainBadgeClass"
      >
        {{ domainLabels[domain] }}
      </span>
    </div>

    <p v-if="startup.brief" class="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
      {{ startup.brief }}
    </p>

    <div class="mt-auto pt-5">
      <button
        type="button"
        class="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        :aria-label="`View details for ${startup.name}`"
        @click="$emit('open')"
      >
        View details
      </button>
    </div>
  </article>
</template>
