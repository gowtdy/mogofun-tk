<template>
  <div v-if="showModal" class="fixed inset-0 h-screen bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
    <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-[450px] relative mx-auto my-auto transition-all duration-300 ease-out transform max-h-[80vh] overflow-y-auto">
      <!-- 关闭按钮 -->
      <button @click="emitClose" class="absolute right-3 sm:right-3.5 top-3 sm:top-3.5 bg-gray-200 rounded-full p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-300 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-300">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>
      
      <!-- Logo -->
      <div class="flex items-center justify-center mb-5 sm:mb-6 pt-2">
        <img :src="cdnHost + '/img/logo.svg'" alt="AI Voice over" width="40" height="35" class="h-9 sm:h-10">
        <img :src="cdnHost + '/img/title.svg'" alt="AI Voice over" width="90" height="20" class="h-9 sm:h-10">
      </div>
      
      <!-- 标题 -->
      <h2 class="text-base sm:text-xl font-bold text-center mb-6 sm:mb-7 text-gray-800">{{ $t('comm.loginModalIntro') }}</h2>
      
      <!-- 原生Google登录按钮 -->
      <div class="flex justify-center mb-6">
        <div ref="googleSignInButtonContainer" id="googleButton"></div>
      </div>
      
      <!-- 错误信息 -->
      <div v-if="showGoogleError" class="mt-4 text-center text-xs sm:text-sm text-red-600 p-3 bg-red-50 rounded-lg w-full max-w-[350px] mx-auto">
        <p>{{ $t('comm.loginModalUnlogged') }}</p>
        <p>{{ $t('comm.loginModalVPN') }}</p>
      </div>
      
      <!-- 服务条款信息 -->
      <div class="text-center mt-4 sm:mt-5 mb-2 text-[11px] sm:text-xs text-gray-500 px-2">
        <span>{{ $t('comm.loginModalService').split('Terms of Service')[0] }}</span>
        <NuxtLink class="text-blue-500 hover:underline" to="/terms">{{ $t('comm.termsService') }}</NuxtLink>
        <span> {{ $t('comm.loginModalService').split('Terms of Service and Privacy Policy')[0].split('and')[1] || 'and' }} </span>
        <NuxtLink class="text-blue-500 hover:underline" to="/privacy">{{ $t('comm.privacyPolicy') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useErrorReporter } from '~/composables/errorReporter'
import { config } from '~/config/config'

const cdnHost = config.cdnHost
const { reportError } = useErrorReporter()

const props = defineProps({
  showModal: Boolean
})

const emit = defineEmits(['loginSuccess'])

const emitClose = () => {
  emit('loginSuccess')
}

const { handleGoogleLogin } = useAuth()
const googleSignInButtonContainer = ref(null)
const showGoogleError = ref(false)

watch(() => props.showModal, async (newValue) => {
  if (newValue) {
    await nextTick() // 确保 DOM 更新完成
    setTimeout(() => {
      initializeGoogleSignIn()
    }, 200) // 添加延迟确保DOM加载完成
  }
})

onMounted(() => {
  if (props.showModal) {
    setTimeout(() => {
      initializeGoogleSignIn()
    }, 200)
  }
})

const initializeGoogleSignIn = async () => {
  if (typeof google === 'undefined') {
    reportError(new Error('Google API not loaded'), 'Google API not loaded--initializeGoogleSignIn')
    showGoogleError.value = true
    return
  }

  if (!googleSignInButtonContainer.value) {
    reportError(new Error('Button container element not found'), 'Button container element not found in DOM--initializeGoogleSignIn')
    showGoogleError.value = true
    return
  }

  try {
    // 清空容器
    if (googleSignInButtonContainer.value) {
      googleSignInButtonContainer.value.innerHTML = ''
    }

    google.accounts.id.initialize({
      client_id: '504160656010-hgapam8qrtolskdi50688k68r22ko5kq.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
      ux_mode: 'popup',
      origin: window.location.origin,
      cancel_on_tap_outside: false,
      auto_select: true
    });

    // 使用标准按钮配置
    google.accounts.id.renderButton(
      googleSignInButtonContainer.value, 
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 350
      }
    );

  } catch (error) {
    reportError(error, 'Google Sign-In initialization failed--initializeGoogleSignIn')
    showGoogleError.value = true
  }
}

const handleGoogleSignIn = async (response) => {
  try {
    await handleGoogleLogin(response.credential)
    emit('loginSuccess')
    showGoogleError.value = false
  } catch (error) {
    reportError(error, 'Login failed--handleGoogleSignIn')
    showGoogleError.value = true
  }
}
</script>

<style scoped>
/* 弹窗入场动画 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 确保弹窗在滚动时保持居中 */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 弹窗内容区域样式 */
.bg-white {
  position: relative;
  margin: auto;
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #F7FAFC;
}

/* 自定义滚动条样式 */
.bg-white::-webkit-scrollbar {
  width: 6px;
}

.bg-white::-webkit-scrollbar-track {
  background: #F7FAFC;
  border-radius: 3px;
}

.bg-white::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}

/* 确保内容不会被滚动条遮挡 */
.p-4 {
  padding-right: calc(1rem + 6px);
}
</style>