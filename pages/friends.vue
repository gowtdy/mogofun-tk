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
  { title: 'MoGoFun Strip Climate', url: 'https://climate.stripe.com/IUM2MG' },
  { title: 'AIVoiceLab frinds', url: 'https://aivoicelab.net/en/friends' },
  { title: 'medium', url: 'https://medium.com/@tiktokaivoicetool/5%E4%B8%AA%E6%9C%80%E4%BD%B3%E5%85%8D%E8%B4%B9ai%E9%9F%B3%E6%95%88%E7%94%9F%E6%88%90%E5%99%A8%E6%8E%A8%E8%8D%90-ad53838a64c7' },
  { title: 'url tw', url: 'https://myshare.url.com.tw/note/2428720' },
  { title: 'thosefree', url: 'https://www.thosefree.com/tiktokvoice' },
  { title: 'pixnet', url: 'https://keychtouch.pixnet.net/blog/posts/900657311119583110' },
  { title: 'chtouch', url: 'https://chtouch.com/mogofun-tiktok-voice-generator/' },
  { title: 'cal', url: 'https://cal.com/benjamin-carter-mogofun' },
  { title: 'aitools', url: 'https://aitools.inc/tools/tiktok-voice-generator/go/website' },
  { title: 'dpdns', url: 'https://xiaoluo3.dpdns.org/wap/deal.php?code=lxBbi&dataID=22054&mudi=download&point=0' },
  { title: 'notion', url: 'https://goofy-scarf-8ca.notion.site/API-handbook-of-MoGoFun-15154f4a5c9a80d78e79d04d2bbd4f60' },
  { title: 'w2solo', url: 'https://w2solo.com/topics/4908' },
])
</script>