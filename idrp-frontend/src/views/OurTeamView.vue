<template>
  <div class="our-team-view">
    <TeamHeroSection v-bind="teamHero" />
    <TeamGridSection :members="teamMembers" />
    <TeamCTASection v-bind="teamCTA" />
  </div>
</template>

<script setup lang="ts">
import TeamHeroSection from '@/components/team/TeamHeroSection.vue'
import TeamGridSection from '@/components/team/TeamGridSection.vue'
import TeamCTASection from '@/components/team/TeamCTASection.vue'

import { teamMembers as staticTeamMembers, teamHero, teamCTA } from '@/data/team'
import { loadTeamMembers, useRemoteContent } from '@/services/contentService'

const teamMembers = useRemoteContent('team-members', staticTeamMembers, loadTeamMembers)
</script>
