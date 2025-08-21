<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
      <div class="mt-3">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEdit ? '编辑项目' : '新建项目' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- 项目表单 -->
        <form @submit.prevent="saveProject" class="mt-6 space-y-6">
          <!-- 基本信息 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">项目名称</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="请输入项目名称"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">项目描述</label>
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="请输入项目描述..."
            ></textarea>
          </div>

          <!-- 链接信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">项目链接</label>
              <input
                v-model="form.projectUrl"
                type="url"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://example.com"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub 链接</label>
              <input
                v-model="form.githubUrl"
                type="url"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://github.com/username/repo"
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

          <!-- 技术栈 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">技术栈</label>
            <div class="mt-1 space-y-2">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tech, index) in form.technologies"
                  :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                >
                  {{ tech }}
                  <button
                    type="button"
                    @click="removeTechnology(index)"
                    class="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                  >
                    <Icon name="heroicons:x-mark" class="w-3 h-3" />
                  </button>
                </span>
              </div>
              <div class="flex">
                <input
                  v-model="newTechnology"
                  type="text"
                  @keyup.enter="addTechnology"
                  class="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入技术名称，按回车添加"
                >
                <button
                  type="button"
                  @click="addTechnology"
                  class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  添加
                </button>
              </div>
            </div>
          </div>

          <!-- 项目状态 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">项目状态</label>
            <select
              v-model="form.status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
              <option value="暂停">暂停</option>
              <option value="计划中">计划中</option>
            </select>
          </div>

          <!-- 项目选项 -->
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="form.featured"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">设为推荐项目</span>
            </label>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ saving ? '保存中...' : (isEdit ? '更新项目' : '创建项目') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id?: number
  title: string
  description: string
  projectUrl: string
  githubUrl: string
  coverImage: string
  technologies: string[]
  status: string
  featured: boolean
}

interface Props {
  project?: Project | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  project: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  save: [project: Project]
}>()

const saving = ref(false)
const newTechnology = ref('')

// 表单数据
const form = ref<Project>({
  title: '',
  description: '',
  projectUrl: '',
  githubUrl: '',
  coverImage: '',
  technologies: [],
  status: '进行中',
  featured: false
})

// 初始化表单数据
watchEffect(() => {
  if (props.project) {
    form.value = { ...props.project }
  } else {
    form.value = {
      title: '',
      description: '',
      projectUrl: '',
      githubUrl: '',
      coverImage: '',
      technologies: [],
      status: '进行中',
      featured: false
    }
  }
})

// 添加技术栈
const addTechnology = () => {
  const tech = newTechnology.value.trim()
  if (tech && !form.value.technologies.includes(tech)) {
    form.value.technologies.push(tech)
    newTechnology.value = ''
  }
}

// 移除技术栈
const removeTechnology = (index: number) => {
  form.value.technologies.splice(index, 1)
}

// 保存项目
const saveProject = async () => {
  saving.value = true
  try {
    // 这里应该调用 API 保存项目
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
    emit('save', form.value)
    closeModal()
  } catch (error) {
    console.error('保存项目失败:', error)
  } finally {
    saving.value = false
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
}
</script>