import * as antd from '@vicons/antd';
import * as carbon from '@vicons/carbon';
import * as ionicons5 from '@vicons/ionicons5';
import { RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import type { AppRouteRecordRaw } from '@/router/types';
import { renderIcon } from '@/utils/index';

import { useUserStore } from '@/store/modules/user';
const iconLists = <any>{ ...antd, ...carbon, ...ionicons5 };
const Iframe = () => import('@/views/Public/iframe/index.vue');
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', Layout);
LayoutMap.set('IFRAME', Iframe);
LayoutMap.set('PARENTLAYOUT', ParentLayout);

function sortRoute(a, b) {
  return (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0);
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generateRoutes = (routerMap, parent?): any[] => {
  return routerMap
    .map((item) => {
      const currentRoute: any = {
        // 路由地址 动态拼接生成如 /dashboard/workplace
        path: `${(parent && parent.path) ?? ''}/${item.path}`,
        // 路由名称，建议唯一
        name: item.name ?? '',
        // 该路由对应页面的 组件
        component: item.component,
        // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
        meta: {
          ...item.meta,
          label: item.meta.title,
          icon: iconLists[item.meta.icon] ? renderIcon(iconLists[item.meta.icon]) : null,
          permissions: item.meta.permissions || null,
          // 菜单id
          menuId: item.menuId,
        },
      };

      // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
      currentRoute.path = currentRoute.path.replace('//', '/');
      // 重定向
      item.redirect && (currentRoute.redirect = item.redirect);
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        const menuChildren = item.children.filter((item) => item.menuType !== 2);
        if (menuChildren.length <= 0) return currentRoute;
        !item.redirect && (currentRoute.redirect = `${item.path}/${menuChildren[0].path}`);
        currentRoute.children = generateRoutes(menuChildren, currentRoute);
      }
      return currentRoute;
    })
    .sort(sortRoute);
};

function flattenTree(tree) {
  let i = 0;
  while (i < tree.length) {
    const node = tree[i];
    if (node.name === 'PARENTLAYOUT') {
      const children = node.children || [];
      tree.splice(i, 1, ...children);
    } else {
      i++;
      flattenTree(node.children || []);
    }
  }
}
/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generateDynamicRoutes = async (): Promise<RouteRecordRaw[]> => {
  const userStore = useUserStore();
  const list = toRaw(userStore.currentApp.menu);
  flattenTree(list);
  const router = generateRoutes(list);
  asyncImportRoute(router);
  return router;
};
/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Recordable>>;
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): void => {
  viewsModules = viewsModules || import.meta.glob('../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    // if (!item.component && item.meta?.frameSrc) {
    //   item.component = 'IFRAME';
    // }
    if (item.url) {
      item.meta.frameSrc = item.component;
      item.component = 'IFRAME';
    }
    const { component, name } = item;
    const { children } = item;
    // TODO判断是否URL
    if (component) {
      const layoutFound = LayoutMap.get(component as string);
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(viewsModules, component as string);
      }
    } else if (name) {
      item.component = ParentLayout;
    }
    children && asyncImportRoute(children);
  });
};

/**
 * 动态导入
 * */
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
};
