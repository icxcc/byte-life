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

    // 模拟文章数据
    const articles = [
      {
        id: 1,
        title: 'Vue 3 Composition API 深度解析',
        slug: 'vue3-composition-api-deep-dive',
        excerpt: '深入了解 Vue 3 Composition API 的设计理念和最佳实践，包括响应式系统、生命周期钩子等核心概念。',
        content: '# Vue 3 Composition API 深度解析\n\nVue 3 引入了 Composition API，这是一个全新的 API 设计...',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        category: '技术',
        tags: 'Vue.js,JavaScript,前端开发',
        published: true,
        featured: true,
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T09:30:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        readTime: 8,
        views: 1250,
        likes: 45
      },
      {
        id: 2,
        title: 'TypeScript 最佳实践指南',
        slug: 'typescript-best-practices-guide',
        excerpt: '总结 TypeScript 开发中的最佳实践，包括类型定义、泛型使用、配置优化等方面的经验分享。',
        content: '# TypeScript 最佳实践指南\n\nTypeScript 作为 JavaScript 的超集...',
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        category: '技术',
        tags: 'TypeScript,JavaScript,编程',
        published: true,
        featured: false,
        publishedAt: '2024-01-10T14:30:00Z',
        createdAt: '2024-01-10T14:00:00Z',
        updatedAt: '2024-01-10T14:30:00Z',
        readTime: 12,
        views: 890,
        likes: 32
      },
      {
        id: 3,
        title: '现代前端开发工具链',
        slug: 'modern-frontend-toolchain',
        excerpt: '探索现代前端开发中的工具链选择，包括构建工具、包管理器、代码质量工具等。',
        content: '# 现代前端开发工具链\n\n随着前端技术的快速发展...',
        coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        category: '技术',
        tags: '前端开发,工具链,构建工具',
        published: false,
        featured: false,
        publishedAt: null,
        createdAt: '2024-01-08T16:00:00Z',
        updatedAt: '2024-01-08T16:30:00Z',
        readTime: 10,
        views: 0,
        likes: 0
      }
    ]

    // 计算统计数据
    const stats = {
      total: articles.length,
      published: articles.filter(article => article.published).length,
      draft: articles.filter(article => !article.published).length,
      featured: articles.filter(article => article.featured).length
    }

    return {
      success: true,
      data: {
        articles,
        stats
      }
    }
  } catch (error: any) {
    console.error('获取文章列表失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})