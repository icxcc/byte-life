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
              <label for="email" class="sr-only">邮箱</label>
              <input
                id="email"
                v-model="loginForm.email"
                name="email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="邮箱地址"
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

          <div class="space-y-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="isLoading">登录中...</span>
              <span v-else>登录</span>
            </button>
            
            <div class="text-center space-y-2">
              <div>
                <NuxtLink to="/admin/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  忘记密码？
                </NuxtLink>
              </div>
              <div>
                <NuxtLink to="/admin/register" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  还没有账户？立即注册
                </NuxtLink>
              </div>
            </div>
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
                @click="openProjectEditor()"
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
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ project.title }}</div>
                        <span v-if="project.featured" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          推荐
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ Array.isArray(project.tech) ? project.tech.join(', ') : project.technologies?.join(', ') || '' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(project.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ project.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="openProjectEditor(project)"
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 mr-4"
                      >
                        编辑
                      </button>
                      <button 
                        @click="deleteProject(project.id)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        删除
                      </button>
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
                @click="openArticleEditor()"
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
                      <div class="flex items-center space-x-2">
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ post.title }}</h4>
                        <span v-if="post.published" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          已发布
                        </span>
                        <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                          草稿
                        </span>
                        <span v-if="post.featured" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          推荐
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ post.excerpt }}</p>
                      <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{{ formatDate(post.createdAt) }}</span>
                        <span>{{ post.category }}</span>
                        <span>{{ post.readTime }} 分钟阅读</span>
                        <span>{{ post.views }} 次浏览</span>
                        <span>{{ post.likes }} 个赞</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="openArticleEditor(post)"
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                      >
                        编辑
                      </button>
                      <button 
                        @click="deleteArticle(post.id)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        删除
                      </button>
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

    <!-- 文章编辑器 -->
    <ArticleEditor
      v-if="showArticleEditor"
      :article="currentArticle"
      :is-edit="!!currentArticle"
      @close="closeArticleEditor"
      @save="saveArticle"
    />

    <!-- 项目编辑器 -->
    <ProjectEditor
      v-if="showProjectEditor"
      :project="currentProject"
      :is-edit="!!currentProject"
      @close="closeProjectEditor"
      @save="saveProject"
    />
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 页面元数据
definePageMeta({
  layout: false
})

// 响应式数据
const user = ref<any>(null)
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(false)
const dataLoading = ref(false)
const loginError = ref('')
const activeTab = ref('dashboard')
const showArticleEditor = ref(false)
const showProjectEditor = ref(false)
const currentArticle = ref(null)
const currentProject = ref(null)

// 登录表单
const loginForm = ref({
  email: '',
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

// 存储当前会话信息
const currentSession = ref<any>(null)

// 登录处理
const handleLogin = async () => {
  isLoading.value = true
  loginError.value = ''

  try {
    // 使用 Supabase Authentication 登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    if (error) {
      throw error
    }

    if (data.user) {
      user.value = data.user
      currentSession.value = data.session
      await loadDashboardData()
    }
  } catch (error: any) {
    loginError.value = error.message || '邮箱或密码错误'
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    // 使用 Supabase 退出登录
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('退出登录失败:', error)
      throw error
    }
    
    // 清理本地状态
    user.value = null
    currentSession.value = null
    loginForm.value = { email: '', password: '' }
    activeTab.value = 'dashboard'
    
    // 清理数据
    messages.value = []
    projects.value = []
    blogPosts.value = []
    stats.value = {
      unreadMessages: 0,
      projectCount: 0,
      blogPosts: 0,
      todayVisits: 156
    }
    
    console.log('退出登录成功')
  } catch (error) {
    console.error('退出登录失败:', error)
    // 即使 Supabase 退出失败，也要清理本地状态
    user.value = null
    currentSession.value = null
    loginForm.value = { email: '', password: '' }
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

// 获取认证令牌
const getAuthToken = async () => {
  if (currentSession.value?.access_token) {
    return currentSession.value.access_token
  }
  
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// 加载消息数据
const loadMessages = async () => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    const response = await $fetch('/api/admin/messages', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    const response = await $fetch('/api/admin/projects', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    const response = await $fetch('/api/admin/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.success) {
      blogPosts.value = response.data.articles
      stats.value.blogPosts = response.data.stats.total
    }
  } catch (error) {
    console.error('加载博客失败:', error)
  }
}

// 打开文章编辑器
const openArticleEditor = (article = null) => {
  currentArticle.value = article
  showArticleEditor.value = true
}

// 关闭文章编辑器
const closeArticleEditor = () => {
  showArticleEditor.value = false
  currentArticle.value = null
}

// 保存文章
const saveArticle = async (articleData) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    if (currentArticle.value) {
      // 更新文章
      await $fetch(`/api/admin/articles/${currentArticle.value.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: articleData
      })
    } else {
      // 创建文章
      await $fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: articleData
      })
    }

    // 重新加载文章列表
    await loadBlog()
  } catch (error) {
    console.error('保存文章失败:', error)
  }
}

// 删除文章
const deleteArticle = async (articleId) => {
  if (!confirm('确定要删除这篇文章吗？')) {
    return
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // 重新加载文章列表
    await loadBlog()
  } catch (error) {
    console.error('删除文章失败:', error)
  }
}

// 打开项目编辑器
const openProjectEditor = (project = null) => {
  currentProject.value = project
  showProjectEditor.value = true
}

// 关闭项目编辑器
const closeProjectEditor = () => {
  showProjectEditor.value = false
  currentProject.value = null
}

// 保存项目
const saveProject = async (projectData) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    if (currentProject.value) {
      // 更新项目
      await $fetch(`/api/admin/projects/${currentProject.value.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: projectData
      })
    } else {
      // 创建项目
      await $fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: projectData
      })
    }

    // 重新加载项目列表
    await loadProjects()
  } catch (error) {
    console.error('保存项目失败:', error)
  }
}

// 删除项目
const deleteProject = async (projectId) => {
  if (!confirm('确定要删除这个项目吗？')) {
    return
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // 重新加载项目列表
    await loadProjects()
  } catch (error) {
    console.error('删除项目失败:', error)
  }
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusClasses = {
    '进行中': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    '已完成': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    '暂停': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    '计划中': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return statusClasses[status] || statusClasses['进行中']
}

// 标记消息为已读
const markAsRead = async (messageId: number) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/messages/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

// 初始化认证状态
onMounted(async () => {
  // 获取当前会话
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    currentSession.value = session
    await loadDashboardData()
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('认证状态变化:', event, session?.user?.email)
    
    if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
      currentSession.value = session
      await loadDashboardData()
    } else if (event === 'SIGNED_OUT' || !session) {
      // 清理所有状态
      user.value = null
      currentSession.value = null
      activeTab.value = 'dashboard'
      loginForm.value = { email: '', password: '' }
      
      // 清理数据
      messages.value = []
      projects.value = []
      blogPosts.value = []
      stats.value = {
        unreadMessages: 0,
        projectCount: 0,
        blogPosts: 0,
        todayVisits: 156
      }
    }
  })
})

// 页面标题
useHead({
  title: '管理后台 - ByteLife'
})
</script>