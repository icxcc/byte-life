import { supabaseAdmin } from '~/lib/supabase'
import type { H3Event } from 'h3'

/**
 * 验证管理员权限
 */
export async function verifyAdminAuth(event: H3Event) {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供认证令牌'
    })
  }

  const token = authHeader.substring(7)
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '无效的认证令牌'
      })
    }

    return user
  } catch (error) {
    console.error('认证验证失败:', error)
    throw createError({
      statusCode: 401,
      statusMessage: '认证验证失败'
    })
  }
}

/**
 * 创建标准化的成功响应
 */
export function createSuccessResponse(data: any, message?: string) {
  return {
    success: true,
    message: message || 'Success',
    data
  }
}

/**
 * 创建标准化的错误响应
 */
export function createErrorResponse(message: string, statusCode = 500) {
  throw createError({
    statusCode,
    statusMessage: message
  })
}