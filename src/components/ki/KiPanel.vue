<script setup lang="ts">
import type { KiEmpfehlungResult, KiGespraechResult } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import KiEmpfehlung from './KiEmpfehlung.vue'

const props = defineProps<{
  titel: string
  isLoading: boolean
  empfehlungen?: KiEmpfehlungResult[]
  gespraech?: KiGespraechResult | null
  zieldatum?: Date
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'empfehlung-hinzugefuegt'): void
}>()
</script>

<template>
  <Transition name="slide-up">
    <div class="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-2xl"
         style="max-height: 75dvh; padding-bottom: env(safe-area-inset-bottom)">
      <!-- Handle + Header -->
      <div class="flex flex-col items-center pt-3 pb-2 border-b border-gray-100">
        <div class="w-10 h-1 bg-gray-200 rounded-full mb-3" />
        <div class="w-full flex items-center justify-between px-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <span class="font-semibold text-gray-900 text-sm">{{ titel }}</span>
          </div>
          <button @click="emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Inhalt -->
      <div class="overflow-y-auto" style="max-height: calc(75dvh - 80px)">
        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 gap-3">
          <LoadingSpinner size="lg" />
          <p class="text-sm text-gray-500 font-medium">KI analysiert...</p>
        </div>

        <!-- Empfehlungen -->
        <div v-else-if="empfehlungen && empfehlungen.length > 0" class="p-4 space-y-3">
          <KiEmpfehlung
            v-for="(emp, i) in empfehlungen"
            :key="emp.kunde.id"
            :empfehlung="emp"
            :rank="i + 1"
            :zieldatum="zieldatum"
            @hinzugefuegt="emit('empfehlung-hinzugefuegt')"
          />
        </div>

        <!-- Gesprächsvorbereitung -->
        <div v-else-if="gespraech" class="p-4 space-y-4">
          <div class="bg-primary-50 rounded-xl p-4">
            <p class="text-sm text-gray-700 leading-relaxed">{{ gespraech.zusammenfassung }}</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gesprächspunkte</h4>
            <ul class="space-y-2">
              <li v-for="(punkt, i) in gespraech.gespraechspunkte" :key="i"
                class="flex items-start gap-2 text-sm text-gray-700">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {{ i + 1 }}
                </span>
                {{ punkt }}
              </li>
            </ul>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-xs font-semibold text-gray-500 mb-1">Letzte Aktivität</p>
            <p class="text-sm text-gray-600">{{ gespraech.letzteAktivitaet }}</p>
          </div>
        </div>

        <!-- Leer -->
        <div v-else-if="!isLoading" class="flex flex-col items-center py-8 text-gray-400">
          <p class="text-sm">Keine Ergebnisse</p>
        </div>
      </div>
    </div>
  </Transition>
</template>
