export default {
  mode: 'spa',
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  env: {
    /**
     * При сборке указать локальный адрес сервера.
     * Для ajax запросов
     */
    backendUrl: 'http://10.11.1.163:81'//'http://localhost:81' 
  },
  server: {
    port: 80,
    host: '0.0.0.0',// '192.168.1.64'
  },
  router: {
    base: '/social_network/',
    middleware: ['auth', 'main']
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'social_network',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vuelidate.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],
  auth:{
    strategies: {
      local: {
        endpoints: {
          login: { url: 'http://10.11.1.163:81/login', method: 'post', propertyName: 'token'},//'http://192.168.1.64:81/login'
          logout: false,
          user: { url: 'http://10.11.1.163:81/client', method: 'get', propertyName: 'user'} 
        }
      }
    }
  },
  bootstrapVue: {
    icons: true
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
