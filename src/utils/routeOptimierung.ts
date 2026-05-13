import type { Besuch, Kunde } from '@/types'
import { haversine } from './geo'

export function nearestNeighborSort(
  besuche: Besuch[],
  kunden: Kunde[],
  startLat = 48.1374,
  startLng = 11.5754
): string[] {
  const kundeMap = new Map(kunden.map((k) => [k.id, k]))
  let currentLat = startLat
  let currentLng = startLng
  const remaining = [...besuche]
  const ordered: string[] = []

  while (remaining.length > 0) {
    let nearestIdx = 0
    let nearestDist = Infinity
    remaining.forEach((b, i) => {
      const k = kundeMap.get(b.kundeId)
      if (!k) return
      const dist = haversine(currentLat, currentLng, k.lat, k.lng)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIdx = i
      }
    })
    const nearest = remaining[nearestIdx]
    ordered.push(nearest.id)
    const nk = kundeMap.get(nearest.kundeId)!
    currentLat = nk.lat
    currentLng = nk.lng
    remaining.splice(nearestIdx, 1)
  }
  return ordered
}
