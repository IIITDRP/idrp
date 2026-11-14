<template>
  <div class="home-view">
    <HeroSection :hero-slides="heroSlides" />
    <ImpactSection :stats="statsData" />
    <ProgramsSection :programs="programCatalog" :government-programs="governmentPrograms" />
    <CourseSection :courses="courses" />
    <ServicesSection :services="services" />
    <ApproachSection :approaches="approaches" />
    <SuccessStoriesSection :success-stories="successStories" />
    <PartnersSection :partner-categories="partnerCategories" :all-partners="allPartners" />
    <AwardsSection :awards="awards" />
    <CTASection />
  </div>
</template>

<script setup lang="ts">
import {
  heroSlides,
  governmentPrograms,
  courses,
  services,
  approaches,
  successStories,
  partnerCategories,
  awards,
  stats as staticStats,
} from '@/data/home'
import { computed } from 'vue'
import { partnerCategories as staticPartnerCategories } from '@/data/partners'
import {
  loadImpactStats,
  loadPartnerCategories,
  useRemoteContent,
} from '@/services/contentService'

import ProgramsSection from '@/components/home/ProgramsSection.vue'
import PartnersSection from '@/components/home/PartnersSection.vue'
import CourseSection from '@/components/home/CourseSection.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'
import ApproachSection from '@/components/home/ApproachSection.vue'
import ImpactSection from '@/components/home/ImpactSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection.vue'
import AwardsSection from '@/components/home/AwardsSection.vue'
import CTASection from '@/components/home/CTASection.vue'
import { programCatalog } from '@/data/programCatalog'

const statsData = useRemoteContent('impact-stats', staticStats, loadImpactStats(staticStats))
const liveCategories = useRemoteContent(
  'partner-categories',
  staticPartnerCategories,
  loadPartnerCategories(staticPartnerCategories),
)
const allPartners = computed(() => liveCategories.value.flatMap((category) => category.partners))

</script>
