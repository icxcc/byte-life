<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">栏目管理</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">管理网站内容栏目分类</p>
      </div>
      <UButton
        @click="showCreateModal = true"
        icon="i-heroicons-plus"
        color="primary"
      >
        新建栏目
      </UButton>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard
        title="总栏目数"
        :value="stats.total"
        icon="i-heroicons-tag"
        color="blue"
      />
      <StatsCard
        title="启用栏目"
        :value="stats.active"
        icon="i-heroicons-check-circle"
        color="green"
      />
      <StatsCard
        title="禁用栏目"
        :value="stats.inactive"
        icon="i-heroicons-x-circle"
        color="red"
      />
      <StatsCard
        title="子栏目数"
        :value="stats.children"
        icon="i-heroicons-folder-open"
        color="purple"
      />
    </div>

    <!-- 栏目列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">栏目列表</h2>
          <div class="flex items-center gap-4">
            <UInput
              v-model="searchQuery"
              placeholder="搜索栏目..."
              icon="i-heroicons-magnifying-glass"
              size="sm"
            />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                栏目信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                别名
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                父栏目
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                排序
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="channel in filteredChannels" :key="channel.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ channel.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ channel.description || '暂无描述' }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  {{ channel.slug }}
                </code>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ getParentName(channel.parent_id) || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ channel.sort_order }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    channel.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ channel.is_active ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <UButton
                    @click="editChannel(channel)"
                    variant="ghost"
                    size="sm"
                  >
                    编辑
                  </UButton>
                  <UButton
                    @click="handleDeleteChannel(channel)"
                    variant="ghost"
                    size="sm"
                    color="red"
                  >
                    删除
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">加载中...</span>
        </div>
      </div>

      <div v-if="!loading && filteredChannels.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        暂无栏目数据
      </div>
    </div>

    <!-- 创建/编辑栏目模态框 -->
    <UModal 
      v-model:open="showModal" 
      :title="showCreateModal ? '新建栏目' : '编辑栏目'"
      class="w-full max-w-2xl"
    >
      <template #body>
        <form @submit.prevent="showCreateModal ? handleCreateChannel() : handleUpdateChannel()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                栏目名称 *
              </label>
              <UInput
                v-model="channelForm.name"
                placeholder="请输入栏目名称"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                栏目别名 *
              </label>
              <UInput
                v-model="channelForm.slug"
                placeholder="请输入栏目别名（英文）"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                栏目描述
              </label>
              <UTextarea
                v-model="channelForm.description"
                :rows="3"
                placeholder="请输入栏目描述"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                父栏目
              </label>
              <USelect
                v-model="channelForm.parent_id"
                :options="parentChannelOptions"
                placeholder="无父栏目"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  排序
                </label>
                <UInput
                  v-model.number="channelForm.sort_order"
                  type="number"
                  :min="0"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  状态
                </label>
                <USelect
                  v-model="channelForm.is_active"
                  :options="statusOptions"
                />
              </div>
            </div>
          </div>
        </form>
      </template>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            @click="closeModal"
            variant="outline"
          >
            取消
          </UButton>
          <UButton
            @click="showCreateModal ? handleCreateChannel() : handleUpdateChannel()"
            :loading="submitting"
            color="primary"
          >
            {{ submitting ? '保存中...' : '保存' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Channel, ChannelForm } from '~/types'

// 页面元数据
definePageMeta({
  layout: 'admin'
})

// 使用栏目管理组合式函数
const {
  channels,
  stats,
  loading,
  error,
  fetchChannels,
  createChannel: createChannelApi,
  updateChannel: updateChannelApi,
  deleteChannel: deleteChannelApi,
  getParentName,
  getParentOptions,
  searchChannels
} = useChannels()

// 响应式数据
const submitting = ref(false)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingChannel = ref<Channel | null>(null)

// 表单数据
const channelForm = ref<ChannelForm>({
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  sort_order: 0,
  is_active: true
})

// 计算属性
const filteredChannels = computed(() => searchChannels(searchQuery.value))
const parentChannels = computed(() => getParentOptions(editingChannel.value?.id))

// 父栏目选项（包含空选项）
const parentChannelOptions = computed(() => [
  { label: '无父栏目', value: null },
  ...parentChannels.value.map(channel => ({
    label: channel.name,
    value: channel.id
  }))
])

// 状态选项
const statusOptions = [
  { label: '启用', value: true },
  { label: '禁用', value: false }
]

const showModal = computed({
  get: () => showCreateModal.value || showEditModal.value,
  set: (value: boolean) => {
    if (!value) {
      showCreateModal.value = false
      showEditModal.value = false
    }
  }
})

// 方法
const handleCreateChannel = async (): Promise<void> => {
  try {
    submitting.value = true
    await createChannelApi(channelForm.value)
    closeModal()
  } catch (error) {
    console.error('创建栏目失败:', error)
  } finally {
    submitting.value = false
  }
}

const editChannel = (channel: Channel): void => {
  editingChannel.value = channel
  channelForm.value = { ...channel }
  showEditModal.value = true
}

const handleUpdateChannel = async (): Promise<void> => {
  if (!editingChannel.value) return
  
  try {
    submitting.value = true
    await updateChannelApi(editingChannel.value.id, channelForm.value)
    closeModal()
  } catch (error) {
    console.error('更新栏目失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleDeleteChannel = async (channel: Channel): Promise<void> => {
  if (!confirm(`确定要删除栏目"${channel.name}"吗？`)) return
  
  try {
    await deleteChannelApi(channel.id)
  } catch (error) {
    console.error('删除栏目失败:', error)
  }
}

const closeModal = (): void => {
  showCreateModal.value = false
  showEditModal.value = false
  editingChannel.value = null
  channelForm.value = {
    name: '',
    slug: '',
    description: '',
    parent_id: null,
    sort_order: 0,
    is_active: true
  }
}

// 生命周期
onMounted(() => {
  fetchChannels()
})
</script>