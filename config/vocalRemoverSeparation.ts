import type { SeparationUploadConfig } from '~/types/separation'
import { ActionType } from '~/composables/actionReporter'
import {
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

export const vocalRemoverUpload: SeparationUploadConfig = {
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

export const vocalRemoverAdvantageIcons = [
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon
]
