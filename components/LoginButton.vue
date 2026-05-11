<template>
    <div>
      <button v-if="!isLoggedIn" @click="showLoginModal" 
        class="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:border-gray-400 transition duration-300">
        {{ $t('comm.login') }}
      </button>
      <div v-else class="relative">
        <button @click="toggleDropdown" 
          class="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:border-gray-400 transition duration-300">
          <div class="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
            <img 
              :src="userAvatar" 
              alt="User Avatar" 
              class="w-full h-full object-cover"
              crossorigin="anonymous"
            >
          </div>
          <span class="ml-2 text-sm">{{ userName }}</span>
        </button>
        
        <!-- 修改后的 dropdown menu -->
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-50">
          <div class="py-1">
            <button 
              @click="logout" 
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-300"
            >
              {{ $t('comm.logout') }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- 引入 LoginModal 组件 -->
      <LoginModal :showModal="showModal" @loginSuccess="handleLoginSuccess" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/store/user'
import { useErrorReporter } from '~/composables/errorReporter'
import { useI18n } from 'vue-i18n'
import LoginModal from './LoginModal.vue'

const userStore = useUserStore()
const { handleLogout } = useAuth()
const { reportError } = useErrorReporter()
const { locale } = useI18n()

const showModal = ref(false)
const showDropdown = ref(false)

const isLoggedIn = computed(() => !!userStore.user)
const userName = computed(() => userStore.user?.name || '')
const userAvatar = computed(() => userStore.user?.picture || '')

// 生成本地化路径的函数
const localizedPath = (path) => {
  // 对于所有语言，添加语言前缀
  return `/${locale.value}${path}`
}

const showLoginModal = () => {
  showModal.value = true
}

const handleLoginSuccess = () => {
  showModal.value = false
}

const logout = async () => {
  try {
    await handleLogout()
    showDropdown.value = false
  } catch (error) {
    reportError(error, 'Logout failed--logout')
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

onMounted(() => {
  userStore.initUserState()
})
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  color: #4A5568; /* text-gray-700 */
  border: 1px solid #CBD5E0; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded */
  transition: border-color 0.3s;
}

.button:hover {
  border-color: #A0AEC0; /* hover:border-gray-400 */
}

.user-avatar {
  width: 1.5rem; /* w-6 */
  height: 1.5rem; /* h-6 */
  border-radius: 9999px; /* rounded-full */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E2E8F0; /* bg-gray-100 */
}

.dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem; /* mt-2 */
  width: 100%;
  background-color: white;
  border: 1px solid #CBD5E0; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* shadow-lg */
  z-index: 50;
}

.dropdown button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem; /* px-4 py-2 */
  font-size: 0.875rem; /* text-sm */
  color: #4A5568; /* text-gray-700 */
  transition: background-color 0.3s;
}

.dropdown button:hover {
  background-color: #F7FAFC; /* hover:bg-gray-50 */
}
</style>
