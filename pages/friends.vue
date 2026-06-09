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
  { title: 'chromewebstore', url: 'https://chromewebstore.google.com/detail/soup-soul/jancllhbflebcmlajilcpgombdjookij' },
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
  { title: 'youtube', url: 'https://www.youtube.com/redirect?q=https://mogofun.com' },
  { title: 'zhihu', url: 'https://link.zhihu.com/?target=https%3A%2F%2Fmogofun.com' },
  { title: 'scamadviser', url: 'https://www.scamadviser.com/check-website/mogofun.com' },
  { title: 'scam-detector', url: 'https://www.scam-detector.com/validator/mogofun-com-review/' },
  { title: 'gridinsoft', url" 'https://gridinsoft.com/online-virus-scanner/url/mogofun-com' },
  { title: 'reddit', url: 'https://www.reddit.com/r/chtouch_com/comments/1tpxbcs/mogofun_tiktok_%E8%AA%9E%E9%9F%B3%E7%94%9F%E6%88%90%E5%99%A8%E7%94%9F%E6%88%90%E5%90%84%E7%A8%AE_tiktok_%E8%B6%A3%E5%91%B3_ai_%E8%AA%9E%E9%9F%B3%E5%A4%9A%E7%A8%AE%E8%A7%92%E8%89%B2%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B2%BB/' },
  { title: 'magicly', url: 'https://magic.ly/mogofun' },
  { title: 'linktr', url: 'https://linktr.ee/bejamin1995' },
  { title: 'twitter', url: 'https://x.com/aurthur711335' },
  { title: 'pinterest', url: 'https://pin.it/1X5WeLAeK' },
  { title: 'websitehunt', url: 'https://www.websitehunt.co/go/11913/' },
  { title: 'free com tw', url: 'https://free.com.tw/mogofun-tiktok-voice-generator/' },
  { title: 'facebook', url:'https://www.facebook.com/freegroup/posts/mogofun-%E5%89%8D%E8%BA%AB%E7%82%BA-tiktok-voice-%E7%B6%B2%E7%AB%99%E6%98%AF%E4%B8%80%E6%AC%BE%E5%B0%88%E7%82%BA%E7%9F%AD%E5%BD%B1%E9%9F%B3%E5%89%B5%E4%BD%9C%E8%80%85%E8%A8%AD%E8%A8%88%E7%9A%84%E7%B7%9A%E4%B8%8A-ai-%E6%96%87%E5%AD%97%E8%BD%89%E8%AA%9E%E9%9F%B3%E5%B7%A5%E5%85%B7%E9%80%8F%E9%81%8E%E8%AA%9E%E9%9F%B3%E7%94%A2%E7%94%9F%E5%99%A8%E8%83%BD%E5%B0%87%E4%BD%BF%E7%94%A8%E8%80%85%E8%BC%B8%E5%85%A5%E7%9A%84%E6%96%87%E5%AD%97%E8%BD%89%E6%8F%9B%E7%82%BA%E8%AA%9E%E9%9F%B3%E6%AA%94%E6%A1%88%E6%94%AF%E6%8F%B4/1572356754248652/' },
  { title: 'kimi', url: 'https://www.kimi.com/share/19ea76eb-7c12-8102-8000-0000886ffa78' },
  { title: 'chatgpt', url: 'https://chatgpt.com/share/6a277f31-e04c-83eb-9482-a9bd1a8446df' },
  { title: 'deepseek', url: 'https://chat.deepseek.com/share/98vo8wj4pge8o4eeqk' },
  { title: 'gemini', url: 'https://gemini.google.com/share/8675c3cfe16d' },
  { title: 'kit', url: 'https://mogofun.kit.com/' },
])
</script>