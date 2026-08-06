<template>
  <AppLayout />
  <Analytics/>
  <SpeedInsights />
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>
