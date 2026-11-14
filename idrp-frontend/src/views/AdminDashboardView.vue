<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { inquiryAdminService, type InquirySummary } from '@/services/inquiryAdminService'

const summary = ref<InquirySummary | null>(null)

const modules = [
  { label: 'Events', to: '/admin/events', text: 'Upcoming and past events, registration links, galleries.' },
  { label: 'Startups', to: '/admin/startups', text: 'Portfolio directory: status, domains, founders, mentors.' },
  { label: 'Resources', to: '/admin/resources', text: 'Newsletters and publications.' },
  { label: 'Programs', to: '/admin/programs', text: 'Programme records.' },
  { label: 'Partners', to: '/admin/partners', text: 'Partner logos and categories.' },
  { label: 'Mentors', to: '/admin/mentors', text: 'Mentor profiles.' },
  { label: 'Team Members', to: '/admin/team-members', text: 'The IDRP team page.' },
  { label: 'Board Members', to: '/admin/board-members', text: 'Investment committee page.' },
  { label: 'Home Counters', to: '/admin/impact-numbers', text: 'Impact numbers on the home page.' },
]

onMounted(async () => {
  try {
    summary.value = await inquiryAdminService.summary()
  } catch {
    summary.value = null
  }
})
</script>

<template>
  <AdminLayout>
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">IDRP Admin</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-950">Dashboard</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Changes you save here appear on the public website straight away - no deployment needed.
      </p>
    </div>

    <RouterLink
      to="/admin/inquiries"
      class="mt-8 flex flex-col gap-2 rounded-3xl bg-[var(--color-primary)] p-6 text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p class="text-lg font-bold">Inquiries inbox</p>
        <p class="text-sm text-white/85">Form submissions from the website, waiting for follow-up.</p>
      </div>
      <p v-if="summary" class="text-3xl font-bold">
        {{ summary.newCount }}
        <span class="text-base font-semibold text-white/85">new</span>
      </p>
    </RouterLink>

    <section class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="module in modules"
        :key="module.label"
        :to="module.to"
        class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-[var(--color-primary)]"
      >
        <p class="text-lg font-bold text-slate-950">{{ module.label }}</p>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ module.text }}</p>
      </RouterLink>
    </section>
  </AdminLayout>
</template>
