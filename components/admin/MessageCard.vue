<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">{{ getInitials(message.name) }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ message.name }}
              </h4>
              <span v-if="!message.read" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                未读
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ message.email }}</p>
          </div>
        </div>
        
        <div class="mt-4">
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {{ message.message }}
          </p>
        </div>
        
        <div class="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
              {{ formatDate(message.createdAt) }}
            </span>
            <span v-if="message.ip" class="flex items-center">
              <Icon name="heroicons:globe-alt" class="w-4 h-4 mr-1" />
              {{ message.ip }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="flex-shrink-0 ml-4">
        <div class="flex items-center space-x-2">
          <button
            v-if="!message.read"
            @click="$emit('markAsRead', message.id)"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 transition-colors"
          >
            <Icon name="heroicons:check" class="w-3 h-3 mr-1" />
            标记已读
          </button>
          <button
            @click="$emit('delete', message.id)"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          >
            <Icon name="heroicons:trash" class="w-3 h-3 mr-1" />
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
  ip?: string
}

interface Props {
  message: Message
}

defineProps<Props>()
defineEmits<{
  markAsRead: [id: number]
  delete: [id: number]
}>()

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
</write_to_file>

<write_to_file>
<path>components/LoadingSpinner.vue</path>
<content>
<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- 主要旋转器 -->
      <div 
        :class="spinnerClass"
        class="animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
      ></div>
      
      <!-- 内部点 -->
      <div 
        v-if="showDot"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-current rounded-full animate-pulse"
      ></div>
    </div>
    
    <!-- 加载文本 -->
    <span v-if="text" :class="textClass" class="ml-3 font-medium">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  text?: string
  showDot?: boolean
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  showDot: false,
  fullScreen: false
})

const containerClass = computed(() => {
  const classes = []
  
  if (props.fullScreen) {
    classes.push('min-h-screen')
  } else {
    classes.push('py-8')
  }
  
  return classes.join(' ')
})

const spinnerClass = computed(() => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const colorClasses = {
    primary: 'text-indigo-600 dark:text-indigo-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400'
  }
  
  return [
    sizeClasses[props.size],
    colorClasses[props.color]
  ].join(' ')
})

const textClass = computed(() => {
  const colorClasses = {
    primary: 'text-indigo-700 dark:text-indigo-300',
    secondary: 'text-gray-700 dark:text-gray-300',
    success: 'text-green-700 dark:text-green-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    danger: 'text-red-700 dark:text-red-300'
  }
  
  return colorClasses[props.color]
})
</script>
</template>