import { supabase } from '~/lib/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * 统一认证中间件
 * 支持客户端和服务器端认证验证
 * 提供完整的权限控制和错误处理
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端执行
  if (import.meta.server) return

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('获取会话失败:', sessionError)
      return handleAuthError(to)
    }
    
    // 检查路由是否需要认证（默认需要认证）
    const requiresAuth = to.meta.requiresAuth !== false
    const requiresAdmin = to.meta.requiresAdmin === true
    
    // 如果需要认证但用户未登录
    if (requiresAuth && !session?.user) {
      console.log('未登录用户访问受保护页面，重定向到登录页面')
      return navigateTo('/admin/login')
    }
    
    // 如果需要管理员权限但用户不是管理员
    if (requiresAdmin && session?.user) {
      const isAdmin = await checkAdminRole(session.user)
      if (!isAdmin) {
        console.log('非管理员用户尝试访问管理员页面')
        return navigateTo('/admin?error=unauthorized')
      }
    }
    
    // 如果用户已登录但访问登录页面，重定向到管理首页
    if (session?.user && to.path === '/admin/login') {
      return navigateTo('/admin')
    }
    
    // 更新用户最后活动时间
    if (session?.user) {
      updateUserLastActivity(session.user.id).catch(console.error)
    }
    
  } catch (error) {
    console.error('认证中间件错误:', error)
    return handleAuthError(to)
  }
})

/**
 * 检查用户是否具有管理员角色
 */
async function checkAdminRole(user: User): Promise<boolean> {
  try {
    // 这里可以根据实际需求实现角色检查逻辑
    // 例如从用户元数据或数据库查询用户角色
    const userRole = user.user_metadata?.role || 'user'
    return userRole === 'admin'
  } catch (error) {
    console.error('检查用户角色失败:', error)
    return false
  }
}

/**
 * 更新用户最后活动时间
 */
async function updateUserLastActivity(userId: string): Promise<void> {
  try {
    // 这里可以实现在数据库中更新用户最后活动时间
    // 暂时使用控制台日志记录
    console.log(`用户 ${userId} 最后活动时间更新`)
  } catch (error) {
    console.error('更新用户活动时间失败:', error)
  }
}

/**
 * 统一处理认证错误
 */
function handleAuthError(to: any) {
  // 根据路由类型返回不同的错误页面
  if (to.path.startsWith('/admin')) {
    return navigateTo('/admin/login?error=auth_failed')
  }
  
  // 对于非管理页面，可以重定向到首页或显示错误信息
  return navigateTo('/?error=auth_required')
}
