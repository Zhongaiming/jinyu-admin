import type { RouteRecordRaw } from 'vue-router';
import { isNavigationFailure, Router } from 'vue-router';
import { useUser } from '@/store/modules/user';
import { useAsyncRoute } from '@/store/modules/asyncRoute';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { storage } from '@/utils/Storage';
import { PageEnum } from '@/enums/pageEnum';
import { ErrorPageRoute } from '@/router/base';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const UNIFIED_LOGIN_PATH = PageEnum.UNIFIED_LOGIN;
const whitePathList = [LOGIN_PATH, UNIFIED_LOGIN_PATH]; // no redirect whitelist

export function createRouterGuards(router: Router) {
  const userStore = useUser();
  const asyncRouteStore = useAsyncRoute();
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'] || null;
    Loading && Loading.start();
    if ((from.path === LOGIN_PATH || from.path === UNIFIED_LOGIN_PATH) && to.name === 'errorPage') {
      const currentApp = userStore.getCurrentApp;
      next(currentApp.menu[0]);
      //重定向
      // next(PageEnum.BASE_HOME);
      return;
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    const token = storage.get(ACCESS_TOKEN);
    if (!token) {
      // You can access without permissions. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // redirect login page
      const redirectData: {
        path: string;
        replace: boolean;
        query?: Recordable<string>;
      } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }
    if (asyncRouteStore.getIsDynamicRouteAdded) {
      return next();
    }
    const userInfo = await userStore.getInfo();
    if (!userInfo) {
      console.error('获取到的userInfo为空，重定向到login页面');
      next({ path: LOGIN_PATH, replace: true });
      return;
    }
    const routes = await asyncRouteStore.generateRoutes(userInfo);
    console.log(routes, 'routes');
    // 动态添加可访问路由表
    routes.forEach((item) => {
      router.addRoute(item as unknown as RouteRecordRaw);
    });

    //添加404
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    asyncRouteStore.setDynamicRouteAdded(true);
    next(nextData);
    Loading && Loading.finish();
  });

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title;
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
    const asyncRouteStore = useAsyncRoute();
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = asyncRouteStore.keepAliveComponents;
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == 'Redirect') {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
    const Loading = window['$loading'] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
