import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import authService from '../Services/authService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import ('../views/HomePage.vue'),
    meta: {
      isPublic: false 
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import ('../views/ProfilePage.vue'),
    meta: {
      isPublic: false 
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import ('../views/LoginPage.vue'),
    meta: {
      isPublic: true 
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import ('../views/RegisterPage.vue'),
    meta: {
      isPublic: true 
    }
  },
  {
    path: '/set/password',
    name: 'setPassword',
    component: () => import ('../views/SetPasswordPage.vue'),
    meta: {
      isPublic: true 
    }
  },
  {
    path: '/set/password/complete',
    name: 'setPasswordComplete',
    component: () => import ('../views/SetPasswordCompletePage.vue'),
    meta: {
      isPublic: true 
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import ('../views/WelcomePage.vue'),
    meta: {
      isPublic: true 
    }
  },
  {
    path: '/verification/:EMailAddress/:Type/:VerificationType',
    name: 'verification',
    component: () => import ('../views/VerificationPage.vue'),
    meta: {
      isPublic: true 
    }
  },
  {
    path: '/register/complete',
    name: 'registerComplete',
    component: () => import ('../views/RegisterCompletePage.vue'),
    meta: {
      isPublic: true 
    }
  },
  
  {
    path: '/verification/options/:EMailAddress/:Type',
    name: 'verificationOptions',
    component: () => import ('../views/VerificationOptions.vue'),
    meta: {
      isPublic: true 
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
/* 
router.beforeEach(async (to, from, next) => {

  var isGoingToPublicPage = to.matched.some(record => record.meta.isPublic);

  if (isGoingToPublicPage) return next();

  if (!isGoingToPublicPage) {
    var isAuthenticated = await authService();
    if (isAuthenticated) return next();
    return next({ name: 'login'});
  } else return next();
});
 */

export default router