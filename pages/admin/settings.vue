<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h2>
    
    <!-- 网站配置 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">网站配置</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">网站标题</label>
          <input
            v-model="settings.siteTitle"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">网站描述</label>
          <textarea
            v-model="settings.siteDescription"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">网站关键词</label>
          <input
            v-model="settings.siteKeywords"
            type="text"
            placeholder="用逗号分隔多个关键词"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
      </div>
    </div>

    <!-- 联系信息 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">联系信息</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">邮箱地址</label>
          <input
            v-model="settings.contactEmail"
            type="email"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">电话号码</label>
          <input
            v-model="settings.contactPhone"
            type="tel"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">地址</label>
          <input
            v-model="settings.contactAddress"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
      </div>
    </div>

    <!-- 社交媒体 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">社交媒体</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
          <input
            v-model="settings.socialGithub"
            type="url"
            placeholder="https://github.com/username"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
          <input
            v-model="settings.socialLinkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</label>
          <input
            v-model="settings.socialTwitter"
            type="url"
            placeholder="https://twitter.com/username"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">微信</label>
          <input
            v-model="settings.socialWechat"
            type="text"
            placeholder="微信号"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end">
      <button
        @click="saveSettings"
        :disabled="isSaving"
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSaving">保存中...</span>
        <span v-else>保存设置</span>
      </button>
    </div>

    <!-- 保存成功提示 -->
    <div v-if="saveMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      {{ saveMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: 'admin'
})

// 响应式数据
const isSaving = ref(false)
const saveMessage = ref('')

// 系统设置
const settings = ref({
  siteTitle: 'ByteLife - 个人网站',
  siteDescription: '一个展示个人技能和项目的现代化网站',
  siteKeywords: 'Web开发,前端,后端,全栈,技术博客',
  contactEmail: 'contact@example.com',
  contactPhone: '+86 123 4567 8910',
  contactAddress: '北京市朝阳区某某街道123号',
  socialGithub: '',
  socialLinkedin: '',
  socialTwitter: '',
  socialWechat: ''
})

// 保存设置
const saveSettings = async () => {
  isSaving.value = true
  
  try {
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 在实际应用中，这里应该调用 API 保存设置
    // await $fetch('/api/admin/settings', {
    //   method: 'POST',
    //   body: settings.value
    // })
    
    saveMessage.value = '设置保存成功！'
    
    // 3秒后清除提示消息
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('保存设置失败:', error)
    saveMessage.value = '保存失败，请重试'
    
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } finally {
    isSaving.value = false
  }
}

// SEO
useHead({
  title: '系统设置 - 管理后台'
})
</script>