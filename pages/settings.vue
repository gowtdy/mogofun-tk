<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4 pt-8 pb-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">{{ $t('settings.title') }}</h1>
      </div>
      
      <p class="text-gray-600 mb-8">{{ $t('settings.subtitle') }}</p>

      <!-- 用户未登录时显示提示 -->
      <div v-if="!isLoggedIn" class="bg-white rounded-xl shadow-md p-8 text-center">
        <div class="text-xl font-medium text-gray-700 mb-4">{{ $t('settings.loginRequired') }}</div>
        <button @click="showLoginModal" class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          {{ $t('comm.login') }}
        </button>
      </div>

      <!-- 用户已登录时显示设置页面 -->
      <div v-else>
        <!-- 加载中状态 -->
        <div v-if="loading" class="flex justify-center items-center py-16">
          <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else>
          <!-- 个人资料和订阅卡片 -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
            <div class="grid grid-cols-1" :class="{'md:grid-cols-2': subType === 'Free', 'md:grid-cols-3': subType !== 'Free'}">
              <!-- 用户个人资料部分 -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                
                <h2 class="text-xl font-bold mb-6 relative">{{ $t('settings.basicInfo') }}</h2>
                
                <div class="flex flex-col items-center text-center mb-6 relative">
                  <img 
                    :src="userStore.getUserAvatar" 
                    :alt="userStore.getUserName"
                    class="w-20 h-20 rounded-full border-2 border-white shadow-lg mb-4"
                  >
                  <div>
                    <h3 class="text-2xl font-bold">{{ userStore.getUserName }}</h3>
                    <p class="text-blue-100">{{ userStore.getUserEmail }}</p>
                  </div>
                </div>
                
                <NuxtLink 
                  :to="localizedPath('/pricing')" 
                  class="block w-full text-center py-3 px-4 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg text-sm font-medium text-white border border-white border-opacity-20 transition-all duration-300 relative mt-4"
                >
                  {{ $t('settings.viewPlans') }}
                </NuxtLink>
              </div>
              
              <!-- 订阅计划部分 -->
              <div class="p-8 border-b md:border-b-0 border-gray-200" :class="{'md:border-r border-gray-200': subType !== 'Free'}">
                <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
                  <span class="mr-2">{{ $t('settings.subscription') }}</span>
                  <span v-if="subType !== 'Free'" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{{ $t('settings.active') }}</span>
                </h2>
                
                <div class="flex flex-col items-center text-center mb-6">
                  <div class="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-4 shadow-md">
                    <CheckCircleIcon class="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div class="font-bold text-2xl text-gray-800">
                      {{ subType }} 
                    </div>
                    <div class="text-gray-500">{{ subPeriod }}</div>
                  </div>
                </div>

                <div v-if="subType === 'Free' ">
                  <div class="flex justify-center">
                    <a 
                      :href="localizedPath('/pricing')" 
                      class="inline-block text-center py-4 px-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-base font-medium text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
                    >
                      {{ $t('settings.upgrade') }}
                    </a>
                  </div>
                </div>
                <div v-else >
                  <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="text-sm text-gray-700 mb-1">{{ $t('settings.nextBilling') }} : {{ nextBillDate }}</div>
                  </div>
                  <a 
                    :href="stripePortalLink" 
                    target="_blank" 
                    class="block w-full text-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    {{ $t('settings.manageSubscription') }}
                  </a>
                </div>
              </div>
              
              <!-- 使用统计部分 - 仅在非Free订阅时显示 -->
              <div v-if="subType !== 'Free'" class="p-8">
                <h2 class="text-xl font-bold mb-6 text-gray-800">{{ $t('settings.usageStats') }}</h2>
                <div>
                  <!-- 字符使用量统计 -->
                  <div class="mb-6">
                    <div class="flex justify-between mb-2">
                      <div class="font-medium text-gray-700">{{ $t('settings.voiceGeneration') }}</div>
                      <div class="font-semibold text-gray-900">
                        {{ usedChar }}/{{ totalChar }}
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        class="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500" 
                        :style="`width: ${calculatePercentage(usedChar, totalChar)}%`"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- 音效生成次数统计 - 暂时不发布 -->
                  <div class="mb-6" v-if="soundTotal > 0">
                    <div class="flex justify-between mb-2">
                      <div class="font-medium text-gray-700">{{ $t('settings.soundGenerationCount') }}</div>
                      <div class="font-semibold text-gray-900">
                        {{ soundUsed }}/{{ soundTotal }}
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        class="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-500" 
                        :style="`width: ${calculatePercentage(soundUsed, soundTotal)}%`"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- 人声分离次数统计 - 暂时不发布 -->
                  <div class="mb-6" v-if="vocalisolateTotal > 0">
                    <div class="flex justify-between mb-2">
                      <div class="font-medium text-gray-700">{{ $t('settings.vocalisolateCount') }}</div>
                      <div class="font-semibold text-gray-900">
                        {{ vocalisolateUsed }}/{{ vocalisolateTotal }}
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        class="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500" 
                        :style="`width: ${calculatePercentage(vocalisolateUsed, vocalisolateTotal)}%`"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- 人声移除次数统计 - 暂时不发布 -->
                  <div class="mb-6" v-if="vocalremoverTotal > 0">
                    <div class="flex justify-between mb-2">
                      <div class="font-medium text-gray-700">{{ $t('settings.vocalremoverCount') }}</div>
                      <div class="font-semibold text-gray-900">
                        {{ vocalremoverUsed }}/{{ vocalremoverTotal }}
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        class="bg-gradient-to-r from-yellow-500 to-orange-600 h-3 rounded-full transition-all duration-500" 
                        :style="`width: ${calculatePercentage(vocalremoverUsed, vocalremoverTotal)}%`"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- 音频提取次数统计 - 暂时不发布 -->
                  <div class="mb-6" v-if="audioextractorTotal > 0">
                    <div class="flex justify-between mb-2">
                      <div class="font-medium text-gray-700">{{ $t('settings.audioextractorCount') }}</div>
                      <div class="font-semibold text-gray-900">
                        {{ audioextractorUsed }}/{{ audioextractorTotal }}
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        class="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                        :style="`width: ${calculatePercentage(audioextractorUsed, audioextractorTotal)}%`"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 关闭账号卡片 -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
            <div class="p-8">
              <h2 class="text-xl font-bold mb-4 text-gray-800">{{ $t('settings.closeAccount') }}</h2>
              <p class="text-gray-600 mb-4">{{ $t('settings.closeAccountDescription') }}</p>
              <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-800">{{ $t('settings.closeAccountWarning') }}</p>
              </div>
              <div class="flex justify-center">
                <button 
                  @click="showCloseAccountModal = true"
                  class="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  {{ $t('settings.closeAccountButton') }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <!-- 登录弹窗 -->
    <LoginModal :showModal="showModal" @loginSuccess="handleLoginSuccess" />

    <!-- 关闭账号确认对话框 -->
    <Transition name="modal-fade">
      <div v-if="showCloseAccountModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- 背景遮罩 -->
        <div 
          @click="showCloseAccountModal = false"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        ></div>
        
        <!-- 模态框内容 -->
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
          <!-- 标题栏 -->
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ $t('settings.closeAccount') }}
            </h3>
            <button 
              @click="showCloseAccountModal = false" 
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="p-6">
            <div class="text-gray-700 mb-6">
              {{ $t('settings.closeAccountConfirm') }}
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="flex justify-end gap-3 p-4 border-t">
            <button 
              @click="showCloseAccountModal = false" 
              :disabled="isClosingAccount"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('settings.cancel') }}
            </button>
            <button 
              @click="handleCloseAccount" 
              :disabled="isClosingAccount"
              class="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="isClosingAccount" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ $t('settings.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { config } from '~/config/config'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useErrorReporter } from '~/composables/errorReporter'
import { useI18n } from 'vue-i18n'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import LoginModal from '~/components/LoginModal.vue'
import { useToast } from 'vue-toastification/dist/index.mjs'

const toast = useToast()
const { t, locale } = useI18n()
const { reportError } = useErrorReporter()
const userStore = useUserStore()
const host = config.host
const { getUserInfo, getOrCreateUid, handleLogout } = useAuth()

// 根据当前语言本地化路径
const localizedPath = (path) => {
  // 英文使用根路径，其他语言添加语言前缀
  return locale.value === 'en' ? path : `/${locale.value}${path}`
}

// 判断用户是否登录
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 用户相关变量
const userEmail = computed(() => userStore.getUserEmail)
const uid = ref(getOrCreateUid())

// 登录弹窗相关
const showModal = ref(false)

const showLoginModal = () => {
  showModal.value = true
}

const handleLoginSuccess = () => {
  showModal.value = false
}

// 用户信息和加载状态
const userInfo = ref(null)
const loading = ref(true)
const stripePortalLink = ref('https://billing.stripe.com/p/login/aFadR93eK5pFeHX6Oo8bS00')
const customEmail = ref(userEmail.value)

const userSubscript = ref(0)  // 有3个取值, 0 未订阅, 1 已订阅, 2 虽订阅,字符已用完
const userSubscriptType = ref("Free")

// 关闭账号相关
const showCloseAccountModal = ref(false)
const isClosingAccount = ref(false)

const handleCloseAccount = async () => {
  if (!userEmail.value) {
    reportError(new Error('Email is required'), "Close account failed - no email", uid.value, userEmail.value)
    return
  }
  try {
    const userData = await getUserInfo(userEmail.value)
    if (!userData?.userinfo) {
      toast.error(t('settings.fetchSubscriptionFailed'))
      return
    }
    userSubscript.value = userData.userinfo.user_subscript
    if (userSubscript.value >= 1) {
      toast.warning(t('settings.cancelSubBeforeClose'))
      showCloseAccountModal.value = false
      return
    }
  } catch (err) {
    reportError(err, `Fetch user subscription failed - pageUrl: settings`, uid.value, userEmail.value)
    toast.error(t('settings.fetchSubscriptionFailed'))
    showCloseAccountModal.value = false
    return
  }

  isClosingAccount.value = true
  try {
    const response = await $fetch(host + '/lapi/mogofun/closeaccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: userEmail.value
      }
    })

    if (response.ret === 0) {
      showCloseAccountModal.value = false
      // 关闭账号成功后登出用户
      await handleLogout()
      // 可以添加成功提示
      toast.success(t('settings.closeAccountSuccess'))
    } else {
      reportError(new Error(response.msg || 'Close account failed'), "Close account failed", uid.value, userEmail.value)
      // 可以添加错误提示
      toast.error(t('settings.closeAccountError'))
    }
  } catch (error) {
    reportError(error, "Close account failed", uid.value, userEmail.value)
    // 可以添加错误提示
    toast.error(t('settings.closeAccountError'))
  } finally {
    isClosingAccount.value = false
  }
}


const subType = ref("Free")
const subPeriod = ref("Free")
const nextBillDate = ref("-")
const usedChar = ref(0)
const totalChar = ref(1000)

// 使用次数统计（从后端 userInfo 获取）
const soundUsed = ref(0)
const soundTotal = ref(0)
const vocalisolateUsed = ref(0)
const vocalisolateTotal = ref(0)
const vocalremoverUsed = ref(0)
const vocalremoverTotal = ref(0)
const audioextractorUsed = ref(0)
const audioextractorTotal = ref(0)

// 计算使用百分比
const calculatePercentage = (used, total) => {
  if (!total || total === 0 || total === '∞') return 0
  const percentage = (used / total) * 100
  return Math.min(percentage, 100)
}

// 获取用户信息函数
const fetchUserInfo = async () => {
  if (!isLoggedIn.value || !userEmail.value) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await getUserInfo(userEmail.value)
    if (response.ret === 0 && response.userinfo) {
      userInfo.value = response.userinfo
      usedChar.value = userInfo.value.used_char_count
      totalChar.value = userInfo.value.total_usable
      nextBillDate.value = userInfo.value.usable_lastday
      if (userInfo.value.customer_email && userInfo.value.customer_email.trim() !== '') {
        customEmail.value = userInfo.value.customer_email
      }
      stripePortalLink.value = stripePortalLink.value + '?prefilled_email=' + encodeURIComponent(customEmail.value)
      userSubscript.value = userInfo.value.user_subscript
      userSubscriptType.value = userInfo.value.subscript_type
      switch (userSubscriptType.value) {
        case 'starter_month':
          subType.value = 'Starter'
          subPeriod.value = 'Month'
          break;
        case 'starter_year':
          subType.value = 'Starter'
          subPeriod.value = 'Year'
          break;
        case 'advance_month':
          subType.value = 'Advance'
          subPeriod.value = 'Month'
          break;
        case 'advance_year':
          subType.value = 'advance'
          subPeriod.value = 'Year'
          break;
        case 'pro_month':
          subType.value = 'Pro'
          subPeriod.value = 'Month'
          break;
        case 'pro_year':
          subType.value = 'Pro'
          subPeriod.value = 'Year'
          break;
        case 'starter_onepay_month':
          subType.value = 'Starter'
          subPeriod.value = 'Month'
          break; 
        case 'pro_onepay_month':
          subType.value = 'Pro'
          subPeriod.value = 'Month'
          break;
        default:
          subType.value = 'Free'
          subPeriod.value = 'Free'
      }
      
      // 从后端 userInfo 获取使用次数统计
      soundUsed.value = userInfo.value.used_sound_count || 0
      soundTotal.value = userInfo.value.total_sound_count || 0
      vocalisolateUsed.value = userInfo.value.used_vocalisolate_count || 0
      vocalisolateTotal.value = userInfo.value.total_vocalisolate_count || 0
      vocalremoverUsed.value = userInfo.value.used_vocalremover_count || 0
      vocalremoverTotal.value = userInfo.value.total_vocalremover_count || 0
      audioextractorUsed.value = userInfo.value.used_audioextractor_count || 0
      audioextractorTotal.value = userInfo.value.total_audioextractor_count || 0
    }
  } catch (error) {
    reportError(error, "Settings fetchUserInfo", uid.value, userEmail.value)
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取用户信息
onMounted(fetchUserInfo)

// 监听登录状态变化
watch(() => isLoggedIn.value, (newValue) => {
  if (newValue) {
    fetchUserInfo()
  } else {
    loading.value = false
  }
})

// 监听语言变化时，保持登录状态
watch(() => locale.value, () => {
  if (isLoggedIn.value) {
    // 如果已登录，强制重新获取用户信息
    fetchUserInfo()
  }
})

// 设置中文语言
useHead({
  title: t('settings.title'),
  meta: [
    { name: 'description', content: t('settings.subtitle') }
  ]
})

</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 