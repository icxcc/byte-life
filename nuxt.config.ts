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

  // 明确启用页面功能
  pages: true,

  // SSR 配置
  ssr: true,

  modules: [
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/icon'
  ],

  // Color Mode 配置
  colorMode: {
    preference: 'system', // 默认主题
    fallback: 'light', // 回退主题
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  css: [
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
    '@fontsource/noto-sans-sc/400.css',
    '@fontsource/noto-sans-sc/500.css',
    '@fontsource/noto-sans-sc/600.css',
    '@fontsource/noto-sans-sc/700.css',
    '~/assets/css/main.css'
  ],

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
        { name: 'msapplication-TileColor', content: '#6366f1' },
        { name: 'theme-color', content: '#6366f1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    },
    // 页面过渡配置
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  // 性能优化
  nitro: {
    compressPublicAssets: true,
    minify: true,
    experimental: {
      wasm: true
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
    },
    providers: {
      default: {
        provider: 'ipx'
      }
    }
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: false // 在开发时禁用以提高性能
  },

  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅在服务端可用）
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // 公共配置（客户端和服务端都可用）
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  // 构建优化
  build: {
    transpile: ['@nuxt/ui']
  },

  // 开发服务器配置
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  }
})