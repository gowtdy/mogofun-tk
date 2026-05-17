import type { SeparationUploadConfig } from '~/types/separation'
import { ActionType } from '~/composables/actionReporter'
import {
  SparklesIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

export const audioExtractorUpload: SeparationUploadConfig = {
  mediaType: 'video',
  modelCategory: 'audio extractor',
  modelName: 'audio extractor',
  apiEndpoint: '/upapi/extractaudio',
  actionType: {
    extract: ActionType.AUDIO_EXTRACT,
    login: ActionType.AUDIO_EXTRACT_LOGIN,
    subscript: ActionType.AUDIO_EXTRACT_SUBSCRIPT,
    download: ActionType.AUDIO_DOWNLOAD,
    downloadLogin: ActionType.AUDIO_DOWNLOAD_LOGIN,
    downloadSubscript: ActionType.AUDIO_DOWNLOAD_SUBSCRIPT,
    upload: ActionType.AUDIO_EXTRACT_UPLOAD
  }
}

export const audioExtractorAdvantageIcons = [
  SparklesIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
]
