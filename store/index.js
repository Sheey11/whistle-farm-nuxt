import axios from 'axios'

export const state = () => ({

})

export const actions = {
  nuxtServerInit ({ commit }, { $auth }) {
    axios.interceptors.request.use((config) => {
      if ($auth.loggedIn && $auth.strategy.token.get()) {
        config.headers.Authorization = $auth.strategy.token.get()
      }
      return config
    })
  },
  nuxtClientInit ({ commit }, context) {
    axios.interceptors.request.use((config) => {
      if (context.$auth.loggedIn && context.$auth.strategy.token.get()) {
        config.headers.Authorization = context.$auth.strategy.token.get()
      }
      return config
    })
  }
}
