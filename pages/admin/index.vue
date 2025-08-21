<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 管理员登录界面 -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            管理员登录
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            请输入管理员凭据以访问后台管理系统
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">用户名</label>
              <input
                id="username"
                v-model="loginForm.username"
                name="username"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="用户名"
              >
            </div>
            <div>
              <label for="password" class="sr-only">密码</label>
              <input
                id="password"
                v-model="loginForm.password"
                name="password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="密码"
              >
            </div>
          </div>

          <div v-if="loginError" class="text-red-600 text-sm text-center">
            {{ loginError }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="isLoading">登录中...</span>
              <span v-else>登录</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 管理员仪表板 -->
    <div v-else class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- 侧边栏 -->
      <div class="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div class="p-6">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">管理后台</h1>
        </div>
        <nav class="mt-6">
          <div class="px-6 py-3">
            <button
              v-for="item in menuItems"
              :key="item.key"
              @click="switchTab(item.key)"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors',
                activeTab === item.key
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <Icon :name="item.icon" class="inline-block w-5 h-5 mr-3" />
              {{ item.label }}
            </button>
          </div>
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="inline-block w-5 h-5 mr-3" />
              退出登录
            </button>
          </div>
        </nav>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 overflow-hidden">
        <div class="p-8">
          <!-- 加载状态 -->
          <div v-if="dataLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>

          <!-- 仪表板概览 -->
          <div v-else-if="activeTab === 'dashboard'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">仪表板概览</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div class="flex items-center">
                  <Icon name="heroicons:envelope" class="w-8 h-8 text-blue-500" />
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">未读消息</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.unreadMessages }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div class="flex items-center">
                  <Icon name="heroicons:folder" class="w-8 h-8 text-green-500" />
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">项目数量</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.projectCount }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div class="flex items-center">
                  <Icon name="heroicons:document-text" class="w-8 h-8 text-purple-500" />
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">博客文章</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.blogPosts }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div class="flex items-center">
                  <Icon name="heroicons:eye" class="w-8 h-8 text-orange-500" />
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">今日访问</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.todayVisits }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 消息管理 -->
          <div v-else-if="activeTab === 'messages'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">消息管理</h2>
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">联系消息</h3>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="message in messages" :key="message.id" class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ message.name }}</h4>
                        <span class="ml-2 text-sm text-gray-500">{{ message.email }}</span>
                        <span v-if="!message.read" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          未读
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ message.message }}</p>
                      <p class="mt-1 text-xs text-gray-500">{{ formatDate(message.createdAt) }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        v-if="!message.read"
                        @click="markAsRead(message.id)"
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        标记已读
                      </button>
                      <button
                        @click="deleteMessage(message.id)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 项目管理 -->
          <div v-else-if="activeTab === 'projects'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">项目管理</h2>
              <button
                @click="showProjectForm = true"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                添加项目
              </button>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">项目名称</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">技术栈</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">状态</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="project in projects" :key="project.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {{ project.title }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ project.tech.join(', ') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {{ project.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 mr-4">编辑</button>
                      <button class="text-red-600 hover:text-red-900 dark:text-red-400">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 博客管理 -->
          <div v-else-if="activeTab === 'blog'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">博客管理</h2>
              <button
                @click="showBlogForm = true"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                写文章
              </button>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章列表</h3>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="post in blogPosts" :key="post.id" class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ post.title }}</h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ post.excerpt }}</p>
                      <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{{ formatDate(post.createdAt) }}</span>
                        <span>{{ post.category }}</span>
                        <span>{{ post.readTime }} 分钟阅读</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">编辑</button>
                      <button class="text-red-600 hover:text-red-900 dark:text-red-400">删除</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统设置 -->
          <div v-else-if="activeTab === 'settings'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h2>
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
                  <button
                    @click="saveSettings"
                    class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: false
})

// 响应式数据
const isAuthenticated = ref(false)
const isLoading = ref(false)
const dataLoading = ref(false)
const loginError = ref('')
const activeTab = ref('dashboard')
const showProjectForm = ref(false)
const showBlogForm = ref(false)

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 菜单项
const menuItems = [
  { key: 'dashboard', label: '仪表板', icon: 'heroicons:home' },
  { key: 'messages', label: '消息管理', icon: 'heroicons:envelope' },
  { key: 'projects', label: '项目管理', icon: 'heroicons:folder' },
  { key: 'blog', label: '博客管理', icon: 'heroicons:document-text' },
  { key: 'settings', label: '系统设置', icon: 'heroicons:cog-6-tooth' }
]

// 统计数据
const stats = ref({
  unreadMessages: 0,
  projectCount: 0,
  blogPosts: 0,
  todayVisits: 156
})

// 数据存储
const messages = ref([])
const projects = ref([])
const blogPosts = ref([])

// 系统设置
const settings = ref({
  siteTitle: 'ByteLife - 个人网站',
  siteDescription: '一个展示个人技能和项目的现代化网站'
})

// 登录处理
const handleLogin = async () => {
  isLoading.value = true
  loginError.value = ''

  try {
    const response = await $fetch('/api/admin/auth', {
      method: 'POST',
      body: {
        username: loginForm.value.username,
        password: loginForm.value.password
      }
    })

    if (response.success) {
      isAuthenticated.value = true
      await loadDashboardData()
    }
  } catch (error: any) {
    loginError.value = error.data?.message || '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    isAuthenticated.value = false
    loginForm.value = { username: '', password: '' }
    activeTab.value = 'dashboard'
  }
}

// 切换标签页
const switchTab = async (tab: string) => {
  activeTab.value = tab
  await loadTabData(tab)
}

// 加载标签页数据
const loadTabData = async (tab: string) => {
  dataLoading.value = true
  try {
    switch (tab) {
      case 'messages':
        await loadMessages()
        break
      case 'projects':
        await loadProjects()
        break
      case 'blog':
        await loadBlog()
        break
      case 'dashboard':
        await loadDashboardData()
        break
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    dataLoading.value = false
  }
}

// 加载仪表板数据
const loadDashboardData = async () => {
  try {
    await Promise.all([
      loadMessages(),
      loadProjects(),
      loadBlog()
    ])
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
  }
}

// 加载消息数据
const loadMessages = async () => {
  try {
    const response = await $fetch('/api/admin/messages')
    if (response.success) {
      messages.value = response.data.messages
      stats.value.unreadMessages = response.data.stats.unread
    }
  } catch (error) {
    console.error('加载消息失败:', error)
  }
}

// 加载项目数据
const loadProjects = async () => {
  try {
    const response = await $fetch('/api/admin/projects')
    if (response.success) {
      projects.value = response.data.projects
      stats.value.projectCount = response.data.stats.total
    }
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

// 加载博客数据
const loadBlog = async () => {
  try {
    const response = await $fetch('/api/admin/blog')
    if (response.success) {
      blogPosts.value = response.data.posts
      stats.value.blogPosts = response.data.stats.total
    }
  } catch (error) {
    console.error('加载博客失败:', error)
  }
}

// 标记消息为已读
const markAsRead = async (messageId: number) => {
  try {
    await $fetch(`/api/admin/messages/${messageId}`, {
      method: 'PATCH',
      body: { read: true }
    })
    
    const message = messages.value.find((m: any) => m.id === messageId)
    if (message) {
      message.read = true
      stats.value.unreadMessages--
    }
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

// 删除消息
const deleteMessage = async (messageId: number) => {
  try {
    await $fetch(`/api/admin/messages/${messageId}`, {
      method: 'DELETE'
    })
    
    const index = messages.value.findIndex((m: any) => m.id === messageId)
    if (index > -1) {
      const message = messages.value[index]
      if (!message.read) {
        stats.value.unreadMessages--
      }
      messages.value.splice(index, 1)
    }
  } catch (error) {
    console.error('删除消息失败:', error)
  }
}

// 保存设置
const saveSettings = () => {
  // 在实际应用中，这里应该调用 API 保存设置
  alert('设置已保存')
}

// 格式化日期
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// 页面标题
useHead({
  title: '管理后台 - ByteLife'
})
</script>