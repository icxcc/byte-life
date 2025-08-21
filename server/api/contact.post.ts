import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, message } = body

    // 验证必填字段
    if (!name || !email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: '请填写所有必填字段'
      })
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: '请输入有效的邮箱地址'
      })
    }

    // 获取客户端信息
    const clientIP = getClientIP(event) || '未知'
    const userAgent = getHeader(event, 'user-agent') || '未知'

    // 保存到 Supabase 数据库
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
          ip_address: clientIP,
          user_agent: userAgent,
          read: false
        }
      ])
      .select()

    if (error) {
      console.error('Supabase 插入错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '数据保存失败，请稍后重试'
      })
    }

    console.log('联系消息已保存到数据库:', data)

    return {
      success: true,
      message: '消息发送成功！我会尽快回复您。',
      data: data[0]
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('联系表单处理错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '发送失败，请稍后重试'
    })
  }
})