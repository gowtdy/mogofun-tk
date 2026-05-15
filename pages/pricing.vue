<template>
  <div class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <!-- Header section with improved styling -->
      <div class="text-center mb-12 sm:mb-16">
        <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4" v-text="$t('pricing.title')" />
      </div>

      <!-- Improved toggle button for period selection -->
      <div class="flex justify-center mb-16">
        <div class="max-w-md w-full flex justify-center relative">
          <div class="bg-white p-1.5 rounded-full flex items-center shadow-lg border border-slate-100">
            <button 
              @click="isYearly = false" 
              :class="[
                'w-[150px] rounded-full text-sm transition-all duration-300 py-3 font-bold',
                !isYearly ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
              ]"
              v-text="$t('pricing.period.monthly')"
            />
            <div class="w-[150px]">
              <button 
                @click="isYearly = true" 
                class="relative w-full font-bold"
                :class="[
                  'rounded-full text-sm transition-all duration-300',
                  isYearly ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                ]"
              >
                <div class="py-1.5">{{ $t('pricing.period.annually') }}</div>
                <div 
                  :class="[
                    isYearly ? 'text-white' : 'text-[#FF3B3B]',
                    'text-xs font-bold pb-1'
                  ]"
                  v-text="$t('pricing.period.save')"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Completely restructured pricing cards with dedicated containers for each card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto">
        <!-- starter plan card in completely independent container -->
        <div class="relative z-10 rounded-2xl overflow-hidden">
          <div v-if="(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter'))" 
               class="rounded-2xl pricing-card shadow-xl hover:shadow-2xl transition-all duration-300 relative">
            <div class="h-full border border-indigo-100 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
              <!-- Background pattern for visual interest -->
              <div class="absolute -right-12 -top-12 w-44 h-44 bg-indigo-100 opacity-50 rounded-full"></div>
              
              <div class="relative">
                <h2 class="text-xl sm:text-2xl font-extrabold mb-4 text-indigo-700">{{ (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).name }}</h2>
                <div class="text-3xl sm:text-5xl font-black mb-2 sm:mb-3 flex items-baseline justify-center">
                  <!-- span class="text-xl text-slate-400 line-through font-semibold mr-2">${{ (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).origPrice }}</span -->
                  <span class="text-indigo-900">${{ !isYearly && (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).firstMonthPrice !== undefined ? (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).firstMonthPrice : (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).price }}</span>
                  <span class="text-base text-slate-500 font-medium ml-2">{{ $t('pricing.plans.starter.period') }}</span>
                </div>
                <div class="text-sm text-slate-500 mb-8 font-medium text-center">
                  {{ !isYearly && (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).firstMonthPrice !== undefined ? `${$t('pricing.renew')} $${(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).price}${$t('pricing.plans.starter.period')} ${$t('pricing.after')}` : `$${(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).totalprice} ${$t('pricing.yearbilled')}` }}
                </div>
                <button 
                  class="w-full mb-8 py-3.5 text-base font-bold rounded-xl transition-all hover:translate-y-[-2px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg relative" 
                  @click="handleButtonClick((isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).type_name)"
                  :disabled="loadingStarter"
                  :class="{'opacity-75': loadingStarter}"
                >
                  <span v-if="!loadingStarter">{{ $t('pricing.cta') }}</span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ $t('pricing.loading') }}
                  </span>
                </button>
                <div class="border-t border-indigo-100 pt-6 mb-4">
                  <ul class="space-y-4">
                    <li class="flex items-start gap-3" v-for="(feature, index) in (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('starter')).features" :key="index">
                      <span class="text-indigo-500 text-lg flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </span>
                      <span class="text-slate-700">{{ rt(feature) }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- advance plan card in completely independent container -->
        <div class="relative z-10 rounded-2xl overflow-hidden lg:transform lg:translate-y-[-8px] lg:scale-[1.02]">
          <div v-if="(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance'))">
            <div class="rounded-2xl pricing-card shadow-xl hover:shadow-2xl transition-all duration-300 relative">
              <div class="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-2xl p-[2px]">
                <div class="h-full bg-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                  <!-- Background pattern for visual interest -->
                  <div class="absolute -right-12 -top-12 w-44 h-44 bg-gradient-to-tl from-pink-50 to-purple-50 rounded-full"></div>
                  <!-- Popular badge -->
                  <div class="absolute right-6 top-6 bg-gradient-to-r from-amber-400 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {{ $t('pricing.popular') }}
                  </div>
                  <div class="relative">
                    <h2 class="text-xl sm:text-2xl font-extrabold mb-4 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">{{ (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).name }}</h2>
                    <div class="text-3xl sm:text-5xl font-black mb-2 sm:mb-3 flex items-baseline justify-center">
                      <!-- span class="text-xl text-slate-400 line-through font-semibold mr-2">${{ (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).origPrice }}</span -->
                      <span class="text-slate-900">${{ !isYearly && (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).firstMonthPrice !== undefined ? (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).firstMonthPrice : (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).price }}</span>
                      <span class="text-base text-slate-500 font-medium ml-2 whitespace-nowrap">{{ $t('pricing.plans.advance.period') }}</span>
                    </div>
                    <div class="text-sm text-slate-500 mb-8 font-medium text-center">
                      {{ !isYearly && (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).firstMonthPrice !== undefined ? `${$t('pricing.renew')} $${(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).price}${$t('pricing.plans.advance.period')} ${$t('pricing.after')}` : `$${(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).totalprice} ${$t('pricing.yearbilled')}` }}
                    </div>
                    <button 
                      class="w-full mb-8 py-3.5 text-base font-bold rounded-xl transition-all hover:translate-y-[-2px] bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white shadow-lg relative" 
                      @click="handleButtonClick((isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).type_name)"
                      :disabled="loadingAdvance"
                      :class="{'opacity-75': loadingAdvance}"
                    >
                      <span v-if="!loadingAdvance">{{ $t('pricing.cta') }}</span>
                      <span v-else class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ $t('pricing.loading') }}
                      </span>
                    </button>
                    <div class="border-t border-slate-100 pt-6 mb-4">
                      <ul class="space-y-4">
                        <li class="flex items-start gap-3" v-for="(feature, index) in (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('advance')).features" :key="index">
                          <span class="text-amber-500 text-lg flex-shrink-0 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          </span>
                          <span class="text-slate-700">{{ rt(feature) }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pro plan card in completely independent container -->
        <div class="relative z-10 rounded-2xl overflow-hidden">
          <div v-if="(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro'))" 
               class="rounded-2xl pricing-card shadow-xl hover:shadow-2xl transition-all duration-300 relative">
            <div class="h-full border border-indigo-100 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
              <!-- Background pattern for visual interest -->
              <div class="absolute -right-12 -top-12 w-44 h-44 bg-indigo-100 opacity-50 rounded-full"></div>
              
              <div class="relative">
                <h2 class="text-xl sm:text-2xl font-extrabold mb-4 text-indigo-700">{{ (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).name }}</h2>
                <div class="text-3xl sm:text-5xl font-black mb-2 sm:mb-3 flex items-baseline justify-center">
                  <!-- span class="text-xl text-slate-400 line-through font-semibold mr-2">${{ (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).origPrice }}</span -->
                  <span class="text-indigo-900">${{ !isYearly && (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).firstMonthPrice !== undefined ? (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).firstMonthPrice : (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).price }}</span>
                  <span class="text-base text-slate-500 font-medium ml-2">{{ $t('pricing.plans.pro.period') }}</span>
                </div>
                <div class="text-sm text-slate-500 mb-8 font-medium text-center">
                  {{ !isYearly && (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).firstMonthPrice !== undefined ? `${$t('pricing.renew')} $${(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).price}${$t('pricing.plans.pro.period')} ${$t('pricing.after')}` : `$${(isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).totalprice} ${$t('pricing.yearbilled')}` }}
                </div>
                <button 
                  class="w-full mb-8 py-3.5 text-base font-bold rounded-xl transition-all hover:translate-y-[-2px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg relative" 
                  @click="handleButtonClick((isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).type_name)"
                  :disabled="loadingPro"
                  :class="{'opacity-75': loadingPro}"
                >
                  <span v-if="!loadingPro">{{ $t('pricing.cta') }}</span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ $t('pricing.loading') }}
                  </span>
                </button>
                <div class="border-t border-indigo-100 pt-6 mb-4">
                  <ul class="space-y-4">
                    <li class="flex items-start gap-3" v-for="(feature, index) in (isYearly ? yearlyPlans : monthlyPlans).find(p => p.type_name.includes('pro')).features" :key="index">
                      <span class="text-indigo-500 text-lg flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </span>
                      <span class="text-slate-700">{{ rt(feature) }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 登录弹窗组件 -->
      <LoginModal :showModal="showLogin" @loginSuccess="handleLoginSuccess" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watchEffect, onErrorCaptured, onMounted, onUnmounted, onActivated, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { config } from '~/config/config'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '~/store/user'
  import { useAuth } from '~/composables/useAuth'
  import { useErrorReporter } from '~/composables/errorReporter'
  import { usePageErrorHandler } from '~/composables/usePageErrorHandler'
  import { useCharacterSeoMeta } from '~/composables/useCharacterSeoMeta'
  import { useActionReporter,ActionType } from '~/composables/actionReporter'
  import LoginModal from '@/components/LoginModal.vue'

const isYearly = ref(true)
const showLogin = ref(false)
const loadingStarter = ref(false)
const loadingAdvance = ref(false)
const loadingPro = ref(false)
const loadingFree = ref(false)
const { t, tm, rt, locale } = useI18n()
const host = config.host
const domain = config.domain

// 使用 tm 方法获取数组类型的翻译内容
const proFeatures = computed(() => tm('pricing.plans.pro.features.items') || [])
const advanceFeatures = computed(() => tm('pricing.plans.advance.features.items') || [])
const starterFeatures = computed(() => tm('pricing.plans.starter.features.items') || [])
const freeFeatures = computed(() => tm('pricing.plans.free.features.items') || [])

const monthlyPlans = computed(() => [
  {
    name: t('pricing.plans.starter.name'),
    firstMonthPrice: 4.99,
    price: 7.99,
    origPrice: 12.99,
    isPopular: false,
    type_name: 'starter_month',
    features: starterFeatures.value
  },
  {
    name: t('pricing.plans.advance.name'),
    firstMonthPrice: 9.99,
    price: 12.99,
    origPrice: 18.99,
    isPopular: true,
    type_name: 'advance_month',
    features: advanceFeatures.value
  },
  {
    name: t('pricing.plans.pro.name'),
    firstMonthPrice: 18.99,
    price: 21.99,
    origPrice: 24.99,
    isPopular: true,
    type_name: 'pro_month',
    features: proFeatures.value
  }
])

const yearlyPlans = computed(() => [
  {
    name: t('pricing.plans.free.name'),
    price: 0,
    isPopular: false,
    type_name: 'free_year',
    features: freeFeatures.value
  },
  {
    name: t('pricing.plans.starter.name'),
    price: 4.9,
    totalprice: 58.8,
    origPrice: 71.88,
    isPopular: false,
    type_name: 'starter_year',
    features: starterFeatures.value
  },
  {
    name: t('pricing.plans.advance.name'),
    price: 8.9,
    totalprice: 106.8,
    origPrice: 155.88,
    isPopular: true,
    type_name: 'advance_year',
    features: advanceFeatures.value
  },
  {
    name: t('pricing.plans.pro.name'),
    price: 12.9,
    totalprice: 154.8,
    origPrice: 263.88,
    isPopular: true,
    type_name: 'pro_year',
    features: proFeatures.value
  }
])

const userStore = useUserStore()
const { handleLogout, getOrCreateUid } = useAuth()
const { trackAction } = useActionReporter()
const { reportError } = useErrorReporter()

const uid = ref(getOrCreateUid())
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')

const currentLocale = computed(() => {
  return typeof locale.value === 'string' ? locale.value : locale.value?.code || 'en'
})

const showLoginModal = () => {
  showLogin.value = true
}

// 重置所有loading状态的函数
const resetAllLoadingStates = () => {
  loadingStarter.value = false
  loadingAdvance.value = false
  loadingPro.value = false
  loadingFree.value = false
}

// 根据类型重置特定loading状态的函数
const resetLoadingStateByType = (type) => {
  if (type.includes('starter')) {
    loadingStarter.value = false
  } else if (type.includes('advance')) {
    loadingAdvance.value = false
  } else if (type.includes('pro')) {
    loadingPro.value = false
  } else if (type.includes('free')) {
    loadingFree.value = false
  }
}

const handleLoginSuccess = () => {
  showLogin.value = false
}

const success_url = `/${currentLocale.value}/pay-success`
const cancel_url = `/${currentLocale.value}/pricing`
// 新增的点击处理方法
const handleButtonClick = async (type) => {
  if (!type) {
    alert(t('pricing.errors.buttonTypeRequired'))
    return
  }
  if (!isLoggedIn.value) { // 检查用户是否登录
    showLoginModal(); // 显示登录弹窗
    trackAction({
      email: userEmail.value,
      action: ActionType.PRICING_POP_LOGIN,
      domain: domain,
      modelcat: 'pricing',
      modelname: 'pricing',
      uid: uid.value
    })
    return ;
  } 
  
  // 根据按钮类型设置对应的加载状态
  if (type.includes('starter')) {
    loadingStarter.value = true;
  } else if (type.includes('advance')) {
    loadingAdvance.value = true;
  } else if (type.includes('pro')) {
    loadingPro.value = true;
  }
  
  // 处理已登录用户的逻辑
  const url = `${host}/lapi/mogofun/cpaysess`
  
  try {
    const formData = new FormData()
    formData.append('type_name', type)
    formData.append('email', userEmail.value)
    formData.append('success_url', success_url)
    formData.append('cancel_url', cancel_url)
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()

    if (data.ret === 0) {
      // 在页面跳转前使用 sendBeacon 确保数据能够发送
      // sendBeacon 是同步的，会立即将数据加入发送队列，即使页面跳转也能发送
      trackAction({
        email: userEmail.value,
        action: ActionType.PRICING_CHECKOUT_SUCCESS,
        domain: domain,
        modelcat: 'pricing',
        modelname: 'pricing',
        uid: uid.value,
        useBeacon: true
      })
      // 立即跳转，sendBeacon 会确保数据发送
      window.location.href = data.url
    } else {
      // 重置对应的加载状态
      resetLoadingStateByType(type)
      trackAction({
        email: userEmail.value,
        action: ActionType.PRICING_CHECKOUT_FAILED,
        domain: domain,
        modelcat: 'pricing',
        modelname: 'pricing',
        uid: uid.value
      })
      reportError(data.msg, {
        url: pageUrl.value,
        userEmail: userEmail.value
      })
    }
  } catch (error) {
    // 重置对应的加载状态
    resetLoadingStateByType(type)
    trackAction({
      email: userEmail.value,
      action: ActionType.PRICING_CHECKOUT_FAILED,
      domain: domain,
      modelcat: 'pricing',
      modelname: 'pricing',
      uid: uid.value
    })
    reportError(error, {
      url: pageUrl.value,
      userEmail: userEmail.value
    })
  }
}


  const pageUrl = computed(() => {
    if (process.client) {
      return window.location.href
    }
    return ''
  })
  
  const characterSlug = computed(() => 'pricing')

  const { onPageError } = usePageErrorHandler(characterSlug)

  onErrorCaptured(onPageError)

  // 路由监听器 - 处理浏览器返回按钮的情况
  const route = useRoute()
  watch(() => route.path, (newPath, oldPath) => {
    // 当路由变化时重置loading状态
    if (newPath !== oldPath) {
      resetAllLoadingStates()
    }
  })

  // 页面可见性API监听 - 处理浏览器返回按钮
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // 页面重新可见时重置loading状态
      resetAllLoadingStates()
    }
  }

  onMounted(() => {
    userStore.initUserState()
    resetAllLoadingStates()
    
    // 添加页面可见性监听
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onActivated(() => {
    resetAllLoadingStates()
  })

  onUnmounted(() => {
    // 清理事件监听器
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    // 页面卸载时重置所有状态
    resetAllLoadingStates()
  })

  const router = useRouter()

  const goToHome = () => {
    if (!userStore.isLoggedIn) {
      // 显示登录弹窗
      userStore.showLoginModal = true
      return
    }
    
    // 设置免费计划按钮的加载状态
    loadingFree.value = true
    
    // 根据当前语言跳转到首页，英语时直接跳转到根路径如
    const path = locale.value === 'en' ? '/' : `/${locale.value}`
    window.location.href = path
  }
</script>

<style scoped>
/* Additional styling for pricing cards */
.pricing-card {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* Gradient button styling */
.btn-primary {
  background: linear-gradient(90deg, #F1AC63 0%, #D76FF4 100%);
  color: white;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(215, 111, 244, 0.3);
}

.btn-pro {
  background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
  color: white;
  transition: all 0.3s ease;
}

.btn-pro:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3);
}
</style>
