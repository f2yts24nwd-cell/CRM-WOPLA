import { createRouter, createWebHistory } from 'vue-router'
import WochenPlanungView from '@/views/WochenPlanungView.vue'
import KarteVollbildView from '@/views/KarteVollbildView.vue'
import UmkreisSucheView from '@/views/UmkreisSucheView.vue'
import KundenDetailView from '@/views/KundenDetailView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'wochenplanung', component: WochenPlanungView },
    { path: '/karte', name: 'karte', component: KarteVollbildView },
    { path: '/umkreissuche', name: 'umkreissuche', component: UmkreisSucheView,
      props: (route) => ({ vorausgewaehlteBesuchId: route.query.besuchId as string | undefined }) },
    { path: '/kunden/:id', name: 'kundendetail', component: KundenDetailView, props: true }
  ]
})
