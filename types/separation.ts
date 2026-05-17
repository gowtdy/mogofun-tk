import type { ActionType } from '~/composables/actionReporter'

export interface SeparationUploadConfig {
  mediaType: string
  modelCategory: string
  modelName: string
  apiEndpoint: string
  actionType: Record<string, ActionType>
}
