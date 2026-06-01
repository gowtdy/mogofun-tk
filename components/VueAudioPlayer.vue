<template>
  <div class="vue-audio-player">
    <div class="vue-audio-player__progress-timer-wrap">
      <div
          ref="audioProgressWrap"
          class="vue-audio-player__progress-wrap"
          :style="{
          cursor: disabledProgressClick ? 'auto' : 'pointer',
        }"
          @click.stop="handleClickProgressWrap"
      >
        <div
            ref="audioProgress"
            class="vue-audio-player__progress"
            :style="{
            backgroundColor: themeColor,
          }"
        />
        <div
            ref="audioProgressPoint"
            class="vue-audio-player__progress-point"
            :style="{
            backgroundColor: themeColor,
            boxShadow: `0 0 10px 0 ${themeColor}`,
            cursor: disabledProgressDrag ? 'auto' : 'pointer',
          }"
        />
      </div>

      <div class="vue-audio-player__time-wrap">
        <div class="vue-audio-player__current-time">
          {{ currentTimeFormatted }}
        </div>
        <div class="vue-audio-player__duration">
          {{ durationFormatted }}
        </div>
      </div>
    </div>

    <div class="vue-audio-player__btn-wrap">
      <div
          v-if="isLoading && showPlayLoading"
          class="vue-audio-player__play-loading"
      >
        <svg width="41" height="41" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F1AC63" />
              <stop offset="100%" stop-color="#D76FF4" />
            </linearGradient>
          </defs>

          <circle cx="512" cy="512" r="508" fill="url(#linearGradient)" />

          <path class="spinner"
                d="M 512 179
           A 333 333 0 0 1 800.5 678.5"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="80"
                stroke-linecap="round" />
        </svg>
      </div>

      <template v-else>
        <div
            v-if="!isPlaying && showPlayButton"
            class="vue-audio-player__play-start"
            @click.stop="play"
            :style="{
              color: themeColor,
            }"
        >
          <slot name="play-start">
            <svg
                class="vue-audio-player__play-icon"
                t="1717510855219"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3799"
                width="200"
                height="200"
                aria-hidden="true"
            >
              <defs>
                <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F1AC63" />
                  <stop offset="100%" stop-color="#D76FF4" />
                </linearGradient>
              </defs>
              <path
                  d="M512 8.97941504c277.81531056 0 503.02058496 225.20527562 503.02058496 503.02058496s-225.20527562 503.02058496-503.02058496 503.02058496S8.97941504 789.81531056 8.97941504 512 234.18468944 8.97941504 512 8.97941504z m-70.12698734 325.48390806c-26.63050141 0-48.23079685 21.60029545-48.23079807 48.23079686v253.81827015a48.23079685 48.23079685 0 0 0 74.26951062 40.56712988l199.46245688-128.1518906a48.23079685 48.23079685 0 0 0-0.35507283-81.37097702l-199.46245689-125.66637833a48.23079685 48.23079685 0 0 0-25.71322921-7.42695094z"
                  p-id="3800" :fill="`url(#${gradientId})`"
              ></path>
            </svg>
          </slot>
        </div>

        <div
            v-else-if="showPlayButton"
            class="vue-audio-player__play-pause"
            @click.stop="pause"
            :style="{
              color: themeColor,
            }"
        >
          <slot name="play-pause">
            <svg
                t="1717510886292"
                class="vue-audio-player__play-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3945"
                width="200"
                height="200"
                aria-hidden="true"
            >
              <defs>
                <linearGradient :id="`${gradientId}-pause`" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F1AC63" />
                  <stop offset="100%" stop-color="#D76FF4" />
                </linearGradient>
              </defs>
              <path
                  d="M512 1012.62222187C234.38222187 1012.62222187 11.37777813 789.61777813 11.37777813 512S234.38222187 11.37777813 512 11.37777813s500.62222187 223.0044448 500.62222187 500.62222187-223.0044448 500.62222187-500.62222187 500.62222187z m136.53333333-682.66666667c-27.30666667 0-45.51111147 18.2044448-45.51111146 45.51111147v273.06666666c0 27.30666667 18.2044448 45.51111147 45.51111146 45.51111147s45.51111147-18.2044448 45.51111147-45.51111147V375.46666667c0-27.30666667-18.2044448-45.51111147-45.51111147-45.51111147zM375.46666667 329.9555552c-27.30666667 0-45.51111147 18.2044448-45.51111147 45.51111147v273.06666666c0 27.30666667 18.2044448 45.51111147 45.51111147 45.51111147s45.51111147-18.2044448 45.51111146-45.51111147V375.46666667c0-27.30666667-18.2044448-45.51111147-45.51111146-45.51111147z"
                  p-id="3946"
                  :fill="`url(#${gradientId}-pause)`"
              ></path>
            </svg>
          </slot>
        </div>
      </template>
      <div v-show="isShowErrorMessage" class="vue-audio-player__notice">
        {{ noticeMessage }}
      </div>
    </div>

    <audio
        ref="audio"
        class="vue-audio-player__audio"
        :src="audioList?.[currentPlayIndex]?.src || audioList?.[currentPlayIndex]"
        v-bind="$attrs"
        @ended="onEnded"
        @durationchange="onDurationchange"
    >
      The browser is too old, please upgrade~
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/store/user'
import { useErrorReporter } from '~/composables/errorReporter'
const { reportError } = useErrorReporter()

const props = defineProps({
  // 音频播放列表
  audioList: {
    required: true,
    default: () => [],
    type: Array,
  },
  // 是否显示播放按钮
  showPlayButton: {
    default: true,
    type: Boolean,
  },
  // 播放前的回调函数
  beforePlay: {
    default: null,
    type: Function,
  },
  // 上一首前的回调函数
  beforePrev: {
    default: null,
    type: Function,
  },
  // 下一首前的回调函数
  beforeNext: {
    default: null,
    type: Function,
  },
  // 是否列表循环播放
  isLoop: {
    type: Boolean,
    default: false,
  },
  // 进度更新间隔
  progressInterval: {
    default: 500,
    type: Number,
  },
  // 是否显示倍速播放速率
  showPlaybackRate: {
    type: Boolean,
    default: false,
  },
  // 是否显示播放时的 loading
  showPlayLoading: {
    type: Boolean,
    default: true,
  },
  playbackRates: {
    type: Array,
    default: () => [0.5, 1, 1.5, 2],
  },
  themeColor: {
    type: String,
    default: '#EC4141',
  },
  // 是否禁用进度条可拖拽功能
  disabledProgressDrag: {
    type: Boolean,
    default: false,
  },
  // 是否禁用进度条可点击功能
  disabledProgressClick: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'pause',
  'play-prev',
  'play-next',
  'timeupdate',
  'durationchange',
  'ended',
  'progress-start',
  'progress-end',
  'progress-move',
  'progress-click',
  'playing',
  'play',
  'play-error',
])

const { getOrCreateUid } = useAuth()
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const uid = ref(getOrCreateUid())
const userEmail = computed(() => userStore.user?.email || '')

// 响应式状态
const isIOS = ref(/iPhone|iPad|iPod/i.test(navigator?.userAgent)) // 是否是IOS设备
const isPlaying = ref(false) // 音频是否正在播放
const isDragging = ref(false) // 是否正在拖拽音频进度
const isShowErrorMessage = ref(false)
const isLoading = ref(false)
const isAutoPlayNext = ref(false) // 是否自动播放下一首
const timer = ref(null)
const noticeMessage = ref('')
const duration = ref(0) // 音频持续时间
const currentPlayIndex = ref(0) // 当前播放的音频位置索引
const currentTime = ref('') // 音频当前播放时间
const currentVolume = ref(1) // 当前音量
const playbackRate = ref(1) // 当前播放速率
const canProgressDrag = ref(true)

// 生成唯一的渐变 ID，避免多个实例冲突
const gradientId = ref(`gradient-${Math.random().toString(36).substr(2, 9)}`)

// DOM引用
const audio = ref(null)
const audioProgress = ref(null)
const audioProgressPoint = ref(null)
const audioProgressWrap = ref(null)
const playVolumeWrap = ref(null)

// 计算属性
const currentTimeFormatted = computed(() => {
  return currentTime.value ? formatTime(currentTime.value) : '00:00'
})

const durationFormatted = computed(() => {
  return duration.value ? formatTime(duration.value) : '00:00'
})

// 方法
const updateMediaMetadata = () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: props.audioList[currentPlayIndex.value].title,
      artist: props.audioList[currentPlayIndex.value].artist,
      album: props.audioList[currentPlayIndex.value].album,
      artwork: props.audioList[currentPlayIndex.value].artwork,
    })

    navigator.mediaSession.setActionHandler('play', () => {
      play()
    })

    navigator.mediaSession.setActionHandler('pause', () => {
      pause()
    })
  }
}

const handleVolumePanmove = (event) => {
  let playVolumeWrapRect = playVolumeWrap.value.getBoundingClientRect()
  let pageY = event.pageY || event.touches[0].pageY
  let offsetTop
  let volume

  offsetTop = Math.round(playVolumeWrapRect.bottom - pageY)
  volume = offsetTop / playVolumeWrap.value.offsetHeight
  volume = Math.min(volume, 1)
  volume = Math.max(volume, 0)
  audio.value.volume = volume
  currentVolume.value = volume
}

const onDurationchange = (event) => {
  try {
    if (!audio.value) {
      audio.value = new Audio()
      audio.value.load()
      // console.warn('Audio element is not initialized')
      // reportError(new Error("Audio element is not initialized",  'VueAudioPlayer onDurationchange audio no initial', uid.value,  userEmail.value))
      // return
    }
    duration.value = audio.value.duration || 0
    emit('durationchange', event)
  } catch (err) {
    // console.error('Error in onDurationchange:', err)
    reportError(err, 'VueAudioPlayer Audio duration change error', uid.value,  userEmail.value)
  }
}

const formatTime = (second) => {
  let minute = 0

  minute = Math.floor(second / 60)
  second = Math.ceil(second % 60)

  if (second >= 60) {
    minute++
    second = 0
  }

  minute = String(minute)
  second = String(second)

  minute = minute.length === 1 ? '0' + minute : minute
  second = second.length === 1 ? '0' + second : second

  return minute + ':' + second
}

const onEnded = (event) => {
  setTimeout(() => {
    pause()
    emit('ended', event)
  }, props.progressInterval)
}

const handleProgressPanstart = (event) => {
  canProgressDrag.value = false

  if (props.disabledProgressDrag) return

  isDragging.value = true
  emit('progress-start', event)
}

const handleProgressPanend = (event) => {
  if (props.disabledProgressDrag || !isDragging.value) return

  isDragging.value = false

  play({
    currentTime: currentTime.value,
  })

  emit('progress-end', event)
}

const handleProgressPanmove = (event) => {
  if (props.disabledProgressDrag || !isDragging.value) return

  let pageX = event.pageX || event.touches[0].pageX
  let bcr = audioProgressPoint.value.getBoundingClientRect()

  let targetLeft = parseInt(
      getComputedStyle(audioProgressPoint.value).left,
  )

  let offsetLeft = targetLeft + (pageX - bcr.left)

  offsetLeft = Math.min(
      offsetLeft,
      audioProgressWrap.value.offsetWidth,
  )

  offsetLeft = Math.max(offsetLeft, 0)

  setPointPosition(offsetLeft)

  audioProgress.value.style.width = offsetLeft + 'px'

  const newCurrentTime = (offsetLeft / audioProgressWrap.value.offsetWidth) * duration.value
  if (!isNaN(newCurrentTime) && isFinite(newCurrentTime)) {
    currentTime.value = newCurrentTime
  }

  emit('progress-move', event)
}

const handleClickProgressWrap = (event) => {
  if (props.disabledProgressClick || !canProgressDrag.value) {
    canProgressDrag.value = true
    return
  }

  if (event.target === audioProgressPoint.value) {
    return
  }

  // duration 為 0 或無效時不進行 seek，避免 seek 到 0 導致從頭播放
  const d = duration.value
  if (!d || !Number.isFinite(d) || d <= 0) {
    canProgressDrag.value = true
    emit('progress-click', event)
    return
  }

  const pageX = event.pageX ?? event.touches?.[0]?.pageX
  const wrapRect = audioProgressWrap.value.getBoundingClientRect()
  let offsetLeft = pageX - wrapRect.left
  const wrapWidth = audioProgressWrap.value.offsetWidth
  offsetLeft = Math.max(0, Math.min(offsetLeft, wrapWidth))

  const newCurrentTime = (offsetLeft / wrapWidth) * d
  if (!isNaN(newCurrentTime) && isFinite(newCurrentTime)) {
    currentTime.value = newCurrentTime
    play({
      currentTime: currentTime.value,
    })
    setPointPosition(offsetLeft)
    audioProgress.value.style.width = offsetLeft + 'px'
  }

  canProgressDrag.value = true
  emit('progress-click', event)
}

const setPointPosition = (offsetLeft) => {
  audioProgressPoint.value.style.left =
      offsetLeft - audioProgressPoint.value.offsetWidth / 2 + 'px'
}

const playing = () => {
  if (isDragging.value) {
    return
  }

  let offsetLeft =
      (audio.value.currentTime / audio.value.duration) *
      audioProgressWrap.value.offsetWidth

  currentTime.value = audio.value.currentTime
  audioProgress.value.style.width = offsetLeft + 'px'
  setPointPosition(offsetLeft)
  emit('playing')
}

const play = (opts = {}) => {
  return new Promise((resolve, reject) => {
    // 使用 requestAnimationFrame 优化播放操作，减少 INP
    requestAnimationFrame(() => {
      isLoading.value = true

      const isSeeking = opts?.currentTime !== undefined && !isNaN(opts.currentTime) && isFinite(opts.currentTime)

      const handlePlay = () => {
        if (isSeeking) {
          // seek：先暫停、設 currentTime，下一幀再 play，確保瀏覽器處理完 seek 再播放
          audio.value.pause()
          audio.value.currentTime = opts.currentTime
          requestAnimationFrame(() => {
            audio.value
                .play()
                .then(() => {
                  requestAnimationFrame(() => {
                    if (timer.value) {
                      currentTime.value = audio.value.currentTime
                    } else {
                      timer.value = setInterval(playing, props.progressInterval)
                    }
                    isPlaying.value = true
                    isLoading.value = false
                    audio.value.playbackRate = playbackRate.value
                    emit('play')
                    resolve(audio.value)
                  })
                })
                .catch((error) => {
                  reportError(error, `Audio play failed: ` + error.message, uid.value, userEmail.value)
                  if (error.code === 9 && isAutoPlayNext.value) {
                    setTimeout(() => playNext(), 3000)
                  }
                  isLoading.value = false
                  emit('play-error', error)
                  reject(error)
                })
          })
          updateMediaMetadata()
          return
        }

        // 一般播放
        audio.value
            .play()
            .then(() => {
              // 批量处理状态更新
              requestAnimationFrame(() => {
                if (timer.value) {
                  currentTime.value = audio.value.currentTime
                } else {
                  timer.value = setInterval(playing, props.progressInterval)
                }

                isPlaying.value = true
                isLoading.value = false
                audio.value.playbackRate = playbackRate.value

                emit('play')
                resolve(audio.value)
              })
            })
            .catch((error) => {
              reportError(error, `Audio play failed: ` + error.message , uid.value, userEmail.value)

              if (error.code === 9 && isAutoPlayNext.value) {
                setTimeout(() => {
                  playNext()
                }, 3000)
              }

              isLoading.value = false
              emit('play-error', error)
              reject(error)
            })

        updateMediaMetadata()
      }

      // seek 時不執行 iOS 的 play/pause，避免重置 currentTime 導致從頭播放
      if (isIOS.value && !isSeeking) {
        audio.value.play()
        audio.value.pause()
      }

      if (props.beforePlay) {
        props.beforePlay((state) => {
          if (state !== false) {
            handlePlay()
          }
        })
        return
      }

      handlePlay()
    })
  })
}

const pause = () => {
  // 使用 requestAnimationFrame 优化暂停操作，减少 INP
  requestAnimationFrame(() => {
    if (audio.value && !audio.value.paused) {
      audio.value.pause()
    }
    
    // 批量更新状态
    requestAnimationFrame(() => {
      clearTimer()
      isPlaying.value = false
      emit('pause')
    })
  })
}

const clearTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const playNext = () => {
  if (currentPlayIndex.value >= props.audioList.length - 1) {
    if (props.isLoop) {
      currentPlayIndex.value = 0
    } else {
      return
    }
  } else {
    currentPlayIndex.value++
  }
  
  // 重置状态
  isLoading.value = true
  currentTime.value = 0
  
  // 确保音频元素加载新的源后再播放
  setTimeout(() => {
    play().catch(error => {
      reportError(error, `PlayNext failed: ${error.message}`, uid.value, userEmail.value)
      isLoading.value = false
    })
  }, 100)
}

// 生命周期钩子
onMounted(() => {
  audioProgressPoint.value?.addEventListener?.(
      'mousedown',
      handleProgressPanstart,
  )

  document?.addEventListener?.('mousemove', handleProgressPanmove)
  document?.addEventListener?.('mouseup', handleProgressPanend)

  playVolumeWrap.value?.addEventListener?.(
      'touchmove',
      handleVolumePanmove,
  )

  audioProgressPoint.value?.addEventListener?.(
      'touchstart',
      handleProgressPanstart,
  )

  document?.addEventListener?.('touchmove', handleProgressPanmove)
  document?.addEventListener?.('touchend', handleProgressPanend)

  if (audio.value) {
    audio.value.load()
  }
})

onBeforeUnmount(() => {
  if (audio.value) {
    pause()
  }
})
</script>