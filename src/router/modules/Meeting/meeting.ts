import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CodeSandboxOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'meeting';

const routes: Array<RouteRecordRaw> = [
  {
    path: `/${routeName}`,
    name: routeName,
    redirect: `/${routeName}/index`,
    component: Layout,
    meta: {
      title: '会议管理',
      icon: renderIcon(CodeSandboxOutlined),
      sort: 999,
    },
    children: [
      {
        path: 'index',
        name: `${routeName}Index`,
        meta: {
          title: '主页',
          keepAlive: true,
          affix: true,
        },
        component: () => import('@/views/Meeting/index.vue'),
      },
      {
        path: 'archives',
        name: `MeetingArchives`,
        meta: {
          title: '会议档案',
          keepAlive: true,
        },
        component: () => import('@/views/Meeting/archives/archives.vue'),
      },
      {
        path: 'minute',
        name: `MeetingMinute`,
        meta: {
          title: '新闻详情',
          keepAlive: true,
          affix: false,
          hidden: true,
          activeMenu: `${routeName}Index`,
        },
        component: () => import('@/views/Meeting/minute/minute.vue'),
      },
    ],
  },
];

export default routes;
