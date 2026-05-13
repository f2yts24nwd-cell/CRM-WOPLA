import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Besuch, Wochentag } from '@/types'
import { mockBesuche } from '@/data/mockBesuche'
import { getMonday, addDays, isSameDay } from '@/utils/dates'

const WOCHENTAGE: Wochentag[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr']

export const usePlanungStore = defineStore('planung', () => {
  const besuche = ref<Besuch[]>(mockBesuche)
  const wocheStart = ref<Date>(getMonday(new Date()))
  const selectedTag = ref<Wochentag>('Mo')
  const detailKundeId = ref<string | null>(null)
  const showKundenDetail = ref(false)

  function tagDatum(tag: Wochentag): Date {
    const idx = WOCHENTAGE.indexOf(tag)
    return addDays(wocheStart.value, idx)
  }

  const besucheForTag = computed(() => (tag: Wochentag): Besuch[] => {
    const datum = tagDatum(tag)
    return besuche.value
      .filter((b) => isSameDay(b.datum, datum))
      .sort((a, b) => a.startzeit.localeCompare(b.startzeit))
  })

  const besucheForWeek = computed((): Besuch[] => {
    return besuche.value.filter((b) => {
      const tag = b.datum
      const start = wocheStart.value
      const end = addDays(start, 4)
      return tag >= start && tag <= end
    })
  })

  function vorigeWoche() {
    wocheStart.value = addDays(wocheStart.value, -7)
  }

  function naechsteWoche() {
    wocheStart.value = addDays(wocheStart.value, 7)
  }

  function besuchAlsAusgefallen(id: string) {
    const b = besuche.value.find((b) => b.id === id)
    if (b) b.status = 'ausgefallen'
  }

  function besuchHinzufuegen(kundeId: string, datum: Date, startzeit: string, endzeit: string) {
    besuche.value.push({
      id: crypto.randomUUID(),
      kundeId,
      datum,
      startzeit,
      endzeit,
      notiz: '',
      status: 'geplant'
    })
  }

  function routeNeuAnordnen(tag: Wochentag, orderedIds: string[]) {
    const datum = tagDatum(tag)
    const tagBesuche = besuche.value.filter((b) => isSameDay(b.datum, datum))
    const times = tagBesuche
      .map((b) => ({ start: b.startzeit, end: b.endzeit }))
      .sort((a, b) => a.start.localeCompare(b.start))

    orderedIds.forEach((id, i) => {
      const besuch = besuche.value.find((b) => b.id === id)
      if (besuch && times[i]) {
        besuch.startzeit = times[i].start
        besuch.endzeit = times[i].end
      }
    })
  }

  function openKundenDetail(kundeId: string) {
    detailKundeId.value = kundeId
    showKundenDetail.value = true
  }

  function closeKundenDetail() {
    showKundenDetail.value = false
    setTimeout(() => {
      detailKundeId.value = null
    }, 300)
  }

  return {
    besuche,
    wocheStart,
    selectedTag,
    detailKundeId,
    showKundenDetail,
    tagDatum,
    besucheForTag,
    besucheForWeek,
    vorigeWoche,
    naechsteWoche,
    besuchAlsAusgefallen,
    besuchHinzufuegen,
    routeNeuAnordnen,
    openKundenDetail,
    closeKundenDetail,
    WOCHENTAGE
  }
})
