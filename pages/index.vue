<template>
  <div>
    <!-- 英雄区域 -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">欢迎来到字节生活</h1>
          <p class="text-xl mb-8">个人网站，展示作品、博客和在线互动功能</p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/projects" class="btn bg-white text-primary-700 hover:bg-gray-100">
              查看作品
            </NuxtLink>
            <NuxtLink to="/blog" class="btn bg-transparent border-2 border-white hover:bg-white hover:text-primary-700">
              阅读博客
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色内容 -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">我能做什么</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 特色卡片 1 -->
          <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div class="text-primary-600 dark:text-primary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">网站开发</h3>
            <p class="text-gray-600 dark:text-gray-400">
              使用现代技术栈构建响应式、高性能的网站和Web应用程序。
            </p>
          </div>

          <!-- 特色卡片 2 -->
          <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div class="text-primary-600 dark:text-primary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">UI/UX 设计</h3>
            <p class="text-gray-600 dark:text-gray-400">
              创建直观、美观且用户友好的界面设计，提升用户体验。
            </p>
          </div>

          <!-- 特色卡片 3 -->
          <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div class="text-primary-600 dark:text-primary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">内容创作</h3>
            <p class="text-gray-600 dark:text-gray-400">
              撰写技术博客、教程和文档，分享知识和经验。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新项目 -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container-custom">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">最新项目</h2>
          <NuxtLink to="/projects" class="text-primary-600 dark:text-primary-400 hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 项目卡片 1 -->
          <div class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
            <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">项目名称</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                项目简短描述，介绍项目的主要功能和特点。
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Vue.js</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Tailwind</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Supabase</span>
              </div>
              <NuxtLink to="/projects/1" class="text-primary-600 dark:text-primary-400 hover:underline">
                查看详情 →
              </NuxtLink>
            </div>
          </div>

          <!-- 项目卡片 2 -->
          <div class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
            <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">项目名称</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                项目简短描述，介绍项目的主要功能和特点。
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">React</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Next.js</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Firebase</span>
              </div>
              <NuxtLink to="/projects/2" class="text-primary-600 dark:text-primary-400 hover:underline">
                查看详情 →
              </NuxtLink>
            </div>
          </div>

          <!-- 项目卡片 3 -->
          <div class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
            <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">项目名称</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                项目简短描述，介绍项目的主要功能和特点。
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Node.js</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">Express</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded">MongoDB</span>
              </div>
              <NuxtLink to="/projects/3" class="text-primary-600 dark:text-primary-400 hover:underline">
                查看详情 →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新博客 -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">最新博客</h2>
          <NuxtLink to="/blog" class="text-primary-600 dark:text-primary-400 hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 博客卡片 1 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">2025年8月15日</div>
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">博客标题</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                博客摘要，简短介绍博客的主要内容和观点。这里可以放置一些吸引读者的内容。
              </p>
              <NuxtLink to="/blog/1" class="text-primary-600 dark:text-primary-400 hover:underline">
                阅读更多 →
              </NuxtLink>
            </div>
          </div>

          <!-- 博客卡片 2 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">2025年8月10日</div>
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">博客标题</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                博客摘要，简短介绍博客的主要内容和观点。这里可以放置一些吸引读者的内容。
              </p>
              <NuxtLink to="/blog/2" class="text-primary-600 dark:text-primary-400 hover:underline">
                阅读更多 →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系区域 -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">联系我</h2>
          <p class="text-xl mb-8 text-gray-600 dark:text-gray-400">
            有任何问题或合作意向？请随时联系我。
          </p>
          <NuxtLink to="/contact" class="btn btn-primary">
            发送消息
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 使用 Nuxt 4.0 的 SEO 优化
useSEO({
  title: '首页',
  description: '字节生活个人网站首页，展示最新项目和博客文章',
  type: 'website'
})

// 使用 Nuxt 4.0 的数据获取
const { data: projects } = await useLazyFetch('/api/public/projects', {
  default: () => [],
  server: false
})

const { data: posts } = await useLazyFetch('/api/public/blog/posts', {
  default: () => [],
  server: false
})

// 使用主题功能
const { isDark } = useTheme()

// 页面动画
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})
</script>
