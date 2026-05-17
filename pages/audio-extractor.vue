<template>
  <SeparationPage
    page-slug="audio-extractor"
    job-variant="extraction"
    :upload="audioExtractorUpload"
    :advantage-icons="audioExtractorAdvantageIcons"
  />
</template>

<script setup lang="ts">
import SeparationPage from '~/components/SeparationPage.vue'
import {
  audioExtractorUpload,
  audioExtractorAdvantageIcons
} from '~/config/audioExtractorSeparation'

definePageMeta({
  layout: 'footerlink'
})
</script>
