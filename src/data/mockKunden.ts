import type { Kunde } from '@/types'
import { d } from '@/utils/dates'

export const mockKunden: Kunde[] = [
  {
    id: 'k01',
    name: 'Schmuckmanufaktur Kessler & Söhne GmbH',
    kundennummer: 'KD-20001',
    adresse: 'Deimlingstraße 42, 75172 Pforzheim',
    lat: 48.8822, lng: 8.7073,
    branche: 'Schmuckindustrie',
    abcStatus: 'A',
    letzterBesuch: d('2026-05-11'),
    umsatzPotenzial: 185000
  },
  {
    id: 'k02',
    name: 'Precision Metalworks AG',
    kundennummer: 'KD-20002',
    adresse: 'Schanzstraße 28, 75172 Pforzheim',
    lat: 48.8805, lng: 8.7089,
    branche: 'Metallverarbeitung',
    abcStatus: 'A',
    letzterBesuch: d('2026-05-12'),
    umsatzPotenzial: 220000
  },
  {
    id: 'k03',
    name: 'Schwarzwälder Uhrwerke GmbH',
    kundennummer: 'KD-20003',
    adresse: 'Luisenstraße 15, 75175 Pforzheim',
    lat: 48.8897, lng: 8.7145,
    branche: 'Uhrenindustrie',
    abcStatus: 'A',
    letzterBesuch: d('2026-05-11'),
    umsatzPotenzial: 275000
  },
  {
    id: 'k04',
    name: 'Mühlacker Kunststoffwerke KG',
    kundennummer: 'KD-20004',
    adresse: 'Industriestraße 11, 75417 Mühlacker',
    lat: 48.9546, lng: 8.7839,
    branche: 'Kunststoffverarbeitung',
    abcStatus: 'A',
    letzterBesuch: d('2026-05-13'),
    umsatzPotenzial: 165000
  },
  {
    id: 'k05',
    name: 'TechSolutions Bretten AG',
    kundennummer: 'KD-20005',
    adresse: 'Melanchthonstraße 8, 75015 Bretten',
    lat: 49.0072, lng: 8.7467,
    branche: 'IT & Software',
    abcStatus: 'A',
    letzterBesuch: d('2026-05-13'),
    umsatzPotenzial: 145000
  },
  {
    id: 'k06',
    name: 'Galvanik Birkenfeld GmbH',
    kundennummer: 'KD-20006',
    adresse: 'Wörthstraße 34, 75217 Birkenfeld',
    lat: 48.9031, lng: 8.6645,
    branche: 'Galvanische Beschichtung',
    abcStatus: 'A',
    letzterBesuch: d('2026-05-11'),
    umsatzPotenzial: 198000
  },
  {
    id: 'k07',
    name: 'Ispringer Feinmechanik GmbH',
    kundennummer: 'KD-20007',
    adresse: 'Karlstraße 52, 75180 Ispringen',
    lat: 48.8656, lng: 8.7512,
    branche: 'Feinmechanik & Präzisionsteile',
    abcStatus: 'A',
    letzterBesuch: d('2026-04-08'),
    umsatzPotenzial: 210000
  },
  {
    id: 'k08',
    name: 'AutoSupply Niefern GmbH',
    kundennummer: 'KD-20008',
    adresse: 'Hauptstraße 67, 75223 Niefern-Öschelbronn',
    lat: 48.9265, lng: 8.6912,
    branche: 'Automobilzulieferer',
    abcStatus: 'B',
    letzterBesuch: d('2026-03-22'),  // KW20 ausgefallen
    umsatzPotenzial: 89000
  },
  {
    id: 'k09',
    name: 'Remchingen Druckerei AG',
    kundennummer: 'KD-20009',
    adresse: 'Schulstraße 21, 75196 Remchingen',
    lat: 48.9521, lng: 8.8045,
    branche: 'Druckerei & Medien',
    abcStatus: 'B',
    letzterBesuch: d('2026-05-12'),
    umsatzPotenzial: 72000
  },
  {
    id: 'k10',
    name: 'Königsbach Elektrik KG',
    kundennummer: 'KD-20010',
    adresse: 'Ringstraße 44, 75203 Königsbach-Stein',
    lat: 48.9445, lng: 8.6834,
    branche: 'Elektrotechnik',
    abcStatus: 'B',
    letzterBesuch: d('2026-05-14'),
    umsatzPotenzial: 105000
  },
  {
    id: 'k11',
    name: 'Neuenbürg Maschinenbau GmbH',
    kundennummer: 'KD-20011',
    adresse: 'Mühlstraße 17, 75245 Neuenbürg',
    lat: 48.8934, lng: 8.9145,
    branche: 'Maschinenbau',
    abcStatus: 'B',
    letzterBesuch: d('2026-05-14'),
    umsatzPotenzial: 134000
  },
  {
    id: 'k12',
    name: 'Bad Wildbad Wellness GmbH',
    kundennummer: 'KD-20012',
    adresse: 'Schwarzwaldstraße 39, 75323 Bad Wildbad',
    lat: 48.7612, lng: 8.5567,
    branche: 'Tourismus & Hospitality',
    abcStatus: 'B',
    letzterBesuch: d('2026-05-14'),
    umsatzPotenzial: 58000
  },
  {
    id: 'k13',
    name: 'Straubenhardt Kunststofftechnik AG',
    kundennummer: 'KD-20013',
    adresse: 'Industriepark 7, 75334 Straubenhardt',
    lat: 49.0134, lng: 8.6789,
    branche: 'Kunststoffverarbeitung',
    abcStatus: 'C',
    letzterBesuch: d('2026-05-15'),
    umsatzPotenzial: 42000
  },
  {
    id: 'k14',
    name: 'Keltern IT Services GmbH',
    kundennummer: 'KD-20014',
    adresse: 'Hauptstraße 88, 75236 Keltern',
    lat: 49.0512, lng: 8.8234,
    branche: 'IT & Software',
    abcStatus: 'C',
    letzterBesuch: d('2026-05-15'),
    umsatzPotenzial: 35000
  },
  {
    id: 'k15',
    name: 'Kämpfelbach Logistics KG',
    kundennummer: 'KD-20015',
    adresse: 'Gewerbestraße 19, 75337 Kämpfelbach',
    lat: 48.9234, lng: 8.9102,
    branche: 'Logistik & Transport',
    abcStatus: 'C',
    letzterBesuch: d('2026-05-15'),
    umsatzPotenzial: 48000
  }
]
