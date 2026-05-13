import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Kunde, Ansprechpartner, Aktivitaet, Opportunity, Angebot } from '@/types'
import { mockKunden } from '@/data/mockKunden'
import { mockAnsprechpartner } from '@/data/mockAnsprechpartner'
import { mockAktivitaeten } from '@/data/mockAktivitaeten'
import { mockOpportunities } from '@/data/mockOpportunities'
import { mockAngebote } from '@/data/mockAngebote'
import { haversine } from '@/utils/geo'

export const useKundenStore = defineStore('kunden', () => {
  const kunden = ref<Kunde[]>(mockKunden)
  const ansprechpartner = ref<Ansprechpartner[]>(mockAnsprechpartner)
  const aktivitaeten = ref<Aktivitaet[]>(mockAktivitaeten)
  const opportunities = ref<Opportunity[]>(mockOpportunities)
  const angebote = ref<Angebot[]>(mockAngebote)

  const getKundeById = computed(() => (id: string) => kunden.value.find((k) => k.id === id))

  const getAnsprechpartnerForKunde = computed(
    () => (kundeId: string) => ansprechpartner.value.filter((a) => a.kundeId === kundeId)
  )

  const getAktivitaetenForKunde = computed(
    () => (kundeId: string) =>
      aktivitaeten.value
        .filter((a) => a.kundeId === kundeId)
        .sort((a, b) => b.datum.getTime() - a.datum.getTime())
  )

  const getOpportunitiesForKunde = computed(
    () => (kundeId: string) =>
      opportunities.value
        .filter((o) => o.kundeId === kundeId)
        .sort((a, b) => b.abschlussDatum.getTime() - a.abschlussDatum.getTime())
  )

  const getAngeboteForKunde = computed(
    () => (kundeId: string) =>
      angebote.value
        .filter((a) => a.kundeId === kundeId)
        .sort((a, b) => b.erstelltAm.getTime() - a.erstelltAm.getTime())
  )

  function kundenImUmkreis(lat: number, lng: number, radiusKm: number): Kunde[] {
    return kunden.value.filter((k) => haversine(lat, lng, k.lat, k.lng) <= radiusKm)
  }

  return {
    kunden,
    ansprechpartner,
    aktivitaeten,
    opportunities,
    angebote,
    getKundeById,
    getAnsprechpartnerForKunde,
    getAktivitaetenForKunde,
    getOpportunitiesForKunde,
    getAngeboteForKunde,
    kundenImUmkreis
  }
})
