<template>
  <footer class="bg-gray-100 dark:bg-gray-800 py-8 mt-12">
    <div class="container-custom">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 网站信息 -->
        <div>
          <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">字节生活</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            个人网站，展示作品、博客和在线互动功能
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <span class="sr-only">GitHub</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <span class="sr-only">微信</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.012.806-.037a.59.59 0 01.107 1.173 11.576 11.576 0 01-1.194.06c-.384 0-.768-.02-1.15-.06l.172.77c.46.026.924.04 1.394.04 4.45 0 8.061-2.996 8.061-6.708 0-3.712-3.611-6.709-8.06-6.709h-.11c-.057 0-.11.006-.166.007zm11.964 7.805c0 3.075-2.987 5.561-6.648 5.561a7.44 7.44 0 01-1.256-.108l-.01-.002a.314.314 0 00-.3.082l-1.337.784a.24.24 0 01-.119.035.207.207 0 01-.206-.205c0-.054.02-.104.035-.151l.273-1.041a.413.413 0 00-.15-.467 5.614 5.614 0 01-2.21-4.494c0-3.074 2.986-5.56 6.648-5.56 3.66 0 6.647 2.486 6.647 5.56h.033zm-8.773-2.432c0 .473-.388.858-.865.858a.862.862 0 01-.866-.858c0-.473.388-.858.866-.858s.865.385.865.858zm4.252 0c0 .473-.388.858-.866.858a.862.862 0 01-.865-.858c0-.473.388-.858.865-.858s.866.385.866.858z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- 导航链接 -->
        <div>
          <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">导航</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">首页</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">关于</NuxtLink></li>
            <li><NuxtLink to="/projects" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">作品</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">博客</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">联系</NuxtLink></li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">联系方式</h3>
          <ul class="space-y-2">
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:contact@example.com" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">contact@example.com</a>
            </li>
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="text-gray-600 dark:text-gray-400">+86 123 4567 8910</span>
            </li>
          </ul>
        </div>

        <!-- 订阅 -->
        <div>
          <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">订阅更新</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            订阅我的最新动态和文章
          </p>
          <form class="flex">
            <input type="email" placeholder="您的邮箱" class="flex-grow px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              订阅
            </button>
          </form>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-center text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} 字节生活. 保留所有权利.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件逻辑
</script>