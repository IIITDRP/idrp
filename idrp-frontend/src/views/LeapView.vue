<script setup lang="ts">
import ProgramHeroSection from '@/components/program/ProgramHeroSection.vue'
import ProgramIntroSection from '@/components/program/ProgramIntroSection.vue'
import ProgramValueSection from '@/components/program/ProgramValueSection.vue'
import ProgramCTASection from '@/components/program/ProgramCTASection.vue'

import LeapInstitutionsSection from '@/components/program/LeapInstitutionsSection.vue'

import { leapPage, leapInstitutions } from '@/data/leap'
</script>

<template>
  <div class="leap-view">
    <ProgramHeroSection v-bind="leapPage.hero" />
    <ProgramIntroSection v-bind="leapPage.intro" />
    <ProgramValueSection v-bind="leapPage.value" />

    <LeapInstitutionsSection :institutions="leapInstitutions" />

    <ProgramCTASection v-bind="leapPage.cta" />
  </div>
</template>
