import { supabase } from '~/lib/supabase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端执行
  if (import.meta.server) return

  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // 检查路由是否需要认证（默认需要认证）
    const requiresAuth = to.meta.requiresAuth !== false
    
    // 如果需要认证但用户未登录
    if (requiresAuth && !session?.user) {
      console.log('未登录用户访问受保护页面，重定向到登录页面')
      return navigateTo('/admin/login')
    }
    
    // 如果用户已登录但访问登录页面，重定向到管理首页
    if (session?.user && to.path === '/admin/login') {
      return navigateTo('/admin')
    }
  } catch (error) {
    console.error('认证中间件错误:', error)
    return navigateTo('/admin/login')
  }
})
