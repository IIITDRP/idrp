<template>
  <div class="mentors-view bg-white">
    <MentorsHeroSection />

    <MentorsSearchSection :search-query="searchQuery" @update:searchQuery="searchQuery = $event" />

    <MentorsGridSection :mentors="filteredMentors" />

    <MentorsCTASection />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { allMentors as staticMentors } from '@/data/mentors'
import { loadMentors, useRemoteContent } from '@/services/contentService'

import MentorsGridSection from '@/components/mentors/MentorsGridSection.vue'
import MentorsSearchSection from '@/components/mentors/MentorsSearchSection.vue'
import MentorsHeroSection from '@/components/mentors/MentorsHeroSection.vue'
import MentorsCTASection from '@/components/mentors/MentorsCTASection.vue'

const searchQuery = ref('')
const allMentors = useRemoteContent('mentors', staticMentors, loadMentors)

const filteredMentors = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return allMentors.value

  return allMentors.value.filter((mentor) => {
    return [mentor.name, mentor.role, mentor.organization ?? '', mentor.bio ?? '']
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})
</script>
