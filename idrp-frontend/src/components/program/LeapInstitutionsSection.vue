<script setup lang="ts">
import SectionHeading from '@/components/common/SectionHeading.vue'
import type { LeapInstitution } from '@/data/leap'

defineProps<{
  institutions: LeapInstitution[]
}>()
</script>

<template>
  <section class="bg-white px-6 py-16 md:px-16 md:py-20 lg:py-24">
    <div class="mx-auto max-w-6xl">
      <SectionHeading title="Participating Institutions" class="mb-16" />

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="inst in institutions"
          :key="inst.name"
          class="rounded-3xl border border-slate-200 p-6 text-center shadow-sm"
        >
          <img
            v-if="inst.logo"
            :src="inst.logo"
            :alt="inst.name"
            loading="lazy"
            class="mx-auto mb-4 h-16 w-auto object-contain"
          />
          <h3 class="text-lg font-bold text-slate-900">{{ inst.name }}</h3>
          <p v-if="inst.city || inst.state" class="mt-2 text-sm text-slate-500">
            {{ [inst.city, inst.state].filter(Boolean).join(', ') }}
          </p>
          <p v-if="inst.description" class="mt-3 text-sm text-slate-600">
            {{ inst.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
