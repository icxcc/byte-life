<template>
  <UCard
    :class="cardClasses"
    :ui="{
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      header: { padding: headerPadding },
      body: { padding: bodyPadding },
      footer: { padding: footerPadding }
    }"
  >
    <template v-if="title || description || $slots.header" #header>
      <slot name="header">
        <div class="flex items-center justify-between">
          <div>
            <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
          </div>
          <div v-if="$slots.actions" class="flex items-center gap-2">
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'outline' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  padding: 'md'
})

const cardClasses = computed(() => {
  const classes = []
  
  // 变体样式
  switch (props.variant) {
    case 'outline':
      classes.push('border border-gray-200 dark:border-gray-800 bg-transparent')
      break
    case 'elevated':
      classes.push('shadow-lg border-0')
      break
    default:
      classes.push('bg-white dark:bg-gray-900 shadow-sm')
  }
  
  return classes.join(' ')
})

const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

const headerPadding = computed(() => paddingMap[props.padding])
const bodyPadding = computed(() => paddingMap[props.padding])
const footerPadding = computed(() => paddingMap[props.padding])
</script>