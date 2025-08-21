<template>
  <div class="container-custom py-12">
    <div class="max-w-4xl mx-auto">
      <NuxtLink to="/projects" class="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
        ← 返回项目列表
      </NuxtLink>
      
      <div class="card p-8">
        <h1 class="text-4xl font-bold text-gradient mb-6">项目详情 #{{ $route.params.id }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          这里是项目 {{ $route.params.id }} 的详细介绍页面。
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">项目信息</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>项目ID:</strong> {{ $route.params.id }}</li>
              <li><strong>开发时间:</strong> 2024年</li>
              <li><strong>技术栈:</strong> Vue.js, Nuxt.js, Tailwind CSS</li>
              <li><strong>状态:</strong> 已完成</li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-4">项目特色</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• 响应式设计</li>
              <li>• 现代化UI界面</li>
              <li>• 高性能优化</li>
              <li>• SEO友好</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSEO({
  title: `项目详情 #${useRoute().params.id}`,
  description: `项目 ${useRoute().params.id} 的详细介绍`
})
</script>