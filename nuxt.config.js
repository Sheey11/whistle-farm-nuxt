export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'whistle-farm',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'ant-design-vue/dist/antd.css',
    '@/static/all.css',
    '@fortawesome/fontawesome-free/css/all.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},
  auth: {
    redirect: {
      login: '/',
      callback: '/admin',
      home: '/admin'
    },
    strategies: {
      local: {
        token: {
          property: 'jwt',
          required: true,
          type: 'Bearer',
          maxAge: 25920000 // 30 days
        },
        user: {
          property: false
        },
        endpoints: {
          login: {
            url: 'https://api.farm.sheey.moe/auth/login',
            method: 'post'
          },
          logout: false,
          user: {
            url: 'https://api.farm.sheey.moe/auth/me',
            property: false,
            method: 'get'
          }
        }
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'Whistle Farm',
      short_name: 'WhistleFarm',
      description: '自动填写微哨打卡',
      lang: 'zh'
    },
    meta: {
      name: 'Whistle Farm',
      author: 'sheey',
      description: '自动填写微哨打卡'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
