import type { Angebot } from '@/types'
import { d } from '@/utils/dates'

export const mockAngebote: Angebot[] = [
  { id: 'an01', opportunityId: 'op01', kundeId: 'k01', nummer: 'AN-2026-0042', summe: 82500, status: 'Gesendet', erstelltAm: d('2026-04-25') },
  { id: 'an02', opportunityId: 'op02', kundeId: 'k01', nummer: 'AN-2026-0031', summe: 23800, status: 'Akzeptiert', erstelltAm: d('2026-03-10') },
  { id: 'an03', opportunityId: 'op03', kundeId: 'k02', nummer: 'AN-2026-0058', summe: 71000, status: 'Gesendet', erstelltAm: d('2026-05-02') },
  { id: 'an04', opportunityId: 'op04', kundeId: 'k02', nummer: 'AN-2026-0028', summe: 18000, status: 'Akzeptiert', erstelltAm: d('2026-04-15') },
  { id: 'an05', opportunityId: 'op05', kundeId: 'k03', nummer: 'AN-2026-0061', summe: 115000, status: 'Entwurf', erstelltAm: d('2026-05-08') },
  { id: 'an06', opportunityId: 'op06', kundeId: 'k03', nummer: 'AN-2026-0045', summe: 34500, status: 'Gesendet', erstelltAm: d('2026-04-28') },
  { id: 'an07', opportunityId: 'op07', kundeId: 'k04', nummer: 'AN-2026-0071', summe: 175000, status: 'Entwurf', erstelltAm: d('2026-05-10') },
  { id: 'an08', opportunityId: 'op08', kundeId: 'k04', nummer: 'AN-2026-0020', summe: 42000, status: 'Akzeptiert', erstelltAm: d('2026-02-20') },
  { id: 'an09', opportunityId: 'op09', kundeId: 'k05', nummer: 'AN-2026-0055', summe: 27500, status: 'Gesendet', erstelltAm: d('2026-04-18') },
  { id: 'an10', opportunityId: 'op10', kundeId: 'k06', nummer: 'AN-2026-0063', summe: 53000, status: 'Entwurf', erstelltAm: d('2026-05-05') },
  { id: 'an11', opportunityId: 'op11', kundeId: 'k07', nummer: 'AN-2026-0048', summe: 37000, status: 'Gesendet', erstelltAm: d('2026-04-30') },
  { id: 'an12', opportunityId: 'op12', kundeId: 'k08', nummer: 'AN-2026-0015', summe: 21500, status: 'Abgelehnt', erstelltAm: d('2026-02-05') },
  { id: 'an13', opportunityId: 'op13', kundeId: 'k09', nummer: 'AN-2026-0052', summe: 28800, status: 'Gesendet', erstelltAm: d('2026-05-01') },
  { id: 'an14', opportunityId: 'op14', kundeId: 'k10', nummer: 'AN-2026-0067', summe: 44000, status: 'Entwurf', erstelltAm: d('2026-05-06') },
  { id: 'an15', opportunityId: 'op15', kundeId: 'k11', nummer: 'AN-2026-0039', summe: 30500, status: 'Gesendet', erstelltAm: d('2026-04-22') }
]
