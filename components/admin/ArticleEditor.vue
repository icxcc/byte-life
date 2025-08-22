<template>
  <div class="max-w-4xl mx-auto">
    <!-- 文章表单 -->
    <form @submit.prevent="saveArticle" class="space-y-6">
      <!-- 基本信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">文章标题</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="请输入文章标题"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL 别名</label>
          <input
            v-model="form.slug"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="url-slug"
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">分类</label>
          <select
            v-model="form.category"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">选择分类</option>
            <option value="技术">技术</option>
            <option value="生活">生活</option>
            <option value="思考">思考</option>
            <option value="教程">教程</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">标签</label>
          <input
            v-model="form.tags"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="标签1,标签2,标签3"
          >
        </div>
      </div>

      <!-- 封面图片 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">封面图片 URL</label>
        <input
          v-model="form.coverImage"
          type="url"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://example.com/image.jpg"
        >
      </div>

      <!-- 文章摘要 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">文章摘要</label>
        <textarea
          v-model="form.excerpt"
          rows="3"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="请输入文章摘要..."
        ></textarea>
      </div>

      <!-- 文章内容 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">文章内容</label>
        <div class="mt-1 border border-gray-300 rounded-md dark:border-gray-600">
          <!-- 工具栏 -->
          <div class="flex items-center space-x-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <button
              type="button"
              @click="insertMarkdown('**', '**')"
              class="px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              @click="insertMarkdown('*', '*')"
              class="px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              @click="insertMarkdown('`', '`')"
              class="px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500"
            >
              Code
            </button>
          </div>
          <!-- 编辑器 -->
          <textarea
            ref="contentEditor"
            v-model="form.content"
            rows="15"
            required
            class="w-full p-3 border-0 focus:ring-0 resize-none dark:bg-gray-800 dark:text-white"
            placeholder="请输入文章内容（支持 Markdown 语法）..."
          ></textarea>
        </div>
      </div>

      <!-- 发布选项 -->
      <div class="flex items-center space-x-6">
        <label class="flex items-center">
          <input
            v-model="form.published"
            type="checkbox"
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">立即发布</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="form.featured"
            type="checkbox"
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">设为推荐</span>
        </label>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <UiButton
          type="button"
          @click="closeModal"
          variant="outline"
        >
          取消
        </UiButton>
        <UiButton
          type="submit"
          :disabled="saving"
        >
          {{ saving ? '保存中...' : (isEdit ? '更新文章' : '发布文章') }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Article {
  id?: number
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  category: string
  tags: string
  published: boolean
  featured: boolean
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

// 表单数据
const form = ref<Article>({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  category: '',
  tags: '',
  published: false,
  featured: false
})

// 初始化表单数据
watchEffect(() => {
  if (props.article) {
    form.value = { ...props.article }
  } else {
    form.value = {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
      category: '',
      tags: '',
      published: false,
      featured: false
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

// 保存文章
const saveArticle = async () => {
  saving.value = true
  try {
    // 触发父组件的保存方法
    emit('save', form.value)
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