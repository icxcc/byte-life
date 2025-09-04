<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 未认证时重定向到登录页面 -->
    <div v-if="!isAuthenticated && !isLoading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">正在验证身份...</p>
      </div>
    </div>

    <!-- 管理员仪表板 -->
    <div v-else-if="isAuthenticated" class="admin-layout flex h-full bg-gray-100 dark:bg-gray-900">
      <!-- 侧边栏 -->
      <AdminSidebar @logout="handleLogout" />

      <!-- 主内容区域 -->
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- 顶部导航栏 -->
        <AdminTopNav @logout="handleLogout" />
        
        <!-- 主内容 -->
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 custom-scrollbar">
          <div class="content-container p-6">
            <!-- 使用 slot 接收页面内容，符合 Nuxt 4 布局规范 -->
            <slot />
          </div>
        </main>

        <!-- 底部信息 -->
        <AdminFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 响应式数据
const user = ref<any>(null)
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(true)

// 存储当前会话信息
const currentSession = ref<any>(null)

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
    
    // 跳转到登录页面
    await navigateTo('/admin')
    
    console.log('退出登录成功')
  } catch (error) {
    console.error('退出登录失败:', error)
    // 即使 Supabase 退出失败，也要清理本地状态
    user.value = null
    currentSession.value = null
    await navigateTo('/admin')
  }
}

// 初始化认证状态
onMounted(async () => {
  try {
    // 获取当前会话
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      currentSession.value = session
    } else {
      // 如果没有会话，重定向到登录页面
      await navigateTo('/admin')
    }
  } catch (error) {
    console.error('获取会话失败:', error)
    await navigateTo('/admin')
  } finally {
    isLoading.value = false
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event: any, session: any) => {
    console.log('认证状态变化:', event, session?.user?.email)
    
    if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
      currentSession.value = session
    } else if (event === 'SIGNED_OUT' || !session) {
      // 清理所有状态
      user.value = null
      currentSession.value = null
      // 重定向到登录页面
      await navigateTo('/admin')
    }
  })
})

// 提供认证状态给子组件
provide('auth', {
  user: readonly(user),
  session: readonly(currentSession),
  isAuthenticated: readonly(isAuthenticated)
})
</script>

<style scoped>
/* 侧边栏菜单项简洁过渡 */
.menu-item {
  transition: background-color 0.15s ease-in-out;
}

/* 滚动条样式优化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 防止内容跳动 */
.content-container {
  min-height: 0;
}
</style>
