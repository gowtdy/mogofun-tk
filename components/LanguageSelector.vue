<template>
  <div class="relative inline-block">
    <select v-model="locale" 
      @change="changeLanguage(locale)"
      class="appearance-none bg-white border border-gray-300 rounded px-3 pr-8 py-2 h-10 focus:ring-2 focus:ring-primary focus:border-primary min-w-[120px]">
      <option v-for="lang in LOCALES" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { config } from '~/config/config'
import { LOCALES } from '~/config/locales'

const { locale, availableLocales } = useI18n()
const route = useRoute()

async function changeLanguage(lang) {
  // 先获取当前路由的路径（去除语言前缀）
  let currentPath = route.fullPath
  const pathParts = currentPath.split('/').filter(Boolean)
  var newPath
  if (pathParts.length <= 1) {
    if (config.locales.includes(pathParts[0])) {
      newPath = lang === 'en' ? '/' : `/${lang}`
    } else if (pathParts[0]) {
      newPath = currentPath
    } else {
      // 如果没有值，使用新语言
      newPath = lang === 'en' ? '/' : `/${lang}`
    }
  } else {
    if (availableLocales.includes(pathParts[0])) {
      // 如果第一部分是语言，直接替换
      newPath = currentPath.replace(pathParts[0], lang)
    } else {
      // 如果第一部分不是语言，保留原值并在前面添加新语言（除非是英语）
      newPath =  currentPath
    }
  }
  window.location.href = newPath
}
</script>
