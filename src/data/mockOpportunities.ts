import type { Opportunity } from '@/types'
import { d } from '@/utils/dates'

export const mockOpportunities: Opportunity[] = [
  { id: 'op01', kundeId: 'k01', titel: 'Maschinenpark-Upgrade 2026', wert: 85000, status: 'offen', abschlussDatum: d('2026-07-31') },
  { id: 'op02', kundeId: 'k01', titel: 'Wartungsvertrag Verlängerung', wert: 24000, status: 'offen', abschlussDatum: d('2026-06-30') },
  { id: 'op03', kundeId: 'k02', titel: 'KI-Plattform Enterprise Lizenz', wert: 72000, status: 'offen', abschlussDatum: d('2026-06-15') },
  { id: 'op04', kundeId: 'k02', titel: 'Schulungspaket 2026', wert: 18000, status: 'gewonnen', abschlussDatum: d('2026-04-30') },
  { id: 'op05', kundeId: 'k03', titel: 'Lagerautomatisierung Phase 2', wert: 120000, status: 'offen', abschlussDatum: d('2026-09-30') },
  { id: 'op06', kundeId: 'k03', titel: 'Fleet-Management Software', wert: 35000, status: 'offen', abschlussDatum: d('2026-07-15') },
  { id: 'op07', kundeId: 'k04', titel: 'Laborequipment Kompletterneuerung', wert: 180000, status: 'offen', abschlussDatum: d('2026-08-31') },
  { id: 'op08', kundeId: 'k04', titel: 'Compliance-Software Modul', wert: 42000, status: 'gewonnen', abschlussDatum: d('2026-03-31') },
  { id: 'op09', kundeId: 'k05', titel: 'API-Integration Paket', wert: 28000, status: 'offen', abschlussDatum: d('2026-06-30') },
  { id: 'op10', kundeId: 'k06', titel: 'Forschungsplattform Upgrade', wert: 55000, status: 'offen', abschlussDatum: d('2026-10-31') },
  { id: 'op11', kundeId: 'k07', titel: 'Medienmanagementsystem', wert: 38000, status: 'offen', abschlussDatum: d('2026-07-31') },
  { id: 'op12', kundeId: 'k08', titel: 'ERP-Anbindung Modul', wert: 22000, status: 'verloren', abschlussDatum: d('2026-03-31') },
  { id: 'op13', kundeId: 'k09', titel: 'Servicevertrags-Verlängerung 3 Jahre', wert: 29000, status: 'offen', abschlussDatum: d('2026-06-15') },
  { id: 'op14', kundeId: 'k10', titel: 'Baustellenmanagement-App', wert: 45000, status: 'offen', abschlussDatum: d('2026-08-31') },
  { id: 'op15', kundeId: 'k11', titel: 'Warenwirtschaftssystem', wert: 31000, status: 'offen', abschlussDatum: d('2026-07-31') }
]
