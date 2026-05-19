import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import {
  getPresetDescriptionForPageKey,
  getPromptExamplesForPageKey,
  type SoundEffectPromptExample,
} from '~/config/soundEffectPromptConfig'

export function useSoundEffectPrompts(pageKey: MaybeRefOrGetter<string>) {
  const promptExamples = computed<SoundEffectPromptExample[]>(() =>
    getPromptExamplesForPageKey(toValue(pageKey)),
  )

  const presetDescription = computed(() =>
    getPresetDescriptionForPageKey(toValue(pageKey)),
  )

  return {
    promptExamples,
    presetDescription,
  }
}
