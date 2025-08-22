<template>
  <div class="container-custom py-12">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">联系我</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- 联系表单 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">发送消息</h2>
        <form @submit.prevent="submitForm">
          <!-- 提交状态消息 -->
          <div v-if="submitMessage" class="mb-4 p-4 rounded-md" :class="{
            'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800': submitType === 'success',
            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800': submitType === 'error'
          }">
            {{ submitMessage }}
          </div>

          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              姓名 <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name"
              class="input"
              placeholder="请输入您的姓名"
              required
            />
          </div>
          
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱 <span class="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email"
              class="input"
              placeholder="请输入您的邮箱地址"
              required
            />
          </div>
          
          <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              主题 <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject"
              class="input"
              placeholder="请输入消息主题"
              required
            />
          </div>
          
          <div class="mb-6">
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              消息 <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="message" 
              v-model="form.message"
              rows="5" 
              class="input resize-none"
              placeholder="请输入您想要发送的消息内容..."
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-full"
            :disabled="isSubmitting"
            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              发送中...
            </span>
            <span v-else>发送消息</span>
          </button>
        </form>
      </div>
      
      <!-- 联系信息 -->
      <div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">联系方式</h2>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">邮箱</h3>
                <p class="text-gray-600 dark:text-gray-400">contact@example.com</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">电话</h3>
                <p class="text-gray-600 dark:text-gray-400">+86 123 4567 8910</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">地址</h3>
                <p class="text-gray-600 dark:text-gray-400">北京市朝阳区某某街道123号</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 社交媒体 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">社交媒体</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <a href="#" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg class="h-6 w-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <span class="ml-3 text-gray-700 dark:text-gray-300">Twitter</span>
            </a>
            
            <a href="#" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg class="h-6 w-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span class="ml-3 text-gray-700 dark:text-gray-300">LinkedIn</span>
            </a>
            
            <a href="#" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg class="h-6 w-6 text-[#333]" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              <span class="ml-3 text-gray-700 dark:text-gray-300">GitHub</span>
            </a>
            
            <a href="#" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg class="h-6 w-6 text-[#07C160]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.012.806-.037a.59.59 0 01.107 1.173 11.576 11.576 0 01-1.194.06c-.384 0-.768-.02-1.15-.06l.172.77c.46.026.924.04 1.394.04 4.45 0 8.061-2.996 8.061-6.708 0-3.712-3.611-6.709-8.06-6.709h-.11c-.057 0-.11.006-.166.007zm11.964 7.805c0 3.075-2.987 5.561-6.648 5.561a7.44 7.44 0 01-1.256-.108l-.01-.002a.314.314 0 00-.3.082l-1.337.784a.24.24 0 01-.119.035.207.207 0 01-.206-.205c0-.054.02-.104.035-.151l.273-1.041a.413.413 0 00-.15-.467 5.614 5.614 0 01-2.21-4.494c0-3.074 2.986-5.56 6.648-5.56 3.66 0 6.647 2.486 6.647 5.56h.033zm-8.773-2.432c0 .473-.388.858-.865.858a.862.862 0 01-.866-.858c0-.473.388-.858.866-.858s.865.385.865.858zm4.252 0c0 .473-.388.858-.866.858a.862.862 0 01-.865-.858c0-.473.388-.858.865-.858s.866.385.866.858z" />
              </svg>
              <span class="ml-3 text-gray-700 dark:text-gray-300">微信</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 表单数据
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// 表单状态
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitType = ref('') // 'success' or 'error'

// 表单验证
const validateForm = () => {
  if (!form.value.name.trim()) {
    return '请输入您的姓名'
  }
  if (!form.value.email.trim()) {
    return '请输入您的邮箱'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    return '请输入有效的邮箱地址'
  }
  if (!form.value.subject.trim()) {
    return '请输入消息主题'
  }
  if (!form.value.message.trim()) {
    return '请输入您的消息内容'
  }
  return null
}

// 提交表单
const submitForm = async () => {
  const error = validateForm()
  if (error) {
    submitMessage.value = error
    submitType.value = 'error'
    return
  }

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    // 调用API提交表单
    const { post } = usePublicApi('/contact')
    const response = await post(formData.value)

    submitMessage.value = response.message || '消息发送成功！我会尽快回复您。'
    submitType.value = 'success'
    
    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    console.error('表单提交错误:', error)
    submitMessage.value = error.data?.message || '发送失败，请稍后重试。'
    submitType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

// SEO设置
useSEO({
  title: '联系我',
  description: '通过联系表单与我取得联系，或查看我的联系方式和社交媒体。'
})
</script>
