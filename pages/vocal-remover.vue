<template>
  <SeparationPage
    page-slug="vocal-remover"
    job-variant="removal"
    :upload="vocalRemoverUpload"
    :advantage-icons="vocalRemoverAdvantageIcons"
  />
</template>

<script setup lang="ts">
import SeparationPage from '~/components/SeparationPage.vue'
import {
  vocalRemoverUpload,
  vocalRemoverAdvantageIcons
} from '~/config/vocalRemoverSeparation'

definePageMeta({
  layout: 'footerlink'
})
</script>
