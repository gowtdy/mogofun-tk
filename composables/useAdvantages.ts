import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

export function useAdvantages(itemsKey: string = 'advantages.items') {
  const { tm } = useI18n()
  
  const advantages = computed(() => {
    const advantagesItems = tm(itemsKey) || []
    // 确保 advantagesItems 是数组
    const items = Array.isArray(advantagesItems) ? advantagesItems : []
    const icons = [
      SparklesIcon,          // 专业品质
      MusicalNoteIcon,       // 丰富音色库
      CpuChipIcon,          // AI快速生成
      AdjustmentsHorizontalIcon,  // 多种音乐风格
      ArrowDownTrayIcon,     // 高质量输出
      WrenchScrewdriverIcon, // 高级调整工具
      UserGroupIcon,         // AI合唱和二重唱
      BeakerIcon            // 自定义声音训练
    ]
    return items.map((item, index) => ({
      ...item,
      icon: icons[index] || SparklesIcon // 提供一个默认图标，以防数组越界
    }))
  })

  return {
    advantages
  }
} 