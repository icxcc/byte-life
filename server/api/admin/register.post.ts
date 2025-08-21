import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // 验证是否为预设的管理员邮箱
    const allowedAdminEmails = ['admin@bytelife.com']
    if (!allowedAdminEmails.includes(email)) {
      throw createError({
        statusCode: 403,
        statusMessage: '只允许预设的管理员邮箱注册'
      })
    }

    // 使用客户端 Supabase 注册用户
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    })

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message === 'User already registered' 
          ? '用户已存在，请直接登录' 
          : error.message
      })
    }

    // 更新 admin_users 表中的记录
    if (data.user) {
      const { error: updateError } = await supabase
        .from('admin_users')
        .upsert({ 
          username: 'admin',
          email: email,
          password_hash: 'supabase_auth',
          role: 'admin',
          created_at: new Date().toISOString()
        })

      if (updateError) {
        console.error('更新 admin_users 表失败:', updateError)
      }
    }

    return {
      success: true,
      user: data.user,
      message: data.user ? '注册成功！' : '注册邮件已发送，请检查邮箱确认'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '创建用户失败'
    })
  }
})
