/**
 * 博客文章数据 API - 使用 Nuxt 4.0 的服务器 API
 */
export default defineEventHandler(async (event) => {
  // 模拟博客文章数据
  const posts = [
    {
      id: 1,
      title: 'Nuxt 4.0 新特性深度解析',
      slug: 'nuxt-4-new-features',
      excerpt: '深入了解 Nuxt 4.0 带来的革命性变化，包括新的目录结构、性能优化和开发体验提升。',
      content: '# Nuxt 4.0 新特性\n\nNuxt 4.0 带来了许多令人兴奋的新特性...',
      author: {
        name: '张三',
        avatar: '/images/avatar.jpg'
      },
      publishedAt: '2025-08-15T10:00:00Z',
      updatedAt: '2025-08-15T10:00:00Z',
      tags: ['Nuxt.js', 'Vue.js', 'Web开发'],
      featured: true,
      readTime: 8
    },
    {
      id: 2,
      title: 'TypeScript 在 Vue 3 中的最佳实践',
      slug: 'typescript-vue3-best-practices',
      excerpt: '分享在 Vue 3 项目中使用 TypeScript 的经验和技巧，提高代码质量和开发效率。',
      content: '# TypeScript 最佳实践\n\n在 Vue 3 中使用 TypeScript...',
      author: {
        name: '张三',
        avatar: '/images/avatar.jpg'
      },
      publishedAt: '2025-08-10T14:30:00Z',
      updatedAt: '2025-08-10T14:30:00Z',
      tags: ['TypeScript', 'Vue.js', '最佳实践'],
      featured: true,
      readTime: 12
    },
    {
      id: 3,
      title: '现代前端性能优化指南',
      slug: 'modern-frontend-performance-guide',
      excerpt: '全面的前端性能优化指南，涵盖加载速度、运行时性能和用户体验优化。',
      content: '# 前端性能优化\n\n性能优化是现代前端开发的重要课题...',
      author: {
        name: '张三',
        avatar: '/images/avatar.jpg'
      },
      publishedAt: '2025-08-05T09:15:00Z',
      updatedAt: '2025-08-05T09:15:00Z',
      tags: ['性能优化', 'Web开发', '用户体验'],
      featured: false,
      readTime: 15
    }
  ]

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 150))

  return {
    success: true,
    data: posts,
    total: posts.length
  }
})