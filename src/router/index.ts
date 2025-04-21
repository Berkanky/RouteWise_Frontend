import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import ('../views/HomePage.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import ('../views/ProfilePage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import ('../views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import ('../views/RegisterPage.vue')
  },
  {
    path: '/set/password',
    name: 'setPassword',
    component: () => import ('../views/SetPasswordPage.vue')
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import ('../views/WelcomePage.vue')
  },
  {
    path: '/verification/:EMailAddress/:Type',
    name: 'verification',
    component: () => import ('../views/VerificationPage.vue')
  },
  {
    path: '/register/complete',
    name: 'registerComplete',
    component: () => import ('../views/RegisterCompletePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
