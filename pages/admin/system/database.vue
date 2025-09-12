<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">数据库管理</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">管理数据库结构和示例数据</p>
    </div>

    <!-- 数据库状态卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H8c-2.21 0-4-1.79-4-4V7" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">数据库连接</h3>
            <p class="text-sm text-green-600 dark:text-green-400">已连接</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">表结构</h3>
            <p class="text-sm text-green-600 dark:text-green-400">已就绪</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">示例数据</h3>
            <p class="text-sm text-yellow-600 dark:text-yellow-400" v-if="!hasData">未初始化</p>
            <p class="text-sm text-green-600 dark:text-green-400" v-else>已初始化</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据库操作 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">数据库操作</h2>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- 示例数据初始化 -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">初始化示例数据</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                创建示例栏目、文章和联系人数据，用于测试和演示。
              </p>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                包含：4个栏目、4篇文章、3个联系人
              </div>
            </div>
            <div class="ml-4">
              <UiButton
                @click="initializeSampleData"
                :loading="initializing"
                :disabled="hasData"
                variant="primary"
              >
                {{ initializing ? '初始化中...' : '初始化数据' }}
              </UiButton>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4">数据统计</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ stats.channels || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">栏目</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ stats.articles || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">文章</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-600">{{ stats.contacts || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">联系人</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ stats.published || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">已发布</div>
            </div>
          </div>
        </div>

        <!-- 数据库架构 -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">数据库架构</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                查看完整的数据库表结构和关系。
              </p>
            </div>
            <div class="ml-4">
              <UiButton
                @click="showSchema = !showSchema"
                variant="outline"
              >
                {{ showSchema ? '隐藏架构' : '查看架构' }}
              </UiButton>
            </div>
          </div>
          
          <div v-if="showSchema" class="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <pre class="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">{{ schemaInfo }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作结果提示 -->
    <div v-if="message" class="rounded-md p-4" :class="messageClass">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg v-if="messageType === 'success'" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium" :class="messageType === 'success' ? 'text-green-800' : 'text-red-800'">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// 响应式数据
const initializing = ref(false)
const showSchema = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const hasData = ref(false)

// 统计数据
const stats = ref({
  channels: 0,
  articles: 0,
  contacts: 0,
  published: 0
})

// 计算属性
const messageClass = computed(() => {
  return messageType.value === 'success' 
    ? 'bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700'
    : 'bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700'
})

// 数据库架构信息
const schemaInfo = `数据库表结构：

1. channels (栏目表)
   - id: UUID (主键)
   - name: 栏目名称
   - slug: URL别名
   - description: 描述
   - parent_id: 父栏目ID
   - sort_order: 排序
   - is_active: 是否启用
   - created_at, updated_at: 时间戳

2. articles (文章表)
   - id: UUID (主键)
   - title: 标题
   - slug: URL别名
   - content: 内容
   - excerpt: 摘要
   - cover_image: 封面图片
   - channel_id: 栏目ID (外键)
   - author: 作者
   - status: 状态 (draft/published/archived)
   - featured: 是否推荐
   - tags: 标签数组
   - meta_title, meta_description: SEO信息
   - read_time: 阅读时间
   - views, likes: 统计数据
   - published_at: 发布时间
   - created_at, updated_at: 时间戳

3. contacts (联系人表)
   - id: UUID (主键)
   - name: 姓名
   - email: 邮箱
   - message: 消息内容
   - read: 是否已读
   - ip_address: IP地址
   - user_agent: 用户代理
   - created_at, updated_at: 时间戳

关系：
- channels.parent_id -> channels.id (自关联)
- articles.channel_id -> channels.id (多对一)`

// 方法
const initializeSampleData = async () => {
  initializing.value = true
  message.value = ''
  
  try {
    const { post } = useAdminApi('/content/seed')
    const response = await post({})
    
    messageType.value = 'success'
    message.value = response.message || '示例数据初始化成功'
    hasData.value = true
    
    // 刷新统计数据
    await loadStats()
  } catch (error: any) {
    messageType.value = 'error'
    message.value = error.data?.message || error.message || '初始化失败'
  } finally {
    initializing.value = false
  }
}

const loadStats = async () => {
  try {
    // 获取栏目统计
    const { get: getChannels } = useAdminApi('/content/channels')
    const channelsResponse = await getChannels()
    
    // 获取文章统计
    const { get: getArticles } = useAdminApi('/content/articles')
    const articlesResponse = await getArticles()
    
    // 获取联系人统计
    const { get: getContacts } = useAdminApi('/system/messages')
    const contactsResponse = await getContacts()
    
    // 更新统计数据
    const channelsData = channelsResponse.data?.channels || channelsResponse.data || []
    const articlesData = articlesResponse.data?.articles || articlesResponse.data || []
    const contactsData = contactsResponse.data?.contacts || contactsResponse.data || []
    
    stats.value = {
      channels: Array.isArray(channelsData) ? channelsData.length : 0,
      articles: Array.isArray(articlesData) ? articlesData.length : 0,
      contacts: Array.isArray(contactsData) ? contactsData.length : 0,
      published: Array.isArray(articlesData) ? articlesData.filter((a: any) => a.status === 'published' || a.status === '已发布').length : 0
    }
    
    // 检查是否有数据
    hasData.value = stats.value.channels > 0 || stats.value.articles > 0
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadStats()
  
  // 5秒后清除消息
  watch(message, (newMessage) => {
    if (newMessage) {
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }
  })
})
</script>