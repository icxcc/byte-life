import { supabaseAdmin } from '~/lib/supabase'
import type { H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

/**
 * 认证错误类型
 */
export interface AuthError {
  code: string
  message: string
  statusCode: number
}

/**
 * 认证用户信息
 */
export interface AuthUser {
  id: string
  email: string
  role: string
  metadata?: Record<string, any>
}

/**
 * 验证管理员权限
 */
export async function verifyAdminAuth(event: H3Event): Promise<AuthUser> {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供认证令牌',
      data: { code: 'MISSING_TOKEN', message: '认证令牌未提供' }
    })
  }

  const token = authHeader.substring(7)
  
  // 验证令牌格式
  if (!isValidTokenFormat(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: '无效的令牌格式',
      data: { code: 'INVALID_TOKEN_FORMAT', message: '令牌格式无效' }
    })
  }
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '无效的认证令牌',
        data: { code: 'INVALID_TOKEN', message: '认证令牌无效或已过期' }
      })
    }

    // 检查用户角色
    const userRole = user.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: '权限不足',
        data: { code: 'INSUFFICIENT_PERMISSIONS', message: '需要管理员权限' }
      })
    }

    return {
      id: user.id,
      email: user.email || '',
      role: userRole,
      metadata: user.user_metadata
    }
  } catch (error: any) {
    console.error('认证验证失败:', error)
    
    // 如果是自定义错误，直接抛出
    if (error.statusCode && error.data?.code) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: '认证验证失败',
      data: { code: 'AUTH_VALIDATION_FAILED', message: '认证验证过程中发生错误' }
    })
  }
}

/**
 * 验证普通用户权限
 */
export async function verifyUserAuth(event: H3Event): Promise<AuthUser> {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供认证令牌',
      data: { code: 'MISSING_TOKEN', message: '认证令牌未提供' }
    })
  }

  const token = authHeader.substring(7)
  
  if (!isValidTokenFormat(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: '无效的令牌格式',
      data: { code: 'INVALID_TOKEN_FORMAT', message: '令牌格式无效' }
    })
  }
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '无效的认证令牌',
        data: { code: 'INVALID_TOKEN', message: '认证令牌无效或已过期' }
      })
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'user',
      metadata: user.user_metadata
    }
  } catch (error: any) {
    console.error('用户认证验证失败:', error)
    
    if (error.statusCode && error.data?.code) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: '用户认证验证失败',
      data: { code: 'USER_AUTH_FAILED', message: '用户认证验证过程中发生错误' }
    })
  }
}

/**
 * 验证令牌格式
 */
function isValidTokenFormat(token: string): boolean {
  // JWT 令牌通常由三部分组成，用点分隔
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part.length > 0)
}

/**
 * 创建标准化的成功响应
 */
export function createSuccessResponse(data: any, message?: string) {
  return {
    success: true,
    message: message || '操作成功',
    data,
    timestamp: new Date().toISOString()
  }
}

/**
 * 创建标准化的错误响应
 */
export function createErrorResponse(message: string, statusCode = 500, code?: string) {
  throw createError({
    statusCode,
    statusMessage: message,
    data: {
      code: code || 'INTERNAL_ERROR',
      message,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * 创建标准化的 API 响应
 */
export function createApiResponse(
  success: boolean,
  data: any,
  message?: string,
  code?: string
) {
  return {
    success,
    message: message || (success ? '操作成功' : '操作失败'),
    code: code || (success ? 'SUCCESS' : 'ERROR'),
    data,
    timestamp: new Date().toISOString()
  }
}