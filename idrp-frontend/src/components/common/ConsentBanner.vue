<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { consentBannerOpen, consentChoice, setConsent } from '@/services/analyticsConsent'

const route = useRoute()
const visible = computed(() => consentBannerOpen.value && !route.path.startsWith('/admin'))
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="translate-y-4 opacity-0"
  >
    <section
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4"
      role="region"
      aria-label="Analytics consent"
    >
      <div
        class="mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-2xl sm:flex-row sm:items-center sm:gap-6 sm:p-6"
      >
        <p class="leading-6">
          We would like to use Microsoft Clarity to understand how visitors use this site. It
          records how pages are used (clicks, scrolling and page views) and only runs if you agree.
          The site works the same either way.
          <RouterLink to="/privacy-policy" class="font-semibold text-[var(--color-primary)] underline">
            Privacy policy</RouterLink
          >.
          <span v-if="consentChoice" class="block text-xs text-slate-500">
            Current choice: {{ consentChoice === 'granted' ? 'allowed' : 'not allowed' }}.
          </span>
        </p>
        <div class="flex shrink-0 gap-3">
          <button
            type="button"
            class="min-h-[44px] flex-1 rounded-full border border-slate-300 px-5 font-semibold text-slate-800 transition hover:bg-slate-50 sm:flex-none"
            @click="setConsent('denied')"
          >
            Decline
          </button>
          <button
            type="button"
            class="min-h-[44px] flex-1 rounded-full bg-[var(--color-primary)] px-5 font-semibold text-white transition hover:bg-[var(--color-primary-dark)] sm:flex-none"
            @click="setConsent('granted')"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </section>
  </transition>
</template>
