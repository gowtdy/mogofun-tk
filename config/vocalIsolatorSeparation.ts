import type { SeparationUploadConfig } from '~/components/SeparationPage.vue'
import { ActionType } from '~/composables/actionReporter'
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

export const vocalIsolatorUpload: SeparationUploadConfig = {
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

export const vocalIsolatorAdvantageIcons = [
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BeakerIcon
]
