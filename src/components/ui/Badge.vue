<script setup lang="ts">
defineProps<{
  label: string
  variant: 'A' | 'B' | 'C' | 'geplant' | 'abgeschlossen' | 'ausgefallen' | 'offen' | 'gewonnen' | 'verloren' | 'Entwurf' | 'Gesendet' | 'Akzeptiert' | 'Abgelehnt'
}>()

const variantClass: Record<string, string> = {
  A: 'bg-primary-100 text-primary-700',
  B: 'bg-teal-100 text-teal-700',
  C: 'bg-gray-100 text-gray-600',
  geplant: 'bg-blue-100 text-blue-700',
  abgeschlossen: 'bg-green-100 text-green-700',
  ausgefallen: 'bg-red-100 text-red-700',
  offen: 'bg-blue-100 text-blue-700',
  gewonnen: 'bg-green-100 text-green-700',
  verloren: 'bg-red-100 text-red-700',
  Entwurf: 'bg-gray-100 text-gray-600',
  Gesendet: 'bg-blue-100 text-blue-700',
  Akzeptiert: 'bg-green-100 text-green-700',
  Abgelehnt: 'bg-red-100 text-red-700',
}
</script>

<template>
  <span :class="[variantClass[variant], 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold']">
    {{ label }}
  </span>
</template>
