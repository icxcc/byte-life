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
