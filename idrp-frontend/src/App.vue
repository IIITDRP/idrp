<template>
  <AppLayout />
  <ConsentBanner />
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import ConsentBanner from '@/components/common/ConsentBanner.vue'
import { initAnalytics } from '@/services/analyticsConsent'

initAnalytics()
</script>
