<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import {
  impactNumberAdminService,
  type ImpactNumber,
  type ImpactNumberPayload,
} from '@/services/impactNumberAdminService'

const items = ref<ImpactNumber[]>([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editingId = ref<number | null>(null)

const form = reactive<ImpactNumberPayload>({ value: '', label: '', displayOrder: 1, visible: true })

function resetForm() {
  editingId.value = null
  form.value = ''
  form.label = ''
  form.displayOrder = items.value.length + 1
  form.visible = true
}

function edit(item: ImpactNumber) {
  editingId.value = item.id
  form.value = item.value
  form.label = item.label
  form.displayOrder = item.displayOrder ?? 0
  form.visible = item.visible !== false
  successMessage.value = ''
}

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    items.value = await impactNumberAdminService.getAll()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load counters'
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!form.value.trim() || !form.label.trim()) {
    errorMessage.value = 'Value and label are required'
    return
  }
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  const payload = { ...form, value: form.value.trim(), label: form.label.trim(), displayOrder: Number(form.displayOrder) || 0 }
  try {
    if (editingId.value) {
      await impactNumberAdminService.update(editingId.value, payload)
      successMessage.value = 'Counter updated'
    } else {
      await impactNumberAdminService.create(payload)
      successMessage.value = 'Counter added'
    }
    await load()
    resetForm()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save counter'
  } finally {
    saving.value = false
  }
}

async function remove(item: ImpactNumber) {
  if (!window.confirm(`Delete the "${item.label}" counter?`)) return
  try {
    await impactNumberAdminService.remove(item.id)
    successMessage.value = 'Counter deleted'
    await load()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to delete counter'
  }
}

onMounted(async () => {
  await load()
  resetForm()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-8">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Admin Panel</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">Home Counters</h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-600">
          The animated impact numbers on the home page. Write the value as it should read, e.g.
          <strong>60+</strong>, <strong>₹2 Cr</strong> or <strong>120</strong>; the number part is animated.
        </p>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
        {{ successMessage }}
      </div>

      <div class="grid gap-8 xl:grid-cols-[1fr_400px]">
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div v-if="loading" class="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">Loading...</div>
          <div v-else-if="items.length === 0" class="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            No counters yet. The home page shows its built-in numbers until you add some.
          </div>
          <table v-else class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3">Order</th>
                <th class="px-4 py-3">Value</th>
                <th class="px-4 py-3">Label</th>
                <th class="px-4 py-3">Shown</th>
                <th class="px-4 py-3"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in items" :key="item.id">
                <td class="px-4 py-3 text-slate-500">{{ item.displayOrder }}</td>
                <td class="px-4 py-3 font-bold text-slate-900">{{ item.value }}</td>
                <td class="px-4 py-3 text-slate-700">{{ item.label }}</td>
                <td class="px-4 py-3">{{ item.visible ? 'Yes' : 'Hidden' }}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right">
                  <button type="button" class="font-semibold text-[var(--color-primary)]" @click="edit(item)">Edit</button>
                  <button type="button" class="ml-4 font-semibold text-red-600" @click="remove(item)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <form class="h-fit space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200" @submit.prevent="save">
          <h2 class="text-xl font-bold text-slate-900">{{ editingId ? 'Edit counter' : 'Add counter' }}</h2>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold text-slate-700">Value</span>
            <input v-model="form.value" required maxlength="30" placeholder="60+" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold text-slate-700">Label</span>
            <input v-model="form.label" required maxlength="150" placeholder="Number of Startups" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold text-slate-700">Display order</span>
            <input v-model.number="form.displayOrder" type="number" min="0" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input v-model="form.visible" type="checkbox" />
            Show on the home page
          </label>
          <div class="flex gap-3">
            <button type="submit" :disabled="saving" class="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {{ saving ? 'Saving...' : editingId ? 'Update' : 'Add' }}
            </button>
            <button v-if="editingId" type="button" class="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold" @click="resetForm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>
