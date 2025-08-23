<template>
  <div 
    v-if="visible" 
    :class="[
      'p-4 rounded-lg border transition-all duration-300',
      {
        'bg-red-50 border-red-200 text-red-800': type === 'error',
        'bg-yellow-50 border-yellow-200 text-yellow-800': type === 'warning',
        'bg-blue-50 border-blue-200 text-blue-800': type === 'info',
        'bg-green-50 border-green-200 text-green-800': type === 'success'
      }
    ]"
  >
    <div class="flex items-start">
      <!-- 图标 -->
      <div :class="[
        'flex-shrink-0 mr-3 mt-0.5',
        {
          'text-red-500': type === 'error',
          'text-yellow-500': type === 'warning',
          'text-blue-500': type === 'info',
          'text-green-500': type === 'success'
        }
      ]">
        <svg 
          v-if="type === 'error'" 
          class="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fill-rule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clip-rule="evenodd" 
          />
        </svg>
        <svg 
          v-else-if="type === 'warning'" 
          class="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fill-rule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 极 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 极 102 0V6a1 1 0 00-1-1z" 
            clip-rule="evenodd" 
          />
        </svg>
        <svg 
          v-else-if="type === 'info'" 
          class="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fill-rule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
            clip-rule="evenodd" 
          />
        </svg>
        <svg 
          v-else-if="type === 'success'" 
          class="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fill-rule="evenodd" 
            d="M10 18a8极 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clip-rule="evenodd" 
          />
        </svg>
      </div>

      <!-- 内容 -->
      <div class="flex-1">
        <!-- 标题 -->
        <h3 
          v-if="title" 
          :class="[
            'text-sm font-medium mb-1',
            {
              'text-red-800': type === 'error',
              'text-yellow-800': type === 'warning',
              'text-blue-800': type === 'info',
              'text-green-800': type === 'success'
            }
          ]"
        >
          {{ title }}
        </h3>

        <!-- 消息内容 -->
        <p class="text-sm">
          {{ message }}
        </p>

        <!-- 详细信息 -->
        <div 
          v-if="details" 
          class="mt-2 text-xs opacity-75"
        >
          {{ details }}
        </div>

        <!-- 操作按钮 -->
        <div 
          v-if="showAction" 
          class="mt-3"
        >
          <button
            type="button"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              {
                'bg-red-100 text-red-800 hover:bg-red-200': type === 'error',
                'bg-yellow-100 text-yellow-800 hover:bg-yellow-200': type === 'warning',
                'bg-blue-100 text-blue-800 hover:bg-blue-200': type === 'info',
                'bg-green-100 text-green-800 hover:bg-green-200': type === 'success'
              }
            ]"
            @click="handleAction"
          >
            {{ actionText || '重试' }}
          </button>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <button
        v-if="dismissible"
        type="button"
        :class="[
          'flex-shrink-0 ml-4 p-1 rounded-md transition-colors',
          {
            'text-red-400 hover:bg-red-100 hover:text-red-600': type === 'error',
            'text-yellow-400 hover:bg-yellow-100 hover:text-yellow-600': type === 'warning',
            'text-blue-400 hover:bg-blue-100 hover:text-blue-600': type === 'info',
            'text-green-400 hover:bg-green-100 hover:text-green-600': type === 'success'
          }
        ]"
        @click="dismiss"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path 
            fill-rule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 极.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  type?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  message: string
  details?: string
  dismissible?: boolean
  autoDismiss?: boolean
  dismissTimeout?: number
  showAction?: boolean
  actionText?: string
  onAction?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  dismissible: true,
  autoDismiss: false,
  dismissTimeout: 5000,
  showAction: false,
  actionText: '重试'
})

const emit = defineEmits<{
  dismiss: []
  action: []
}>()

const visible = ref(false)
let dismissTimer: NodeJS.Timeout | null = null

// 显示组件
const show = () => {
  visible.value = true
  
  if (props.autoDismiss) {
    startDismissTimer()
  }
}

// 隐藏组件
const hide = () => {
  visible.value = false
  clearDismissTimer()
}

// 关闭组件
const dismiss = () => {
  hide()
  emit('dismiss')
}

// 处理操作按钮点击
const handleAction = () => {
  if (props.onAction) {
    props.onAction()
  }
  emit('action')
}

// 启动自动关闭计时器
const startDismissTimer = () => {
  clearDismissTimer()
  dismissTimer = setTimeout(() => {
    dismiss()
  }, props.dismissTimeout)
}

// 清除计时器
const clearDismissTimer = () => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

// 监听消息变化
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    show()
  } else {
    hide()
  }
})

// 组件挂载时显示
onMounted(() => {
  if (props.message) {
    show()
  }
})

// 暴露方法给父组件
defineExpose({
  show,
  hide,
  dismiss
})
</script>

<style scoped>
/* 自定义动画 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>