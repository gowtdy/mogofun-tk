<template>
  <SeparationPage
    page-slug="vocal-isolator"
    :upload="vocalIsolatorUpload"
    :advantage-icons="vocalIsolatorAdvantageIcons"
  />
</template>

<script setup lang="ts">
import SeparationPage, { type SeparationUploadConfig } from '~/components/SeparationPage.vue'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import {
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BeakerIcon
} from '@heroicons/vue/24/outline'

const vocalIsolatorUpload: SeparationUploadConfig = {
  mediaType: 'vocal isolator',
  modelCategory: 'vocal isolator',
  modelName: '',
  apiEndpoint: '/coverapi/vocal',
  actionType: {
    extract: ActionType.VOCAL_EXTRACT,
    login: ActionType.VOCAL_EXTRACT_LOGIN,
    subscript: ActionType.VOCAL_EXTRACT_SUBSCRIPT,
    download: ActionType.VOCAL_DOWNLOAD,
    downloadLogin: ActionType.VOCAL_DOWNLOAD_LOGIN,
    downloadSubscript: ActionType.VOCAL_DOWNLOAD_SUBSCRIPT,
    upload: ActionType.VOCAL_EXTRACT_UPLOAD
  }
}

const vocalIsolatorAdvantageIcons = [
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BeakerIcon
]
</script>
