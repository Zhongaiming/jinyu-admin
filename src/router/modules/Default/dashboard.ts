import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DashboardOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'dashboard';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: routeName,
    redirect: '/dashboard/workplace',
    component: Layout,
    meta: {
      title: 'Dashboard',
      icon: renderIcon(DashboardOutlined),
      // permissions: ['dashboard_console', 'dashboard_console', 'dashboard_workplace'],
      sort: 0,
    },
    children: [
      // {
      //   path: 'console',
      //   name: `${routeName}_console`,
      //   meta: {
      //     title: '主控台',
      //     // permissions: ['dashboard_console'],
      //     affix: true,
      //   },
      //   component: () => import('@/views/dashboard/console/console.vue'),
      // },
      // {
      //   path: 'monitor',
      //   name: `${ routeName }_monitor`,
      //   meta: {
      //     title: '监控页',
      //     permissions: ['dashboard_monitor']
      //   },
      //   component: () => import('@/views/dashboard/monitor/monitor.vue')
      // },
      {
        path: 'workplace',
        name: `${routeName}_workplace`,
        meta: {
          title: '工作台',
          keepAlive: true,
          affix: true,
          // permissions: ['dashboard_workplace'],
        },
        component: () => import('@/views/Default/dashboard/workplace/workplace.vue'),
      },
      {
        path: 'applist',
        name: `moreAppList`,
        meta: {
          title: '更多应用',
          keepAlive: true,
          affix: true,
          hidden: true,
          activeName: 'workplace',
          // permissions: ['dashboard_workplace'],
        },
        component: () => import('@/views/Default/dashboard/applist/applist.vue'),
      },
      {
        path: 'messageList',
        name: `messageList`,
        meta: {
          title: '消息列表',
          keepAlive: true,
          affix: true,
          hidden: true,
          activeName: 'workplace',
        },
        component: () => import('@/views/Default/dashboard/message/message.vue'),
      },
      {
        path: 'newsList',
        name: `newsList`,
        meta: {
          title: '新闻列表',
          keepAlive: true,
          affix: true,
          hidden: true,
          activeName: 'workplace',
        },
        component: () => import('@/views/Default/dashboard/news/news.vue'),
      },
    ],
  },
];

export default routes;
