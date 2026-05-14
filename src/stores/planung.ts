import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Besuch, Wochentag, BesuchsBericht, Folgeaktion } from '@/types'
import { mockBesuche } from '@/data/mockBesuche'
import { getMonday, addDays, isSameDay } from '@/utils/dates'

const WOCHENTAGE: Wochentag[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr']

export const usePlanungStore = defineStore('planung', () => {
  const besuche = ref<Besuch[]>(mockBesuche)
  const wocheStart = ref<Date>(getMonday(new Date()))
  const selectedTag = ref<Wochentag>('Mo')
  const detailKundeId = ref<string | null>(null)
  const showKundenDetail = ref(false)
  const berichte = ref<BesuchsBericht[]>([])
  const folgeaktionen = ref<Folgeaktion[]>([])

  function tagDatum(tag: Wochentag): Date {
    const idx = WOCHENTAGE.indexOf(tag)
    return addDays(wocheStart.value, idx)
  }

  function besucheForTag(tag: Wochentag): Besuch[] {
    const datum = tagDatum(tag)
    return besuche.value
      .filter((b) => isSameDay(b.datum, datum))
      .sort((a, b) => a.startzeit.localeCompare(b.startzeit))
  }

  const besucheForWeek = computed((): Besuch[] =>
    besuche.value.filter((b) => {
      const start = wocheStart.value
      const end = addDays(start, 4)
      return b.datum >= start && b.datum <= end
    })
  )

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

  const heutigeBesuche = computed((): Besuch[] =>
    besuche.value
      .filter((b) => isSameDay(b.datum, new Date()))
      .sort((a, b) => a.startzeit.localeCompare(b.startzeit))
  )

  function besuchAbschliessen(
    id: string,
    bericht: BesuchsBericht,
    aktionen: Folgeaktion[]
  ) {
    const b = besuche.value.find((b) => b.id === id)
    if (b) b.status = 'abgeschlossen'
    berichte.value.push(bericht)
    folgeaktionen.value.push(...aktionen)
  }

  function getBerichtForBesuch(besuchId: string): BesuchsBericht | undefined {
    return berichte.value.find((b) => b.besuchId === besuchId)
  }

  function folgeaktionErledigen(id: string) {
    const f = folgeaktionen.value.find((f) => f.id === id)
    if (f) f.erledigt = true
  }

  function openKundenDetail(kundeId: string) {
    detailKundeId.value = kundeId
    showKundenDetail.value = true
  }

  function closeKundenDetail() {
    showKundenDetail.value = false
    setTimeout(() => { detailKundeId.value = null }, 300)
  }

  return {
    besuche,
    wocheStart,
    selectedTag,
    detailKundeId,
    showKundenDetail,
    berichte,
    folgeaktionen,
    heutigeBesuche,
    tagDatum,
    besucheForTag,
    besucheForWeek,
    vorigeWoche,
    naechsteWoche,
    besuchAlsAusgefallen,
    besuchAbschliessen,
    besuchHinzufuegen,
    getBerichtForBesuch,
    routeNeuAnordnen,
    openKundenDetail,
    closeKundenDetail,
    folgeaktionErledigen,
    WOCHENTAGE
  }
})
