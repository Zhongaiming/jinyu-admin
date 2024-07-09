import { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { RedirectRoute, page404Route } from '@/router/base';
import { PageEnum } from '@/enums/pageEnum';
import { createRouterGuards } from './guards';
import type { IModuleType } from './types';

const modules = import.meta.glob<IModuleType>('./modules/**/*.ts', {
  eager: true,
});
const publicModules = import.meta.glob<IModuleType>('./public/**/*.ts', {
  eager: true,
});

const routeModuleList: RouteRecordRaw[] = Object.keys(modules).reduce((list, key) => {
  const mod = modules[key].default ?? {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  return [...list, ...modList];
}, []);
const PublicRouteModuleList: RouteRecordRaw[] = Object.keys(publicModules).reduce((list, key) => {
  const mod = publicModules[key].default ?? {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  return [...list, ...modList];
}, []);

function sortRoute(a, b) {
  return (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0);
}

routeModuleList.sort(sortRoute);
PublicRouteModuleList.sort(sortRoute);

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/Public/login/index.vue'),
  meta: {
    title: '登录',
  },
};
export const UnifiedLogin: RouteRecordRaw = {
  path: '/unifiedLogin',
  name: 'UnifiedLogin',
  component: () => import('@/views/Public/login/unifiedLogin.vue'),
  meta: {
    title: '统一登录',
    ignoreAuth: true,
  },
};

// export const publicRoute: RouteRecordRaw = {
//   path: '/login',
//   name: 'Login',
//   component: () => import('@/views/login/index.vue'),
//   meta: {
//     title: '登录',
//   },
// };

//需要验证权限
export const asyncRoutes = [...routeModuleList];
export const asyncPublicRoutes = [...PublicRouteModuleList];

//普通路由 无需验证权限
export const constantRouter: RouteRecordRaw[] = [
  LoginRoute,
  UnifiedLogin,
  RootRoute,
  RedirectRoute,
  page404Route,
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router;
