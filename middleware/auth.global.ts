import { supabase } from '~/lib/supabase'

/**
 * 全局认证中间件
 * 自动处理所有 /admin 路径的认证检查
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 只在客户端执行
  if (import.meta.server) return
  
  // 只处理 /admin 路径
  if (!to.path.startsWith('/admin')) return

  // 排除不需要认证的公开页面
  const publicPages = [
    '/admin/login', 
    '/admin/register', 
    '/admin/forgot-password', 
    '/admin/reset-password', 
    '/admin/auth/callback'
  ]
  
  if (publicPages.includes(to.path)) {
    // 如果用户已登录但访问登录相关页面，重定向到管理首页
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user && (to.path === '/admin/login' || to.path === '/admin/register')) {
        return navigateTo('/admin')
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
    return
  }

  // 检查用户是否已登录
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session?.user) {
      console.log('未登录用户访问管理页面，重定向到登录页')
      return navigateTo('/admin/login')
    }
  } catch (error) {
    console.error('认证检查失败:', error)
    return navigateTo('/admin/login')
  }
})
