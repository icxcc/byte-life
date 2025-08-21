<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// 全局页面过渡配置
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  }
})
</script>

<style>
/* 全局页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 管理后台专用的快速过渡 */
.admin-page-enter-active,
.admin-page-leave-active {
  transition: all 0.15s ease-out;
}

.admin-page-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.admin-page-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.admin-page-enter-to,
.admin-page-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
