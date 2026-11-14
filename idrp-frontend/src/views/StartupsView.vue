<template>
  <div class="startups-view">
    <StartupsHeroSection
      :image-src="startupsHero.imageSrc"
      :image-alt="startupsHero.imageAlt"
      :eyebrow="startupsHero.eyebrow"
      :title="startupsHero.title"
      :description="startupsHero.description"
    />

    <StartupsIntroSection
      :stats="stats"
      :eyebrow="startupsIntro.eyebrow"
      :title="startupsIntro.title"
      :paragraphs="startupsIntro.paragraphs"
      :image-src="startupsIntro.imageSrc"
      :image-alt="startupsIntro.imageAlt"
    />

    <StartupsPortfolioSection :startups="startups" />

    <StartupsCTASection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  buildStartupStats,
  startups as staticStartups,
  startupsHero,
  startupsIntro,
} from '@/data/startups'
import { loadStartups, useRemoteContent } from '@/services/contentService'

import StartupsPortfolioSection from '@/components/startups/StartupsPortfolioSection.vue'
import StartupsHeroSection from '@/components/startups/StartupsHeroSection.vue'
import StartupsIntroSection from '@/components/startups/StartupsIntroSection.vue'
import StartupsCTASection from '@/components/startups/StartupsCTASection.vue'

const startups = useRemoteContent('startups', staticStartups, loadStartups)
const stats = computed(() => buildStartupStats(startups.value))
</script>
