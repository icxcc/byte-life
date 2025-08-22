<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup
        name="notification"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            {
              'border-l-4 border-green-400': notification.type === 'success',
              'border-l-4 border-red-400': notification.type === 'error',
              'border-l-4 border-yellow-400': notification.type === 'warning',
              'border-l-4 border-blue-400': notification.type === 'info'
            }
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Icon
                  :name="getIcon(notification.type)"
                  :class="[
                    'h-5 w-5',
                    {
                      'text-green-400': notification.type === 'success',
                      'text-red-400': notification.type === 'error',
                      'text-yellow-400': notification.type === 'warning',
                      'text-blue-400': notification.type === 'info'
                    }
                  ]"
                />
              </div>
              <div class="ml-3 w-0 flex-1">
                <p
                  v-if="notification.title"
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="remove(notification.id)"
                  class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Icon name="heroicons:x-mark" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { notifications, remove } = useNotification()

const getIcon = (type: string) => {
  const icons = {
    success: 'heroicons:check-circle',
    error: 'heroicons:x-circle',
    warning: 'heroicons:exclamation-triangle',
    info: 'heroicons:information-circle'
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>