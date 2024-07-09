import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CodeSandboxOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'news';

const routes: Array<RouteRecordRaw> = [
  {
    path: `/${routeName}`,
    name: routeName,
    redirect: `/${routeName}/articleManage`,
    component: Layout,
    meta: {
      title: '新闻中心',
      icon: renderIcon(CodeSandboxOutlined),
      sort: 888,
    },
    children: [
      {
        path: 'articleManage',
        name: `articleManage`,
        meta: {
          title: '文章管理',
          keepAlive: true,
        },
        component: () => import('@/views/News/news/articleManage/articleManage.vue'),
      },
      {
        path: 'columnManage',
        name: `columnManage`,
        meta: {
          title: '栏目管理',
          keepAlive: true,
        },
        component: () => import('@/views/News/news/columnManage/columnManage.vue'),
      },
      {
        path: 'addEditcolumn',
        name: `addEditcolumn`,
        meta: {
          title: '新增编辑栏目',
          keepAlive: true,
          affix: true,
          hidden: true,
          activeName: 'columnManage',
        },
        component: () => import('@/views/News/news/addEditcolumn/addEditcolumn.vue'),
      },
      {
        path: 'articleTags',
        name: `articleTags`,
        meta: {
          title: '文章标签',
          keepAlive: true,
        },
        component: () => import('@/views/News/news/articleTags/articleTags.vue'),
      },
      {
        path: 'articleDetails',
        name: `articleDetails`,
        meta: {
          title: '文章详情',
          keepAlive: true,
        },
        component: () => import('@/views/News/news/articleDetails/articleDetails.vue'),
      },
      {
        path: 'pushRecords',
        name: `pushRecords`,
        meta: {
          title: '推送记录',
          keepAlive: true,
        },
        component: () => import('@/views/News/news/pushRecords/pushRecords.vue'),
      },
    ],
  },
];

export default routes;
