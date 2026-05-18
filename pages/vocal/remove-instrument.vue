<template>
  <SeparationPage
    page-slug="remove-instrument"
    common-page-slug="vocal-isolator"
    :upload="vocalIsolatorUpload"
    :advantage-icons="vocalIsolatorAdvantageIcons"
  />
</template>

<script setup lang="ts">
import SeparationPage from '~/components/SeparationPage.vue'
import {
  vocalIsolatorUpload,
  vocalIsolatorAdvantageIcons
} from '~/config/vocalIsolatorSeparation'
</script>
