import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useFAQs(itemsKey: string = 'faqs.items') {
  const { tm, t } = useI18n()
  
  const faqs = computed(() => {
    // 先拿到原始数组，目的是获取长度
    const raw = tm(itemsKey) || []
    // 确保 raw 是数组
    const items = Array.isArray(raw) ? raw : []
    // 用 t 获取每一项的字符串
    return items.map((_, idx) => ({
      question: t(`${itemsKey}.${idx}.question`),
      answer: t(`${itemsKey}.${idx}.answer`)
    }))
  })

  return {
    faqs
  }
} 