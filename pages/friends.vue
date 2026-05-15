<template>
  <div class="friends-page max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">{{ $t('friends.title') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="link in friendLinks" :key="link.url" 
           class="friend-card p-4 border rounded-lg hover:shadow-lg transition-shadow">
        <a :href="link.url" target="_blank" rel="noopener noreferrer" class="block">
          <h2 class="text-lg font-semibold">{{ link.title }}</h2>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const friendLinks = ref([
])
</script>