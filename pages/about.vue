<template>
  <div class="container-custom py-12">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">关于我</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/3">
          <div class="bg-gray-200 dark:bg-gray-700 h-64 w-64 rounded-lg mx-auto"></div>
        </div>
        <div class="md:w-2/3">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">个人简介</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            你好！我是一名热爱技术的全栈开发者，专注于创建美观、高效且用户友好的Web应用程序。
            我拥有多年的开发经验，熟悉现代前端和后端技术栈。
          </p>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            我喜欢解决复杂问题，并且不断学习新技术来提升自己的技能。在空闲时间，我喜欢写技术博客，
            分享我的知识和经验，同时也参与开源项目的贡献。
          </p>
          <div class="flex gap-4 mt-6">
            <button @click="downloadResume" class="btn btn-primary" :disabled="isDownloading">
              <span v-if="isDownloading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                下载中...
              </span>
              <span v-else>下载简历</span>
            </button>
            <NuxtLink to="/contact" class="btn btn-secondary">联系我</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 技能部分 -->
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">我的技能</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <!-- 技能卡片 - 前端开发 -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">前端开发</h3>
        <ul class="space-y-2">
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">HTML/CSS</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 95%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">JavaScript</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 90%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Vue.js</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 85%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">React</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Tailwind CSS</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 90%"></div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- 技能卡片 - 后端开发 -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">后端开发</h3>
        <ul class="space-y-2">
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Node.js</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 85%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Express</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Python</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 75%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">SQL</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 85%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">MongoDB</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- 技能卡片 - 其他技能 -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">其他技能</h3>
        <ul class="space-y-2">
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Git</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 90%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">Docker</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 75%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">CI/CD</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">UI/UX 设计</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 70%"></div>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-32 text-gray-600 dark:text-gray-400">SEO</span>
            <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 75%"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 经历时间线 -->
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">教育与工作经历</h2>
    <div class="space-y-8 mb-12">
      <!-- 时间线项目 1 -->
      <div class="flex">
        <div class="flex flex-col items-center mr-6">
          <div class="w-4 h-4 bg-primary-600 rounded-full"></div>
          <div class="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">高级前端开发工程师</h3>
            <span class="text-gray-500 dark:text-gray-400">2023 - 至今</span>
          </div>
          <h4 class="text-primary-600 dark:text-primary-400 mb-4">某科技公司</h4>
          <p class="text-gray-600 dark:text-gray-400">
            负责公司核心产品的前端开发，使用Vue.js和Tailwind CSS构建高性能、响应式的用户界面。
            优化前端性能，提升用户体验，并与后端团队协作实现新功能。
          </p>
        </div>
      </div>
      
      <!-- 时间线项目 2 -->
      <div class="flex">
        <div class="flex flex-col items-center mr-6">
          <div class="w-4 h-4 bg-primary-600 rounded-full"></div>
          <div class="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Web开发工程师</h3>
            <span class="text-gray-500 dark:text-gray-400">2020 - 2023</span>
          </div>
          <h4 class="text-primary-600 dark:text-primary-400 mb-4">某互联网公司</h4>
          <p class="text-gray-600 dark:text-gray-400">
            参与多个Web应用项目的开发，使用React和Node.js构建全栈应用。
            负责前端界面设计和实现，以及部分后端API开发。
          </p>
        </div>
      </div>
      
      <!-- 时间线项目 3 -->
      <div class="flex">
        <div class="flex flex-col items-center mr-6">
          <div class="w-4 h-4 bg-primary-600 rounded-full"></div>
          <div class="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">计算机科学学士</h3>
            <span class="text-gray-500 dark:text-gray-400">2016 - 2020</span>
          </div>
          <h4 class="text-primary-600 dark:text-primary-400 mb-4">某知名大学</h4>
          <p class="text-gray-600 dark:text-gray-400">
            主修计算机科学，专注于Web开发和软件工程。
            参与多个学生项目，并获得优秀毕业生称号。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 下载状态
const isDownloading = ref(false)

// 下载简历功能
const downloadResume = async () => {
  isDownloading.value = true
  
  try {
    // 调用API获取简历数据
    const resumeData = await $fetch('/api/resume')
    
    // 创建下载链接
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    
    // 创建临时下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = `resume-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('简历下载失败:', error)
    // 这里可以添加错误提示
  } finally {
    isDownloading.value = false
  }
}

// SEO设置
useSEO({
  title: '关于我',
  description: '了解我的技能、经验和背景。全栈开发工程师，专注于现代Web技术。'
})
</script>
