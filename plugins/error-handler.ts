import { defineNuxtPlugin } from '#app'
import { setupGlobalErrorHandler } from '~/composables/useErrorLogger'

export default defineNuxtPlugin((nuxtApp) => {
  // 设置全局错误处理器
  const { logError } = setupGlobalErrorHandler({
    maxLogs: 500,
    persist: true,
    consoleOutput: process.env.NODE_ENV !== 'production',
    serverEndpoint: '/api/logs/errors'
  })

  // 处理 Nuxt 错误
  nuxtApp.hook('app:error', (error) => {
    logError(
      'Nuxt App Error',
      {
        error: error.message,
        stack: error.stack,
        name: error.name
      },
      'error'
    )
  })

  // 处理 Vue 错误
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    logError(
      'Vue Error',
      {
        error: error.message,
        stack: error.stack,
        component: instance?.$options?.name,
        info
      },
      'error'
    )
  }

  // 处理路由错误
  nuxtApp.hook('vue:error', (error, instance, info) => {
    logError(
      'Vue Component Error',
      {
        error: error.message,
        stack: error.stack,
        component: instance?.$options?.name,
        info
      },
      'error'
    )
  })

  // 提供错误记录器给整个应用
  return {
    provide: {
      errorLogger: { logError }
    }
  }
})