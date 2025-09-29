import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthPage from "../views/AuthPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/auth', name: 'authpage', component: AuthPage },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  ],
})

router.beforeEach((to, from, next) => {
  const inputAuth = localStorage.getItem("auth")     // 用户输入的口令
  const SECRET = import.meta.env.VITE_AUTH_SECRET   // .env 里的口令

  if (inputAuth !== SECRET && to.path !== "/auth") {
    // 没有认证或认证错误 → 强制去 /auth
    next("/auth")
  } else if (inputAuth === SECRET && to.path === "/auth") {
    // 已认证用户访问 /auth → 自动跳到首页
    next("/")
  } else {
    next()
  }
})

export default router
