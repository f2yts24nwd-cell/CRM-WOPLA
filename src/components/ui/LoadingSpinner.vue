<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div :class="[
    'border-4 border-brand/20 border-t-brand rounded-full animate-spin',
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  ]" />
</template>
