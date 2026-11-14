<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { getAdminUser } from '@/services/authService'
import {
  inquiriesToCsv,
  inquiryAdminService,
  inquiryFormTypeLabels,
  inquiryStatusLabels,
  type Inquiry,
  type InquiryPage,
  type InquiryStatus,
  type InquirySummary,
} from '@/services/inquiryAdminService'

const PAGE_SIZE = 20
const statuses = Object.keys(inquiryStatusLabels) as InquiryStatus[]

const filters = reactive({ status: 'NEW' as InquiryStatus | '', formType: '', search: '' })
const page = ref(0)
const result = ref<InquiryPage | null>(null)
const summary = ref<InquirySummary | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const selected = ref<Inquiry | null>(null)
const editStatus = ref<InquiryStatus>('NEW')
const editNotes = ref('')
const saving = ref(false)

const isSuperAdmin = computed(() => getAdminUser()?.role === 'SUPER_ADMIN')
const rows = computed(() => result.value?.content ?? [])
const totalPages = computed(() => result.value?.totalPages ?? 0)

const statusBadge: Record<InquiryStatus, string> = {
  NEW: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-sky-100 text-sky-800',
  RESOLVED: 'bg-emerald-100 text-emerald-800',
  SPAM: 'bg-slate-200 text-slate-600',
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

const typeLabel = (type: string) => inquiryFormTypeLabels[type] ?? type

/** Payload fields not already shown as columns, for the detail panel. */
const extraFields = computed(() => {
  if (!selected.value) return []
  const shown = new Set(['fullName', 'email', 'phone', 'organization', 'message', 'consent', 'botcheck'])
  return Object.entries(selected.value.payload ?? {})
    .filter(([key, value]) => !shown.has(key) && value !== '' && value !== null && value !== false)
    .map(([key, value]) => ({
      key: key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
      value: Array.isArray(value) ? value.join(', ') : String(value),
    }))
})

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [pageData, summaryData] = await Promise.all([
      inquiryAdminService.list({ ...filters, page: page.value, size: PAGE_SIZE }),
      inquiryAdminService.summary(),
    ])
    result.value = pageData
    summary.value = summaryData
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load inquiries'
  } finally {
    loading.value = false
  }
}

let searchTimer: number | undefined
watch(
  () => [filters.status, filters.formType],
  () => {
    page.value = 0
    load()
  },
)
watch(
  () => filters.search,
  () => {
    window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => {
      page.value = 0
      load()
    }, 350)
  },
)

function open(row: Inquiry) {
  selected.value = row
  editStatus.value = row.status
  editNotes.value = row.adminNotes ?? ''
  successMessage.value = ''
}

async function save() {
  if (!selected.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const updated = await inquiryAdminService.update(selected.value.id, editStatus.value, editNotes.value)
    selected.value = updated
    successMessage.value = 'Inquiry updated'
    await load()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to update inquiry'
  } finally {
    saving.value = false
  }
}

async function remove(row: Inquiry) {
  if (!window.confirm(`Permanently delete the inquiry from ${row.fullName}? This cannot be undone.`)) return
  try {
    await inquiryAdminService.remove(row.id)
    if (selected.value?.id === row.id) selected.value = null
    successMessage.value = 'Inquiry deleted'
    await load()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to delete inquiry'
  }
}

function exportCsv() {
  const blob = new Blob([inquiriesToCsv(rows.value)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `idrp-inquiries-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function goTo(newPage: number) {
  page.value = newPage
  load()
}

onMounted(load)
</script>

<template>
  <AdminLayout>
    <div class="space-y-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Admin Panel
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900">Inquiries</h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-600">
            Every submission from the website's forms: contact, partnerships, programme and course
            applications, event registrations, matchmaking and job applications.
          </p>
        </div>
        <button
          type="button"
          class="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          :disabled="rows.length === 0"
          @click="exportCsv"
        >
          Export this page (CSV)
        </button>
      </div>

      <section v-if="summary" class="grid gap-4 sm:grid-cols-4">
        <button
          v-for="card in [
            { label: 'New', value: summary.newCount, status: 'NEW' },
            { label: 'In progress', value: summary.inProgressCount, status: 'IN_PROGRESS' },
            { label: 'Resolved', value: summary.resolvedCount, status: 'RESOLVED' },
            { label: 'All inquiries', value: summary.total, status: '' },
          ]"
          :key="card.label"
          type="button"
          class="rounded-3xl bg-white p-5 text-left shadow-sm ring-1 transition"
          :class="filters.status === card.status ? 'ring-2 ring-[var(--color-primary)]' : 'ring-slate-200 hover:ring-slate-300'"
          @click="filters.status = card.status as InquiryStatus | ''"
        >
          <p class="text-sm font-medium text-slate-500">{{ card.label }}</p>
          <p class="mt-1 text-3xl font-bold text-slate-900">{{ card.value }}</p>
        </button>
      </section>

      <div v-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
        {{ successMessage }}
      </div>

      <div class="grid gap-8 xl:grid-cols-[1fr_440px]">
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div class="mb-5 grid gap-3 sm:grid-cols-3">
            <label class="text-sm">
              <span class="mb-1 block font-semibold text-slate-700">Status</span>
              <select v-model="filters.status" class="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm">
                <option value="">All statuses</option>
                <option v-for="status in statuses" :key="status" :value="status">{{ inquiryStatusLabels[status] }}</option>
              </select>
            </label>
            <label class="text-sm">
              <span class="mb-1 block font-semibold text-slate-700">Form</span>
              <select v-model="filters.formType" class="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm">
                <option value="">All forms</option>
                <option v-for="(label, key) in inquiryFormTypeLabels" :key="key" :value="key">{{ label }}</option>
              </select>
            </label>
            <label class="text-sm">
              <span class="mb-1 block font-semibold text-slate-700">Search</span>
              <input
                v-model="filters.search"
                type="search"
                placeholder="Name, e-mail or organisation"
                class="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <div v-if="loading && !result" class="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            Loading inquiries...
          </div>
          <div v-else-if="rows.length === 0" class="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            No inquiries match these filters.
          </div>
          <div v-else class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
              <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-4 py-3">Received</th>
                  <th class="px-4 py-3">From</th>
                  <th class="px-4 py-3">Form</th>
                  <th class="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr
                  v-for="row in rows"
                  :key="row.id"
                  class="cursor-pointer transition hover:bg-slate-50"
                  :class="selected?.id === row.id ? 'bg-[var(--color-primary-soft)]' : ''"
                  tabindex="0"
                  @click="open(row)"
                  @keydown.enter="open(row)"
                >
                  <td class="whitespace-nowrap px-4 py-3 text-slate-500">{{ formatDate(row.createdAt) }}</td>
                  <td class="px-4 py-3">
                    <p class="font-semibold text-slate-900">{{ row.fullName }}</p>
                    <p class="text-xs text-slate-500">{{ row.organization || row.email }}</p>
                  </td>
                  <td class="px-4 py-3 text-slate-700">{{ typeLabel(row.formType) }}</td>
                  <td class="px-4 py-3">
                    <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusBadge[row.status]">
                      {{ inquiryStatusLabels[row.status] }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              class="rounded-full border border-slate-200 px-4 py-2 font-semibold disabled:opacity-40"
              :disabled="page === 0"
              @click="goTo(page - 1)"
            >
              Previous
            </button>
            <span class="text-slate-500">Page {{ page + 1 }} of {{ totalPages }}</span>
            <button
              type="button"
              class="rounded-full border border-slate-200 px-4 py-2 font-semibold disabled:opacity-40"
              :disabled="page + 1 >= totalPages"
              @click="goTo(page + 1)"
            >
              Next
            </button>
          </div>
        </section>

        <aside class="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 xl:sticky xl:top-6">
          <p v-if="!selected" class="text-sm text-slate-500">Select an inquiry to see the full submission.</p>

          <div v-else class="space-y-5">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {{ typeLabel(selected.formType) }} · {{ formatDate(selected.createdAt) }}
              </p>
              <h2 class="mt-1 text-xl font-bold text-slate-900">{{ selected.fullName }}</h2>
              <p v-if="selected.organization" class="text-sm text-slate-600">{{ selected.organization }}</p>
            </div>

            <dl class="space-y-2 text-sm">
              <div>
                <dt class="font-semibold text-slate-700">E-mail</dt>
                <dd><a :href="`mailto:${selected.email}`" class="text-[var(--color-primary)] underline">{{ selected.email }}</a></dd>
              </div>
              <div v-if="selected.phone">
                <dt class="font-semibold text-slate-700">Phone</dt>
                <dd><a :href="`tel:${selected.phone}`" class="text-[var(--color-primary)] underline">{{ selected.phone }}</a></dd>
              </div>
              <div v-if="selected.message">
                <dt class="font-semibold text-slate-700">Message</dt>
                <dd class="whitespace-pre-line text-slate-700">{{ selected.message }}</dd>
              </div>
              <div v-for="field in extraFields" :key="field.key">
                <dt class="font-semibold text-slate-700">{{ field.key }}</dt>
                <dd class="whitespace-pre-line break-words text-slate-700">{{ field.value }}</dd>
              </div>
              <div>
                <dt class="font-semibold text-slate-700">Consent given</dt>
                <dd class="text-slate-700">{{ selected.consentGiven ? 'Yes' : 'No' }}</dd>
              </div>
            </dl>

            <div class="space-y-3 border-t border-slate-200 pt-5">
              <label class="block text-sm">
                <span class="mb-1 block font-semibold text-slate-700">Status</span>
                <select v-model="editStatus" class="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm">
                  <option v-for="status in statuses" :key="status" :value="status">{{ inquiryStatusLabels[status] }}</option>
                </select>
              </label>
              <label class="block text-sm">
                <span class="mb-1 block font-semibold text-slate-700">Internal notes</span>
                <textarea v-model="editNotes" rows="4" class="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm" />
              </label>
              <p v-if="selected.handledBy" class="text-xs text-slate-500">Last updated by {{ selected.handledBy }}</p>
              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  class="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                  :disabled="saving"
                  @click="save"
                >
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button
                  v-if="isSuperAdmin"
                  type="button"
                  class="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  @click="remove(selected)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </AdminLayout>
</template>
