export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // 验证必填字段
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: '用户名和密码不能为空'
      })
    }

    // 简单的管理员验证（在实际应用中应该使用数据库和加密密码）
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // 在实际应用中，这里应该生成 JWT token
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      // 设置 HTTP-only cookie（更安全）
      setCookie(event, 'admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 天
      })

      return {
        success: true,
        message: '登录成功',
        user: {
          username,
          role: 'admin'
        }
      }
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: '用户名或密码错误'
      })
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})