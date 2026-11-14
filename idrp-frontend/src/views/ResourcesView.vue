<template>
  <div class="resources-view">
    <ResourcesHeroSection />
    <NewsletterBookshelfSection :newsletters="newsletters" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { newsletters as staticNewsletters, getVisibleNewsletters } from '@/data/newsletters'
import { loadNewsletters, useRemoteContent } from '@/services/contentService'

const allNewsletters = useRemoteContent('newsletters', staticNewsletters, loadNewsletters(staticNewsletters))
const newsletters = computed(() => getVisibleNewsletters(allNewsletters.value))
import NewsletterBookshelfSection from '@/components/resources/NewsletterBookshelfSection.vue'
import ResourcesHeroSection from '@/components/resources/ResourcesHeroSection.vue'
</script>
