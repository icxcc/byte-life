<template>
  <div class="container-custom py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gradient mb-8">我的项目</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-12">
        这里展示我的一些项目作品和技术实践。
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in projects" :key="project.id" class="card p-6">
          <h3 class="text-xl font-semibold mb-3">{{ project.title }}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tech in project.technologies" :key="tech" 
                  class="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-sm">
              {{ tech }}
            </span>
          </div>
          <NuxtLink :to="`/projects/${project.id}`" class="btn btn-primary">
            查看详情
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: projects } = await $fetch('/api/public/projects')

useSEO({
  title: '我的项目',
  description: '展示我的项目作品和技术实践'
})
</script>