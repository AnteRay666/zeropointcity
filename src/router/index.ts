// router/index.ts
import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AboutView from "../views/AboutView.vue"
import AuthPage from "../views/AuthPage.vue"
import DefaultLayout from "../Layouts/DefaultLayout.vue"

const BASE_URL = import.meta.env.VITE_BASE_URL

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
        meta: {
          title: "Zero Point City - 首页",
          description: "Zero Point City 首页",
          canonical: `${BASE_URL}/`,
        },
      },
      {
        path: "/member",
        name: "member",
        component: () => import("../views/MembersView.vue"),
        meta: {
          title: "Zero Point City - 成员列表",
          description: "访问 Zero Point City 的成员列表",
          canonical: `${BASE_URL}/member`,
        },
      },
      {
        path: "/memory",
        name: "memory",
        component: () => import("../views/MemoryView.vue"),
        meta: {
          title: "Zero Point City - 记忆",
          description: "访问 Zero Point City 的记忆",
          canonical: `${BASE_URL}/memory`,
        },
      },
      {
        path: "about",
        name: "about",
        component: AboutView,
        meta: {
          title: "Zero Point City - 关于",
          description: "关于 Zero Point City 的介绍与理念。",
          canonical: `${BASE_URL}/about`,
        },
      },

      {
        path: "contact",
        name: "contact",
        component: () => import("../views/ContactView.vue"),
        meta: {
          title: "Zero Point City - 联系",
          description: "联系我们，探索 Zero Point City。",
          canonical: `${BASE_URL}/contact`,
        },
      },
    ],
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthPage,
    meta: {
      title: "Zero Point City - 认证",
      description: "访问 Zero Point City 的认证页面。",
      canonical: `${BASE_URL}/auth`,
    },
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 认证逻辑 ---
router.beforeEach((to, from, next) => {
  const inputAuth = localStorage.getItem("auth")
  const SECRET = import.meta.env.VITE_AUTH_SECRET

  if (inputAuth !== SECRET && to.path !== "/auth") {
    next("/auth")
  } else if (inputAuth === SECRET && to.path === "/auth") {
    next("/")
  } else {
    next()
  }
})

// --- 动态 meta 更新 ---
router.afterEach((to) => {
  // 更新标题
  if (to.meta.title) document.title = to.meta.title as string

  // 更新 canonical
  let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']")
  if (!link) {
    link = document.createElement("link")
    link.setAttribute("rel", "canonical")
    document.head.appendChild(link)
  }
  if (to.meta.canonical) link.setAttribute("href", to.meta.canonical as string)

  // 更新 description
  let desc: HTMLMetaElement | null = document.querySelector("meta[name='description']")
  if (!desc) {
    desc = document.createElement("meta")
    desc.setAttribute("name", "description")
    document.head.appendChild(desc)
  }
  if (to.meta.description) desc.setAttribute("content", to.meta.description as string)
})

export default router
