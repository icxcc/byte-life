import { supabase } from '~/lib/supabase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端执行
  if (process.server) return

  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // 如果没有会话且不是在登录相关页面，重定向到登录页面
    if (!session?.user) {
      const loginPages = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']
      if (!loginPages.includes(to.path)) {
        console.log('未登录用户访问受保护页面，重定向到登录页面')
        return navigateTo('/admin/login')
      }
    }
  } catch (error) {
    console.error('认证中间件错误:', error)
    return navigateTo('/admin/login')
  }
})