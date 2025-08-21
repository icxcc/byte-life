import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // 预设的管理员凭据
    const adminCredentials = {
      'admin@bytelife.com': 'admin123456'
    }

    // 验证凭据
    if (adminCredentials[email] !== password) {
      throw createError({
        statusCode: 401,
        statusMessage: '邮箱或密码错误'
      })
    }

    // 创建简单的会话令牌
    const sessionToken = 'admin-session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    
    // 在数据库中记录登录信息（可选）
    try {
      await supabase
        .from('admin_users')
        .upsert({
          username: 'admin',
          email: email,
          password_hash: 'local_auth',
          role: 'admin',
          last_login: new Date().toISOString()
        })
    } catch (dbError) {
      console.log('数据库记录失败，但不影响登录:', dbError)
    }

    // 设置会话 Cookie
    setCookie(event, 'admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    return {
      success: true,
      user: {
        id: 'admin-user',
        email: email,
        role: 'admin'
      },
      session: {
        access_token: sessionToken,
        token_type: 'bearer',
        expires_in: 60 * 60 * 24 * 7
      },
      message: '登录成功'
    }
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