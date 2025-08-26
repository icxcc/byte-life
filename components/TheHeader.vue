<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <UContainer class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <UIcon name="i-heroicons-code-bracket" class="w-6 h-6 text-blue-600" />
        <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          字节生活
        </span>
      </NuxtLink>
      
      <!-- 桌面端导航 - 使用 UNavigationMenu -->
      <div class="hidden md:block">
        <UNavigationMenu :items="navigationItems" />
      </div>

      <!-- 右侧按钮 -->
      <div class="flex items-center space-x-2">
        <!-- 主题切换 -->
        <ClientOnly>
          <UButton
            :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="gray"
            variant="ghost"
            size="sm"
            @click="toggleColorMode"
            :aria-label="colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
          />
          <template #fallback>
            <UButton
              icon="i-heroicons-moon"
              color="gray"
              variant="ghost"
              size="sm"
              aria-label="主题切换"
            />
          </template>
        </ClientOnly>

        <!-- 移动端菜单按钮 -->
        <UButton
          :icon="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          color="gray"
          variant="ghost"
          size="sm"
          class="md:hidden"
          @click="isMenuOpen = !isMenuOpen"
          :aria-label="isMenuOpen ? '关闭菜单' : '打开菜单'"
        />
      </div>
    </UContainer>

    <!-- 移动端菜单 - 使用 UNavigationMenu 垂直布局 -->
    <div v-if="isMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <UContainer class="py-4">
        <UNavigationMenu 
          :items="mobileNavigationItems" 
          orientation="vertical"
          @click="isMenuOpen = false"
        />
      </UContainer>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useColorMode } from '#imports'

const colorMode = useColorMode()
const isMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// 桌面端导航配置 - UNavigationMenu 格式
const navigationItems = computed(() => [
  {
    label: '首页',
    to: '/',
    icon: 'i-heroicons-home'
  },
  {
    label: '博客',
    to: '/blog',
    icon: 'i-heroicons-document-text'
  },
  {
    label: '项目',
    to: '/projects',
    icon: 'i-heroicons-code-bracket'
  },
  {
    label: '关于',
    to: '/about',
    icon: 'i-heroicons-user'
  }
])

// 移动端导航配置 - 垂直布局
const mobileNavigationItems = computed(() => [
  {
    label: '首页',
    to: '/',
    icon: 'i-heroicons-home'
  },
  {
    label: '博客',
    to: '/blog',
    icon: 'i-heroicons-document-text'
  },
  {
    label: '项目',
    to: '/projects',
    icon: 'i-heroicons-code-bracket'
  },
  {
    label: '关于',
    to: '/about',
    icon: 'i-heroicons-user'
  }
])
</script>

<style scoped>
.nav-link {
  color: rgb(55 65 81);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: rgb(37 99 235);
}

.dark .nav-link {
  color: rgb(209 213 219);
}

.dark .nav-link:hover {
  color: rgb(96 165 250);
}

.nav-link-mobile {
  display: block;
  padding: 0.5rem 1rem;
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
}

.nav-link-mobile:hover {
  color: rgb(37 99 235);
  background-color: rgb(243 244 246);
}

.dark .nav-link-mobile {
  color: rgb(209 213 219);
}

.dark .nav-link-mobile:hover {
  color: rgb(96 165 250);
  background-color: rgb(55 65 81);
}
</style>
