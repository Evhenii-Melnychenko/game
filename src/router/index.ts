import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const GameDetails = () => import('../pages/GameDetails.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/game/:id',
      name: 'game-details',
      component: GameDetails
    }
  ]
})

export default router
