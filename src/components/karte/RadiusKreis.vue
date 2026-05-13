<script setup lang="ts">
import { computed } from 'vue'
import { LCircle } from '@vue-leaflet/vue-leaflet'

const props = defineProps<{
  lat: number
  lng: number
  radiusM: number
}>()

const center = computed((): [number, number] => [props.lat, props.lng])
</script>

<template>
  <LCircle
    :lat-lng="center"
    :radius="radiusM"
    :color="'#F97316'"
    :fill-color="'#F97316'"
    :fill-opacity="0.08"
    :weight="2"
    :opacity="0.6"
  />
</template>
