import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CodepenCircleOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'component';

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
    path: '/component',
    name: routeName,
    redirect: '/component/message',
    component: Layout,
    meta: {
      title: '组件管理',
      icon: renderIcon(CodepenCircleOutlined),
      sort: 5,
    },
    children: [
      {
        path: 'messageCenter',
        name: `messageCenter`,
        meta: {
          title: '消息中心',
          keepAlive: true,
          affix: true,
        },
        component: () => import('@/views/System/component/message/message.vue'),
      },
      {
        path: 'msgAuthApp',
        name: `msgAuthApp`,
        meta: {
          title: '消息授权应用',
          keepAlive: true,
          hidden: true,
          activeName: 'messageCenter',
          affix: true,
        },
        component: () => import('@/views/System/component/msgAuthApp/msgAuthApp.vue'),
      },
      {
        path: 'newsCenter',
        name: `newsCenter`,
        meta: {
          title: '新闻中心',
          keepAlive: true,
          affix: true,
        },
        component: () => import('@/views/System/component/news/news.vue'),
      },
      {
        path: 'newsAuthApp',
        name: `newsAuthApp`,
        meta: {
          title: '新闻授权应用',
          keepAlive: true,
          affix: true,
        },
        component: () => import('@/views/System/component/newsAuthApp/newsAuthApp.vue'),
      },
    ],
  },
];

export default routes;
