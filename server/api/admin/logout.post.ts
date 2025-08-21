export default defineEventHandler(async (event) => {
  try {
    // 清除管理员 token cookie
    deleteCookie(event, 'admin-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return {
      success: true,
      message: '退出登录成功'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '退出登录失败'
    })
  }
})