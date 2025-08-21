<template>
  <div class="space-y-6">
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

    <!-- 项目编辑器 -->
    <AdminProjectEditor
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
  layout: 'admin'
})

// 响应式数据
const projects = ref([])
const showProjectEditor = ref(false)
const currentProject = ref(null)

// 获取认证令牌
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// 加载项目数据
const loadProjects = async () => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    const response = await $fetch('/api/admin/content/projects', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.success) {
      projects.value = response.data.projects
    }
  } catch (error) {
    console.error('加载项目失败:', error)
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
      await $fetch(`/api/admin/content/projects/${currentProject.value.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: projectData
      })
    } else {
      // 创建项目
      await $fetch('/api/admin/content/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: projectData
      })
    }

    // 关闭编辑器并重新加载列表
    closeProjectEditor()
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

    await $fetch(`/api/admin/content/projects/${projectId}`, {
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

// 初始化数据
onMounted(() => {
  loadProjects()
})

// SEO
useHead({
  title: '项目管理 - 管理后台'
})
</script>