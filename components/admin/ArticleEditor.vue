<template>
  <div class="w-full h-full overflow-y-auto">
    <!-- 文章表单 -->
    <UForm :state="form" @submit="saveArticle" class="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <!-- 基本信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UFormField label="文章标题" required class="lg:col-span-1">
          <UInput
            v-model="form.title"
            placeholder="请输入文章标题"
            required
            size="md"
          />
        </UFormField>
        
        <UFormField label="URL 别名" required class="lg:col-span-1">
          <UInput
            v-model="form.slug"
            placeholder="url-slug"
            required
            size="md"
          />
        </UFormField>
      </div>

      <!-- 分类和标签 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UFormField label="分类" class="lg:col-span-1">
          <USelect
            v-model="form.channel_id"
            :items="channelOptions"
            placeholder="选择分类"
            size="md"
          />
        </UFormField>
        
        <UFormField label="标签" class="lg:col-span-1">
          <UInput
            v-model="tagsInput"
            placeholder="标签1,标签2,标签3"
            size="md"
          />
        </UFormField>
      </div>

      <!-- 作者和封面 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UFormField label="作者" class="lg:col-span-1">
          <UInput
            v-model="form.author"
            placeholder="作者姓名"
            size="md"
          />
        </UFormField>
        
        <UFormField label="封面图片 URL" class="lg:col-span-1">
          <UInput
            v-model="form.cover_image"
            type="url"
            placeholder="https://example.com/image.jpg"
            size="md"
          />
        </UFormField>
      </div>

      <!-- 文章摘要 -->
      <UFormField label="文章摘要">
        <UTextarea
          v-model="form.excerpt"
          :rows="3"
          placeholder="请输入文章摘要..."
          resize
        />
      </UFormField>

      <!-- SEO 设置 -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">SEO 设置</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <UFormField label="SEO 标题" class="lg:col-span-1">
            <UInput
              v-model="form.meta_title"
              placeholder="SEO 标题（可选）"
              size="md"
            />
          </UFormField>
          
          <UFormField label="SEO 描述" class="lg:col-span-1">
            <UTextarea
              v-model="form.meta_description"
              :rows="2"
              placeholder="SEO 描述（可选）"
              resize
            />
          </UFormField>
        </div>
      </div>

      <!-- 文章内容 -->
      <UFormField label="文章内容" required>
        <div class="border border-gray-300 rounded-lg dark:border-gray-600 overflow-hidden">
          <!-- 工具栏 -->
          <div class="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <UButton
              type="button"
              @click="insertMarkdown('**', '**')"
              variant="outline"
              size="xs"
              class="flex-shrink-0"
            >
              <strong>B</strong>
            </UButton>
            <UButton
              type="button"
              @click="insertMarkdown('*', '*')"
              variant="outline"
              size="xs"
              class="flex-shrink-0"
            >
              <em>I</em>
            </UButton>
            <UButton
              type="button"
              @click="insertMarkdown('`', '`')"
              variant="outline"
              size="xs"
              class="flex-shrink-0"
            >
              Code
            </UButton>
            <UButton
              type="button"
              @click="insertMarkdown('### ', '')"
              variant="outline"
              size="xs"
              class="flex-shrink-0"
            >
              H3
            </UButton>
            <UButton
              type="button"
              @click="insertMarkdown('- ', '')"
              variant="outline"
              size="xs"
              class="flex-shrink-0"
            >
              List
            </UButton>
          </div>
          <!-- 编辑器 -->
          <UTextarea
            ref="contentEditor"
            v-model="form.content"
            :rows="12"
            placeholder="请输入文章内容（支持 Markdown 语法）..."
            required
            class="border-0 focus:ring-0 resize-y min-h-[300px]"
          />
        </div>
      </UFormField>

      <!-- 发布选项 -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">发布设置</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <UFormField label="文章状态" class="sm:col-span-1">
            <USelect
              v-model="form.status"
              :items="statusOptions"
              placeholder="选择状态"
              size="md"
            />
          </UFormField>
          
          <UFormField label="阅读时间（分钟）" class="sm:col-span-1">
            <UInput
              v-model.number="form.read_time"
              type="number"
              :min="0"
              placeholder="0"
              size="md"
            />
          </UFormField>
          
          <UFormField label="推荐设置" class="sm:col-span-1 lg:col-span-1">
            <div class="pt-2">
              <UCheckbox
                v-model="form.featured"
                label="设为推荐文章"
              />
            </div>
          </UFormField>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <UButton
          type="button"
          @click="closeModal"
          variant="outline"
          size="md"
          class="w-full sm:w-auto"
        >
          取消
        </UButton>
        <UButton
          type="submit"
          :loading="saving"
          color="primary"
          size="md"
          class="w-full sm:w-auto"
        >
          {{ saving ? '保存中...' : (isEdit ? '更新文章' : '保存文章') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
// 严格按照数据库表结构定义类型
interface Article {
  id?: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  cover_image?: string
  channel_id?: string
  author?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  meta_title?: string
  meta_description?: string
  read_time: number
  views: number
  likes: number
  published_at?: string
  created_at?: string
  updated_at?: string
}

interface Channel {
  id: string
  name: string
  slug: string
}

interface Props {
  article?: Article | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  article: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  save: [article: Article]
}>()

const saving = ref(false)
const contentEditor = ref<HTMLTextAreaElement>()

// 使用 useChannels composable 获取栏目数据
const { channels: channelsData, fetchChannels } = useChannels()

// 表单数据 - 严格按照数据库表结构
const form = ref<Article>({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image: '',
  channel_id: '',
  author: '',
  status: 'draft',
  featured: false,
  tags: [],
  meta_title: '',
  meta_description: '',
  read_time: 0,
  views: 0,
  likes: 0
})

// 获取栏目列表
const channels = computed(() => {
  if (Array.isArray(channelsData.value)) {
    return channelsData.value
  } else if (channelsData.value && Array.isArray(channelsData.value.channels)) {
    return channelsData.value.channels
  }
  return []
})

// 栏目选项 - 使用正确的格式
const channelOptions = computed(() => {
  const options = ['选择分类']
  channels.value.forEach(channel => {
    options.push(channel.name)
  })
  return options
})

// 状态选项 - 使用简单的字符串数组
const statusOptions = ['草稿', '已发布', '已归档']

// 状态映射
const statusMap = {
  '草稿': 'draft',
  '已发布': 'published',
  '已归档': 'archived'
}

const statusLabelMap = {
  'draft': '草稿',
  'published': '已发布',
  'archived': '已归档'
}

// 标签输入处理
const tagsInput = computed({
  get: () => form.value.tags.join(', '),
  set: (value: string) => {
    form.value.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  }
})

// 监听栏目选择变化
watch(() => form.value.channel_id, (newValue) => {
  if (typeof newValue === 'string' && newValue !== '选择分类') {
    const channel = channels.value.find(c => c.name === newValue)
    if (channel) {
      form.value.channel_id = channel.id
    }
  } else if (newValue === '选择分类') {
    form.value.channel_id = ''
  }
})

// 监听状态选择变化
watch(() => form.value.status, (newValue) => {
  if (typeof newValue === 'string' && statusMap[newValue]) {
    form.value.status = statusMap[newValue]
  }
})

// 组件挂载时获取栏目列表
onMounted(() => {
  fetchChannels()
})

// 初始化表单数据
watchEffect(() => {
  if (props.article) {
    const article = props.article
    form.value = { 
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : []
    }
    
    // 设置显示值
    nextTick(() => {
      // 设置栏目显示名称
      if (article.channel_id) {
        const channel = channels.value.find(c => c.id === article.channel_id)
        if (channel) {
          form.value.channel_id = channel.name
        }
      }
      
      // 设置状态显示名称
      if (article.status) {
        form.value.status = statusLabelMap[article.status] || article.status
      }
    })
  } else {
    form.value = {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      cover_image: '',
      channel_id: '',
      author: '',
      status: '草稿',
      featured: false,
      tags: [],
      meta_title: '',
      meta_description: '',
      read_time: 0,
      views: 0,
      likes: 0
    }
  }
})

// 自动生成 slug
watch(() => form.value.title, (newTitle) => {
  if (newTitle && !props.isEdit) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// 自动计算阅读时间
watch(() => form.value.content, (newContent) => {
  if (newContent && form.value.read_time === 0) {
    // 按照每分钟200字计算
    form.value.read_time = Math.ceil(newContent.length / 200)
  }
})

// 插入 Markdown 语法
const insertMarkdown = (before: string, after: string) => {
  const textarea = contentEditor.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  const newText = before + selectedText + after
  const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
  
  form.value.content = newContent
  
  // 设置新的光标位置
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  })
}

// 保存文章 - 严格按照数据库表结构发送数据
const saveArticle = async () => {
  saving.value = true
  try {
    // 获取真实的栏目ID
    let channelId = ''
    if (form.value.channel_id && form.value.channel_id !== '选择分类') {
      if (typeof form.value.channel_id === 'string') {
        const channel = channels.value.find(c => c.name === form.value.channel_id)
        channelId = channel?.id || ''
      } else {
        channelId = form.value.channel_id
      }
    }
    
    // 获取真实的状态值
    let status = form.value.status
    if (typeof status === 'string' && statusMap[status]) {
      status = statusMap[status]
    }
    
    // 严格按照数据库表结构发送数据
    const articleData: Article = {
      title: form.value.title,
      slug: form.value.slug,
      content: form.value.content,
      excerpt: form.value.excerpt,
      cover_image: form.value.cover_image || null,
      channel_id: channelId || null,
      author: form.value.author || null,
      status: status,
      featured: form.value.featured,
      tags: form.value.tags,
      meta_title: form.value.meta_title || null,
      meta_description: form.value.meta_description || null,
      read_time: form.value.read_time || 0,
      views: form.value.views || 0,
      likes: form.value.likes || 0
    }
    
    // 触发父组件的保存方法
    emit('save', articleData)
  } catch (error) {
    console.error('保存文章失败:', error)
  } finally {
    saving.value = false
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
}
</script>