export const state = () => ({
  urllang: '',
  lang: 'en',
  langsModels: {},
  allLangs: [],
  selectLang: 'english',
  selectLangModels: [],
  selectModel: '',
  selectModelWavplay: '/mp3/converted.mp3',
  count: 0,
  user: null,
  authToken: null
})

export const mutations = {
  setUrlLang(state, lang) {
    state.urllang = lang
  },
  setLang(state, lang) {
    state.lang = lang
  },
  setVoiceModels(state, voiceModelsData) {
    state.langsModels = voiceModelsData.langsModels
    state.allLangs = voiceModelsData.allLangs
    state.selectLang = voiceModelsData.selectLang
    state.selectLangModels = voiceModelsData.selectLangModels
    state.selectModel = voiceModelsData.selectModel
    state.selectModelWavplay = voiceModelsData.selectModelWavplay
  },
  setData(state, count) {
    state.count = count
  },
  setUser(state, userData) {
    state.user = userData
  },
  setAuthToken(state, token) {
    state.authToken = token
  },
  setLang(state, lang) {
    state.lang = lang
  },
  clearUser(state) {
    state.user = null
    state.authToken = null
  }
}

export const actions = {
  fetchData({ commit }) {
    return new Promise((resolve) => {
      commit('setData', 1)
      resolve()
    })
  },
  loginUser({ commit }, userData) {
    commit('setUser', userData)
  },
  logoutUser({ commit }) {
    commit('clearUser')
  }
}

export const getters = {
  isLoggedIn(state) {
    return !!state.authToken
  },
  currentUser: (state) => state.user,
  authToken: (state) => state.authToken
}
