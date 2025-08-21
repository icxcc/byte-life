export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 验证请求数据
    const { name, email, subject, message } = body
    
    if (!name || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: '所有字段都是必填的'
      })
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: '邮箱格式不正确'
      })
    }
    
    // 这里可以添加实际的邮件发送逻辑
    // 例如使用 nodemailer 或其他邮件服务
    console.log('收到联系表单提交:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    })
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 返回成功响应
    return {
      success: true,
      message: '消息发送成功！我会尽快回复您。',
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('联系表单处理错误:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误，请稍后重试'
    })
  }
})