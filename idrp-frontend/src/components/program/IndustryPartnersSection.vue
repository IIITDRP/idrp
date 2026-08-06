<script setup lang="ts">
import { computed, ref, watch } from "vue"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue"

import SectionHeading from "@/components/common/SectionHeading.vue"
import { cifIndustries, type CifIndustry } from "@/data/cifIndustries"

/* ---------------------------------- */
/* Categories */
/* ---------------------------------- */

const selectedCategory = ref("All")

const categories = computed(() => {
  const unique = [...new Set(cifIndustries.map(i => i.category))]
  return ["All", ...unique.sort()]
})

/* ---------------------------------- */
/* Filtering */
/* ---------------------------------- */

const filteredIndustries = computed(() => {
  if (selectedCategory.value === "All") {
    return cifIndustries
  }

  return cifIndustries.filter(
    (industry) => industry.category === selectedCategory.value
  )
})

/* ---------------------------------- */
/* Show More */
/* ---------------------------------- */

const visibleCount = ref(8)

const visibleIndustries = computed(() =>
  filteredIndustries.value.slice(0, visibleCount.value)
)

function showMore() {
  visibleCount.value = Math.min(
    visibleCount.value + 8,
    filteredIndustries.value.length
  )
}

function showLess() {
  visibleCount.value = 8
}

/* Reset cards whenever category changes */

watch(selectedCategory, () => {
  visibleCount.value = 8
})

/* ---------------------------------- */
/* Modal */
/* ---------------------------------- */

const selectedIndustry = ref<CifIndustry | null>(null)

function openIndustry(industry: CifIndustry) {
  selectedIndustry.value = industry
}

function closeModal() {
  selectedIndustry.value = null
}
</script>

<template>
  <section class="bg-slate-50 px-6 py-16 md:px-16 md:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl">

      <SectionHeading
        title="Industry Partners"
        class="mb-8"
      />

      <p
        class="mx-auto mb-10 max-w-3xl text-center text-slate-600"
      >
        Explore our network of industry partners working across
        manufacturing, engineering, automation, foundries,
        tooling, valves, interiors, and many other sectors.
      </p>

      <!-- Categories -->

      <div class="mb-10 flex flex-wrap justify-center gap-3"
       role="group"
       aria-label="Industry categories"
      >
        <button
          type="button"
          v-for="category in categories"
          :aria-pressed="selectedCategory === category"
          :key="category"
          @click="selectedCategory = category"
          class="cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition"
          :class="
            selectedCategory === category
              ? 'border-brand btn-brand text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
          "
        >
          {{ category }}
        </button>

      </div>

      <!-- Cards -->

      <div
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >

        <button
        v-for="industry in visibleIndustries"
        :key="industry.id"
        type="button"
        @click="openIndustry(industry)"
        class="flex cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        > 

          <div
            class="mb-3 inline-flex w-fit rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"
          >
            {{ industry.category }}
          </div>

          <h3
            class="text-lg font-bold text-slate-900"
          >
            {{ industry.name }}
          </h3>

          <p
            class="mt-4 line-clamp-3 text-sm leading-6 text-slate-600"
          >
            {{ industry.manufacturingFocus }}
          </p>

          <span class="mt-auto pt-6 font-semibold text-[var(--color-primary)]">
            Click to view →
        </span>

        </button>

      </div>

      <!-- Buttons -->

      <div
        class="mt-12 flex justify-center gap-4"
      >

        <button
          v-if="visibleCount < filteredIndustries.length"
          type="button"
          @click="showMore"
          class="btn-brand cursor-pointer rounded-xl px-6 py-3 font-medium"
        >
          Show More
        </button>

        <button
          v-if="visibleCount > 8"
          type="button"
          @click="showLess"
          class="cursor-pointer rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
        >
          Show Less
        </button>

      </div>

    </div>
  </section>
<TransitionRoot appear :show="selectedIndustry !== null" as="template">
  <Dialog
    as="div"
    class="relative z-50"
    @close="closeModal"
  >

    <!-- Backdrop -->

    <TransitionChild
      as="template"
      enter="ease-out duration-300"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="ease-in duration-200"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div class="fixed inset-0 bg-black/50" />
    </TransitionChild>

    <!-- Modal -->

    <div class="fixed inset-0 overflow-y-auto">
      <div
        class="flex min-h-full items-center justify-center p-4"
      >

        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >

          <DialogPanel
            class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          >

            <div
              class="mb-5 inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-1 text-sm font-semibold text-[var(--color-primary)]"
            >
              {{ selectedIndustry?.category }}
            </div>

            <DialogTitle
              class="text-3xl font-bold text-slate-900"
            >
              {{ selectedIndustry?.name }}
            </DialogTitle>

            <div class="mt-8">

              <h3
                class="mb-3 text-lg font-semibold text-slate-900"
              >
                Manufacturing Focus
              </h3>

              <p
                class="leading-7 text-slate-600"
              >
                {{ selectedIndustry?.manufacturingFocus }}
              </p>

            </div>

            <div class="mt-10">

              <h3
                class="mb-4 text-lg font-semibold text-slate-900"
              >
                Common Machinery
              </h3>

              <div
                class="grid gap-3 md:grid-cols-2"
              >

                <div
                  v-for="machine in selectedIndustry?.commonMachinery"
                  :key="machine"
                  class="flex items-start gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <span
                    class="mt-0.5 text-green-600"
                  >
                    ✓
                  </span>

                  <span
                    class="text-sm text-slate-700"
                  >
                    {{ machine }}
                  </span>
                </div>

              </div>

            </div>

            <div
              class="mt-10 flex justify-end"
            >

              <button
                type="button"
                @click="closeModal"
                class="btn-brand rounded-xl px-6 py-3 font-medium"
              >
                Close
              </button>

            </div>

          </DialogPanel>

        </TransitionChild>

      </div>
    </div>

  </Dialog>
</TransitionRoot>
</template>
