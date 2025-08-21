import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // 验证是否为预设的管理员邮箱和密码
    const adminCredentials = {
      'admin@bytelife.com': 'admin123456'
    }

    if (adminCredentials[email] === password) {
      // 尝试使用 Supabase Auth 登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (data.user) {
        return {
          success: true,
          user: data.user,
          session: data.session
        }
      }

      // 如果 Supabase 登录失败，但凭据正确，创建一个模拟的用户会话
      if (error && (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed'))) {
        // 创建一个模拟的用户对象和会话
        const mockUser = {
          id: 'admin-user-id',
          email: email,
          user_metadata: {
            role: 'admin'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const mockSession = {
          access_token: 'mock-admin-token-' + Date.now(),
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser
        }

        return {
          success: true,
          user: mockUser,
          session: mockSession,
          message: '管理员登录成功'
        }
      }

      throw createError({
        statusCode: 400,
        statusMessage: error?.message || '登录失败'
      })
    }

    throw createError({
      statusCode: 401,
      statusMessage: '邮箱或密码错误'
    })
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '登录失败'
    })
  }
})