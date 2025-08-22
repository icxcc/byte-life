<template>
  <div class="container-custom py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gradient mb-8">博客文章</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-12">
        分享技术心得、学习笔记和生活感悟。
      </p>
      
      <div class="space-y-8">
        <article v-for="post in posts" :key="post.id" class="card p-6">
          <div class="flex items-center gap-4 mb-4">
            <time class="text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(post.date).toLocaleDateString('zh-CN') }}
            </time>
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-sm">
              {{ post.category }}
            </span>
          </div>
          <h2 class="text-2xl font-semibold mb-3">
            <NuxtLink :to="`/blog/${post.id}`" class="hover:text-primary-600 transition-colors">
              {{ post.title }}
            </NuxtLink>
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ post.excerpt }}</p>
          <NuxtLink :to="`/blog/${post.id}`" class="btn btn-secondary">
            阅读更多
          </NuxtLink>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: posts } = await usePublicApi('/blog/posts').get()

useSEO({
  title: '博客文章',
  description: '分享技术心得、学习笔记和生活感悟'
})
</script>