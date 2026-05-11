import { ref } from 'vue'
import { useActionReporter, ActionType } from './actionReporter'
import { useErrorReporter } from './errorReporter'

export function useGoogleSearchKeyword() {
  const searchKeyword = ref('')
  const { trackAction } = useActionReporter()
  const { reportError } = useErrorReporter()
  
  const getGoogleSearchKeyword = (pageUrl: string) => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          const urlParams = new URLSearchParams(document.referrer.split('?')[1])
          const googleKeyword = urlParams.get('q')
          if (document.referrer.includes('google.com') && googleKeyword) {
            searchKeyword.value = decodeURIComponent(googleKeyword)
            // 使用 trackAction 上报搜索关键词
            trackAction({
              email: '', // 如果有用户信息可以传入用户邮箱
              action: ActionType.GOOGLE_SEARCH,
              modelcat: `search-${pageUrl}`,
              modelname: searchKeyword.value // 将关键词作为 modelname 传入
            })
          }
        } catch (err) {
          reportError(err, {
            pageUrl: pageUrl,
            searchKeyword: searchKeyword.value
          })
        }
      }
    }, 0)
  }

  return {
    searchKeyword,
    getGoogleSearchKeyword
  }
}