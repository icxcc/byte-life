// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2023-07-15',
  devtools: { enabled: true },
  
  // Nuxt 4.0 实验性特性
  experimental: {
    viewTransition: true,
    typedPages: true,
    payloadExtraction: false,
    renderJsonPayloads: true
  },

  // 启用 Nuxt 4.0 的新目录结构
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/color-mode',
    '@nuxt/icon'
  ],

  // 颜色模式配置
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  css: [
    './assets/css/tailwind.css'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // 优化的应用配置
  app: {
    head: {
      title: '字节生活 - 个人网站',
      titleTemplate: '%s | 字节生活',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '个人网站，展示作品、博客和在线互动功能' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#0ea5e9' },
        { name: 'theme-color', content: '#0ea5e9' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  // 性能优化
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  // 路由优化
  router: {
    options: {
      scrollBehavior: () => {
        return { behavior: 'smooth' }
      }
    }
  },

  // 图片优化配置
  image: {
    quality: 80,
    format: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: false // 暂时禁用以避免 vue-tsc 问题
  }
})
