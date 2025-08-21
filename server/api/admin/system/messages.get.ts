import { supabaseAdmin } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 验证管理员权限
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权访问'
      })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '认证失败'
      })
    }

    // 模拟消息数据
    const messages = [
      {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        subject: '网站合作咨询',
        message: '您好，我对您的项目很感兴趣，希望能够进一步合作。请问是否有时间详细沟通一下？',
        read: false,
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        name: '李四',
        email: 'lisi@example.com',
        subject: '技术问题咨询',
        message: '在使用您的开源项目时遇到了一些技术问题，希望能得到您的帮助和指导。',
        read: false,
        createdAt: '2024-01-19T15:45:00Z',
        updatedAt: '2024-01-19T15:45:00Z'
      },
      {
        id: 3,
        name: '王五',
        email: 'wangwu@example.com',
        subject: '招聘邀请',
        message: '我们公司正在寻找优秀的前端开发工程师，看到您的作品后非常感兴趣，希望能邀请您加入我们团队。',
        read: true,
        createdAt: '2024-01-18T09:20:00Z',
        updatedAt: '2024-01-18T14:30:00Z'
      },
      {
        id: 4,
        name: '赵六',
        email: 'zhaoliu@example.com',
        subject: '项目反馈',
        message: '使用了您开发的工具，效果非常好！有一些改进建议想要分享给您。',
        read: true,
        createdAt: '2024-01-17T16:10:00Z',
        updatedAt: '2024-01-17T16:10:00Z'
      },
      {
        id: 5,
        name: '孙七',
        email: 'sunqi@example.com',
        subject: '学习交流',
        message: '我是一名前端开发新手，看了您的博客文章受益匪浅，希望能够向您请教一些问题。',
        read: false,
        createdAt: '2024-01-16T11:25:00Z',
        updatedAt: '2024-01-16T11:25:00Z'
      }
    ]

    // 计算统计数据
    const stats = {
      total: messages.length,
      unread: messages.filter(msg => !msg.read).length,
      read: messages.filter(msg => msg.read).length
    }

    return {
      success: true,
      data: {
        messages,
        stats
      }
    }
  } catch (error: any) {
    console.error('获取消息列表失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})