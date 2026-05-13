import type { Kunde } from '@/types'
import { d } from '@/utils/dates'

export const mockKunden: Kunde[] = [
  {
    id: 'k01',
    name: 'Müller Maschinenbau GmbH',
    kundennummer: 'KD-10021',
    adresse: 'Leopoldstraße 42, 80802 München',
    lat: 48.1571, lng: 11.5823,
    branche: 'Maschinenbau',
    abcStatus: 'A',
    letzterBesuch: d('2026-03-05'),
    umsatzPotenzial: 125000
  },
  {
    id: 'k02',
    name: 'TechVision AG',
    kundennummer: 'KD-10022',
    adresse: 'Maximilianstraße 18, 80539 München',
    lat: 48.1396, lng: 11.5833,
    branche: 'IT & Software',
    abcStatus: 'A',
    letzterBesuch: d('2026-04-28'),
    umsatzPotenzial: 98000
  },
  {
    id: 'k03',
    name: 'Bogenhausen Logistik KG',
    kundennummer: 'KD-10023',
    adresse: 'Prinzregentenstraße 74, 81675 München',
    lat: 48.1432, lng: 11.6087,
    branche: 'Logistik',
    abcStatus: 'A',
    letzterBesuch: d('2026-02-14'),
    umsatzPotenzial: 145000
  },
  {
    id: 'k04',
    name: 'Bayern Pharma GmbH',
    kundennummer: 'KD-10024',
    adresse: 'Schillerstraße 30, 80336 München',
    lat: 48.1345, lng: 11.5589,
    branche: 'Pharmaindustrie',
    abcStatus: 'A',
    letzterBesuch: d('2026-04-15'),
    umsatzPotenzial: 210000
  },
  {
    id: 'k05',
    name: 'InnovateTech Solutions GmbH',
    kundennummer: 'KD-10025',
    adresse: 'Arabellastraße 5, 81925 München',
    lat: 48.1521, lng: 11.6345,
    branche: 'IT & Software',
    abcStatus: 'A',
    letzterBesuch: d('2026-04-02'),
    umsatzPotenzial: 87000
  },
  {
    id: 'k06',
    name: 'Garching Systems GmbH',
    kundennummer: 'KD-10026',
    adresse: 'Lichtenbergstraße 8, 85748 Garching',
    lat: 48.2490, lng: 11.6510,
    branche: 'Forschung & Entwicklung',
    abcStatus: 'B',
    letzterBesuch: d('2026-03-20'),
    umsatzPotenzial: 55000
  },
  {
    id: 'k07',
    name: 'Ismaning Digital KG',
    kundennummer: 'KD-10027',
    adresse: 'Münchner Straße 15, 85737 Ismaning',
    lat: 48.2290, lng: 11.6850,
    branche: 'Medienproduktion',
    abcStatus: 'B',
    letzterBesuch: d('2026-02-28'),
    umsatzPotenzial: 42000
  },
  {
    id: 'k08',
    name: 'Pasing Handel AG',
    kundennummer: 'KD-10028',
    adresse: 'Landsberger Str. 140, 81241 München',
    lat: 48.1463, lng: 11.4602,
    branche: 'Handel',
    abcStatus: 'B',
    letzterBesuch: d('2026-04-10'),
    umsatzPotenzial: 38000
  },
  {
    id: 'k09',
    name: 'Schwabing Service GmbH',
    kundennummer: 'KD-10029',
    adresse: 'Hohenzollernstraße 56, 80801 München',
    lat: 48.1634, lng: 11.5747,
    branche: 'Dienstleistungen',
    abcStatus: 'B',
    letzterBesuch: d('2026-03-01'),
    umsatzPotenzial: 29000
  },
  {
    id: 'k10',
    name: 'Unterschleißheim Bau KG',
    kundennummer: 'KD-10030',
    adresse: 'Raiffeisenstraße 12, 85716 Unterschleißheim',
    lat: 48.2800, lng: 11.5750,
    branche: 'Baugewerbe',
    abcStatus: 'B',
    letzterBesuch: d('2026-01-20'),
    umsatzPotenzial: 67000
  },
  {
    id: 'k11',
    name: 'Sendling Textil GmbH',
    kundennummer: 'KD-10031',
    adresse: 'Lindwurmstraße 88, 80337 München',
    lat: 48.1234, lng: 11.5512,
    branche: 'Textilhandel',
    abcStatus: 'B',
    letzterBesuch: d('2026-04-22'),
    umsatzPotenzial: 31000
  },
  {
    id: 'k12',
    name: 'Dachau Kunststoff AG',
    kundennummer: 'KD-10032',
    adresse: 'Augsburger Straße 45, 85221 Dachau',
    lat: 48.2601, lng: 11.4340,
    branche: 'Kunststoffverarbeitung',
    abcStatus: 'C',
    letzterBesuch: d('2025-11-30'),
    umsatzPotenzial: 14000
  },
  {
    id: 'k13',
    name: 'Germering Auto GmbH',
    kundennummer: 'KD-10033',
    adresse: 'Hauptstraße 22, 82110 Germering',
    lat: 48.1348, lng: 11.3710,
    branche: 'Automobilhandel',
    abcStatus: 'C',
    letzterBesuch: d('2026-01-08'),
    umsatzPotenzial: 11000
  },
  {
    id: 'k14',
    name: 'Haar Elektronik KG',
    kundennummer: 'KD-10034',
    adresse: 'Wasserburger Landstraße 32, 85540 Haar',
    lat: 48.1050, lng: 11.7263,
    branche: 'Elektronik',
    abcStatus: 'C',
    letzterBesuch: d('2025-12-15'),
    umsatzPotenzial: 18000
  },
  {
    id: 'k15',
    name: 'Ebersberg Holzwerke GmbH',
    kundennummer: 'KD-10035',
    adresse: 'Münchner Straße 3, 85560 Ebersberg',
    lat: 48.0732, lng: 11.9670,
    branche: 'Holzverarbeitung',
    abcStatus: 'C',
    letzterBesuch: d('2026-02-05'),
    umsatzPotenzial: 9000
  }
]
