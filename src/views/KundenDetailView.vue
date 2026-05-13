<script setup lang="ts">
import { useRouter } from 'vue-router'
import KundenDetail from '@/components/kunde/KundenDetail.vue'

defineProps<{ id: string }>()

const router = useRouter()
</script>

<template>
  <KundenDetail :kunden-id="id" @close="router.back()" />
</template>
