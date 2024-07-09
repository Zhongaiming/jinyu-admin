import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CodeSandboxOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'version';

const routes: Array<RouteRecordRaw> = [
  {
    path: `/${routeName}`,
    name: routeName,
    redirect: `/${routeName}/spokenLanguage`,
    component: Layout,
    meta: {
      title: '版本管理',
      icon: renderIcon(CodeSandboxOutlined),
      sort: 999,
    },
    children: [
      {
        path: 'spokenLanguage',
        name: 'spokenLanguage',
        meta: {
          title: '口语大师',
          keepAlive: true,
          affix: true,
        },
        component: () => import('@/views/Version/spokenLanguage/index.vue'),
      },
    ],
  },
];

export default routes;
