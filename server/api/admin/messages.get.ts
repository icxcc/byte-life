import { supabase, supabaseAdmin } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 验证 Supabase Authentication
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权访问'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 使用 Supabase 认证验证令牌
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '认证失败'
      })
    }

    // 从数据库获取消息数据
    const { data: messages, error: dbError } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Supabase 查询错误:', dbError)
      throw createError({
        statusCode: 500,
        statusMessage: '获取消息数据失败'
      })
    }

    // 统计数据
    const stats = {
      total: messages.length,
      unread: messages.filter(m => !m.read).length,
      today: messages.filter(m => {
        const today = new Date()
        const messageDate = new Date(m.created_at)
        return messageDate.toDateString() === today.toDateString()
      }).length
    }

    // 格式化消息数据
    const formattedMessages = messages.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      message: message.message,
      read: message.read,
      createdAt: message.created_at,
      ip: message.ip_address,
      userAgent: message.user_agent
    }))

    return {
      success: true,
      data: {
        messages: formattedMessages,
        stats
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取消息失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取消息失败'
    })
  }
})