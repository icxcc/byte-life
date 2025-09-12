import { supabase, supabaseAdmin } from '~/lib/supabase'

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

    // 检查是否已有数据
    const { data: existingChannels } = await supabase
      .from('channels')
      .select('id')
      .limit(1)

    if (existingChannels && existingChannels.length > 0) {
      return {
        success: true,
        message: '数据已存在，无需重复初始化'
      }
    }

    // 创建示例栏目
    const channelsData = [
      {
        name: '技术博客',
        slug: 'tech',
        description: '分享技术相关的文章和教程',
        sort_order: 1,
        is_active: true
      },
      {
        name: '生活随笔',
        slug: 'life',
        description: '记录生活中的点点滴滴',
        sort_order: 2,
        is_active: true
      },
      {
        name: '项目展示',
        slug: 'projects',
        description: '展示个人或团队项目',
        sort_order: 3,
        is_active: true
      },
      {
        name: '学习笔记',
        slug: 'notes',
        description: '学习过程中的笔记和总结',
        sort_order: 4,
        is_active: true
      }
    ]

    const { data: channels, error: channelsError } = await supabase
      .from('channels')
      .insert(channelsData)
      .select()

    if (channelsError) {
      throw new Error(`创建栏目失败: ${channelsError.message}`)
    }

    // 获取技术博客栏目ID
    const techChannel = channels.find(c => c.slug === 'tech')
    const lifeChannel = channels.find(c => c.slug === 'life')
    const projectsChannel = channels.find(c => c.slug === 'projects')

    // 创建示例文章
    const articlesData = [
      {
        title: 'Vue 3 组合式 API 完全指南',
        slug: 'vue3-composition-api-guide',
        content: `# Vue 3 组合式 API 完全指南

Vue 3 引入了组合式 API，这是一个全新的 API 风格，让我们能够更好地组织和复用代码逻辑。

## 什么是组合式 API？

组合式 API 是一套基于函数的 API，让我们能够更灵活地组织组件逻辑。与选项式 API 不同，组合式 API 将相关的逻辑组织在一起。

## 基本用法

\`\`\`javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
\`\`\`

## 优势

1. **更好的逻辑复用**：通过组合函数可以轻松复用逻辑
2. **更好的类型推导**：TypeScript 支持更好
3. **更灵活的代码组织**：相关逻辑可以组织在一起

这只是组合式 API 的冰山一角，还有更多强大的功能等待探索！`,
        excerpt: 'Vue 3 组合式 API 是一个革命性的功能，让我们能够更好地组织和复用代码逻辑。本文将详细介绍其用法和优势。',
        channel_id: techChannel?.id,
        author: user.email || user.id,
        status: 'published',
        featured: true,
        tags: ['Vue3', 'JavaScript', '前端开发', '组合式API'],
        read_time: 8,
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Nuxt.js 4.0 新特性解析',
        slug: 'nuxtjs-4-new-features',
        content: `# Nuxt.js 4.0 新特性解析

Nuxt.js 4.0 带来了许多令人兴奋的新特性和改进，让全栈开发变得更加简单和高效。

## 主要新特性

### 1. 改进的服务端渲染
- 更快的冷启动时间
- 优化的内存使用
- 更好的错误处理

### 2. 新的文件系统路由
- 支持嵌套路由
- 动态路由改进
- 更灵活的路由配置

### 3. 内置的状态管理
- 无需额外配置
- 类型安全
- 服务端和客户端同步

## 迁移指南

从 Nuxt 3 迁移到 Nuxt 4 相对简单，主要需要注意以下几点：

1. 更新依赖版本
2. 检查配置文件
3. 测试现有功能

总的来说，Nuxt.js 4.0 是一个值得升级的版本！`,
        excerpt: 'Nuxt.js 4.0 发布了！本文详细解析了新版本的主要特性和改进，以及从旧版本的迁移指南。',
        channel_id: techChannel?.id,
        author: user.email || user.id,
        status: 'published',
        featured: false,
        tags: ['Nuxt.js', 'Vue.js', '全栈开发', 'SSR'],
        read_time: 6,
        published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: '我的编程学习之路',
        slug: 'my-programming-journey',
        content: `# 我的编程学习之路

回顾自己的编程学习历程，从最初的懵懂无知到现在能够独立开发项目，这一路走来充满了挑战和收获。

## 起步阶段

最开始接触编程是在大学时期，第一门语言是 C++。那时候对指针、内存管理等概念完全摸不着头脑，经常为了一个小 bug 调试到深夜。

## 转向 Web 开发

后来发现了 Web 开发的魅力，开始学习 HTML、CSS 和 JavaScript。第一次看到自己写的代码在浏览器中运行时，那种成就感至今难忘。

## 框架学习

随着项目复杂度的增加，开始学习各种框架：
- React：组件化思想的启蒙
- Vue：渐进式框架的优雅
- Node.js：全栈开发的可能

## 持续学习

编程是一个需要持续学习的领域，技术更新很快，但基础知识是不变的。保持好奇心和学习热情是最重要的。

希望我的经历能给正在学习编程的朋友一些启发！`,
        excerpt: '分享我从编程小白到能够独立开发项目的学习历程，希望能给正在学习编程的朋友一些启发和帮助。',
        channel_id: lifeChannel?.id,
        author: user.email || user.id,
        status: 'published',
        featured: false,
        tags: ['编程学习', '个人成长', '经验分享'],
        read_time: 5,
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: '个人博客系统开发记录',
        slug: 'personal-blog-development',
        content: `# 个人博客系统开发记录

最近完成了一个基于 Nuxt.js 的个人博客系统，记录一下开发过程中的一些思考和技术选择。

## 技术栈选择

### 前端
- **Nuxt.js 4.0**：全栈框架，支持 SSR
- **Vue 3**：响应式框架
- **Tailwind CSS**：原子化 CSS 框架
- **TypeScript**：类型安全

### 后端
- **Supabase**：后端即服务，提供数据库和认证
- **PostgreSQL**：关系型数据库

## 主要功能

1. **文章管理**：支持 Markdown 编辑
2. **分类管理**：层级分类系统
3. **用户认证**：基于 Supabase Auth
4. **响应式设计**：适配各种设备

## 开发心得

1. **组件化开发**：将 UI 拆分成可复用的组件
2. **类型安全**：TypeScript 帮助减少运行时错误
3. **性能优化**：利用 Nuxt.js 的 SSR 和缓存机制

## 后续计划

- 添加评论系统
- 集成搜索功能
- 优化 SEO
- 添加数据分析

这个项目让我对全栈开发有了更深的理解！`,
        excerpt: '记录个人博客系统的开发过程，包括技术选择、主要功能实现和开发心得，以及后续的优化计划。',
        channel_id: projectsChannel?.id,
        author: user.email || user.id,
        status: 'draft',
        featured: false,
        tags: ['Nuxt.js', '全栈开发', '博客系统', 'Supabase'],
        read_time: 7
      }
    ]

    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .insert(articlesData)
      .select()

    if (articlesError) {
      throw new Error(`创建文章失败: ${articlesError.message}`)
    }

    // 创建示例联系人
    const contactsData = [
      {
        name: '张三',
        email: 'zhangsan@example.com',
        message: '你好，我对你的博客很感兴趣，希望能够交流学习。',
        read: false
      },
      {
        name: '李四',
        email: 'lisi@example.com',
        message: '看了你的 Vue 3 文章，写得很好！有个问题想请教一下。',
        read: true
      },
      {
        name: '王五',
        email: 'wangwu@example.com',
        message: '希望能够合作开发一个项目，请联系我。',
        read: false
      }
    ]

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(contactsData)
      .select()

    if (contactsError) {
      throw new Error(`创建联系人失败: ${contactsError.message}`)
    }

    return {
      success: true,
      data: {
        channels: channels.length,
        articles: articles.length,
        contacts: contacts.length
      },
      message: '示例数据创建成功'
    }

  } catch (error: any) {
    console.error('创建示例数据失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || '创建示例数据失败'
    })
  }
})