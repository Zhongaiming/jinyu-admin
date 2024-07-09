import { resultSuccess } from '../_util';

const menusList = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'LAYOUT',
    redirect: '/dashboard/console',
    meta: {
      icon: 'DashboardOutlined',
      title: 'Dashboard',
    },
    children: [
      {
        path: 'console',
        name: 'dashboard_console',
        component: '/dashboard/console/console',
        meta: {
          title: '主控台',
        },
      },
      {
        path: 'monitor',
        name: 'dashboard_monitor',
        component: '/dashboard/monitor/monitor',
        meta: {
          title: '监控页',
        },
      },
      {
        path: 'workplace',
        name: 'dashboard_workplace',
        component: '/dashboard/workplace/workplace',
        meta: {
          hidden: false,
          title: '工作台',
        },
      },
      {
        path: 'applicationManage',
        name: 'dashboard_application_manage',
        component: '/setting/applicationManage/applicationManage',
        meta: {
          hidden: false,
          title: '应用管理',
        },
      },
    ],
  },
];

export default [
  {
    url: '/api/admin/menus',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(menusList);
    },
  },
];
