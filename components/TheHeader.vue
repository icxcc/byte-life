<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container-custom py-4">
      <nav class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          字节生活
        </NuxtLink>

        <!-- 导航链接 - 桌面版 -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="nav-link">首页</NuxtLink>
          <template v-if="!loading">
            <NuxtLink 
              v-for="channel in topLevelChannels" 
              :key="channel.id"
              :to="`/${channel.slug}`" 
              class="nav-link"
              
            >
              {{ channel.name }}
            </NuxtLink>
          </template>
          <NuxtLink to="/contact" class="nav-link">联系</NuxtLink>
        </div>

        <!-- 右侧功能区 -->
        <div class="flex items-center space-x-4">
          <!-- 暗黑模式切换 -->
          <button @click="toggleColorMode" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span v-if="colorMode.value === 'dark'" class="sr-only">切换到亮色模式</span>
            <span v-else class="sr-only">切换到暗色模式</span>
            <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <!-- 语言切换 (预留) -->
          <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="sr-only">切换语言</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </button>

          <!-- 移动端菜单按钮 -->
          <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="sr-only">打开菜单</span>
            <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- 移动端菜单 -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4">
        <div class="flex flex-col space-y-4">
          <NuxtLink to="/" class="nav-link-mobile" @click="isMenuOpen = false">首页</NuxtLink>
          <NuxtLink to="/about" class="nav-link-mobile" @click="isMenuOpen = false">关于</NuxtLink>
          <NuxtLink to="/projects" class="nav-link-mobile" @click="isMenuOpen = false">作品</NuxtLink>
          <NuxtLink to="/blog" class="nav-link-mobile" @click="isMenuOpen = false">博客</NuxtLink>
          <NuxtLink to="/contact" class="nav-link-mobile" @click="isMenuOpen = false">联系</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useColorMode } from '#imports';

const colorMode = useColorMode();
const isMenuOpen = ref(false);

// 使用公共channels接口
const { topLevelChannels, loading } = usePublicChannels();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
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
