<template>
  <SeparationPage
    page-slug="vocal-remover"
    job-variant="removal"
    :upload="vocalRemoverUpload"
    :advantage-icons="vocalRemoverAdvantageIcons"
  />
</template>

<script setup lang="ts">
import SeparationPage, { type SeparationUploadConfig } from '~/components/SeparationPage.vue'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import {
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'footerlink'
})

const vocalRemoverUpload: SeparationUploadConfig = {
  mediaType: 'audio',
  modelCategory: 'vocal remover',
  modelName: 'vocal remover',
  apiEndpoint: '/coverapi/instrument',
  actionType: {
    extract: ActionType.VOCAL_REMOVE,
    login: ActionType.VOCAL_REMOVE_LOGIN,
    subscript: ActionType.VOCAL_REMOVE_SUBSCRIPT,
    download: ActionType.VOCAL_REMOVE_DOWNLOAD,
    downloadLogin: ActionType.VOCAL_REMOVE_DOWNLOAD_LOGIN,
    downloadSubscript: ActionType.VOCAL_REMOVE_DOWNLOAD_SUBSCRIPT,
    upload: ActionType.VOCAL_REMOVE_UPLOAD
  }
}

const vocalRemoverAdvantageIcons = [
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon
]
</script>
