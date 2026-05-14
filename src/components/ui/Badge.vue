<script setup lang="ts">
defineProps<{
  label: string
  variant: 'A' | 'B' | 'C' | 'geplant' | 'abgeschlossen' | 'ausgefallen' | 'offen' | 'gewonnen' | 'verloren' | 'Entwurf' | 'Gesendet' | 'Akzeptiert' | 'Abgelehnt'
}>()

// Fiori Object Status: nur Textfarbe, kein gefüllter Hintergrund
const variantClass: Record<string, string> = {
  A:            'text-info font-semibold',
  B:            'text-positive font-semibold',
  C:            'text-neutral font-semibold',
  geplant:      'text-info',
  abgeschlossen:'text-positive',
  ausgefallen:  'text-negative',
  offen:        'text-info',
  gewonnen:     'text-positive',
  verloren:     'text-negative',
  Entwurf:      'text-text2',
  Gesendet:     'text-info',
  Akzeptiert:   'text-positive',
  Abgelehnt:    'text-negative',
}
</script>

<template>
  <span :class="[variantClass[variant], 'inline-flex items-center text-xs']">
    {{ label }}
  </span>
</template>
