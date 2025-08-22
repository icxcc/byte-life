<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header v-if="showHeader" class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- 左侧内容 -->
          <div class="flex items-center gap-4">
            <slot name="header-left">
              <h1 v-if="title" class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h1>
            </slot>
          </div>
          
          <!-- 右侧内容 -->
          <div class="flex items-center gap-3">
            <slot name="header-right" />
          </div>
        </div>
      </div>
    </header>

    <!-- 面包屑导航 -->
    <nav v-if="breadcrumbs?.length" class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <UBreadcrumb :links="breadcrumbs" />
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题和描述 -->
      <div v-if="pageTitle || pageDescription || $slots.pageHeader" class="mb-8">
        <slot name="pageHeader">
          <div class="flex items-center justify-between">
            <div>
              <h1 v-if="pageTitle" class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ pageTitle }}
              </h1>
              <p v-if="pageDescription" class="mt-2 text-gray-600 dark:text-gray-400">
                {{ pageDescription }}
              </p>
            </div>
            <div v-if="$slots.pageActions" class="flex items-center gap-3">
              <slot name="pageActions" />
            </div>
          </div>
        </slot>
      </div>

      <!-- 内容区域 -->
      <div :class="contentClasses">
        <slot />
      </div>
    </main>

    <!-- 页脚 -->
    <footer v-if="showFooter" class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <slot name="footer">
          <div class="text-center text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} 字节生活. All rights reserved.
          </div>
        </slot>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbLink {
  label: string
  to?: string
  icon?: string
}

interface Props {
  title?: string
  pageTitle?: string
  pageDescription?: string
  breadcrumbs?: BreadcrumbLink[]
  showHeader?: boolean
  showFooter?: boolean
  contentWidth?: 'full' | 'container' | 'narrow'
  contentSpacing?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: true,
  contentWidth: 'full',
  contentSpacing: 'md'
})

const contentClasses = computed(() => {
  const classes = []
  
  // 内容宽度
  switch (props.contentWidth) {
    case 'container':
      classes.push('max-w-4xl mx-auto')
      break
    case 'narrow':
      classes.push('max-w-2xl mx-auto')
      break
    default:
      classes.push('w-full')
  }
  
  // 内容间距
  switch (props.contentSpacing) {
    case 'none':
      break
    case 'sm':
      classes.push('space-y-4')
      break
    case 'lg':
      classes.push('space-y-8')
      break
    default:
      classes.push('space-y-6')
  }
  
  return classes.join(' ')
})
</script>