import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/setting',
    name: 'Setting',
    redirect: '/setting/account',
    component: Layout,
    meta: {
      title: '设置页面',
      icon: renderIcon(SettingOutlined),
      sort: 5,
      alwaysShow: true,
    },
    children: [
      {
        path: 'applicationManage',
        name: 'applicationManage',
        meta: {
          title: '应用管理',
        },
        component: () => import('@/views/System/setting/applicationManage/applicationManage.vue'),
      },
      {
        path: 'menuConfig',
        name: 'menuConfig',
        meta: {
          title: '菜单权限管理',
          hidden: true,
          activeMenu: 'applicationManage',
        },
        component: () => import('@/views/System/setting/appMenu/appMenu.vue'),
      },
      {
        path: 'userManage',
        name: 'userManage',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/System/setting/userManage/userManage.vue'),
      },
      {
        path: 'addEditUser',
        name: 'addEditUser',
        meta: {
          title: '新增编辑用户',
          hidden: true,
        },
        component: () => import('@/views/System/setting/addEditUser/addEditUser.vue'),
      },
      {
        path: 'roleManage',
        name: 'roleManage',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/views/System/setting/roleManage/roleManage.vue'),
      },
      {
        path: 'addEditRole',
        name: 'addEditRole',
        meta: {
          title: '角色新增编辑',
          hidden: true,
          activeMenu: 'roleManage',
        },
        component: () => import('@/views/System/setting/addEditRole/addEditRole.vue'),
      },
      {
        path: 'departmentManage',
        name: 'departmentManage',
        meta: {
          title: '部门管理',
          hidden: false,
        },
        component: () => import('@/views/System/setting/departmentManage/departmentManage.vue'),
      },
      {
        path: 'postManage',
        name: 'postManage',
        meta: {
          title: '岗位管理',
          hidden: false,
        },
        component: () => import('@/views/System/setting/postManage/postManage.vue'),
      },
      {
        path: 'departmentPost',
        name: 'departmentPost',
        meta: {
          title: '部门岗位',
          hidden: true,
        },
        component: () => import('@/views/System/setting/departmentPost/departmentPost.vue'),
      },
      {
        path: 'dictManage',
        name: 'dictManage',
        meta: {
          title: '字典管理',
          hidden: false,
        },
        component: () => import('@/views/System/setting/dictManage/dictManage.vue'),
      },
      {
        path: 'staticDictData',
        name: 'staticDictData',
        meta: {
          title: '静态字典数据',
          hidden: true,
          activeMenu: 'dictManage',
        },
        component: () => import('@/views/System/setting/staticDictData/staticDictData.vue'),
      },
      {
        path: 'dynamicDictData',
        name: 'dynamicDictData',
        meta: {
          title: '动态字典数据',
          hidden: true,
          activeMenu: 'dictManage',
        },
        component: () => import('@/views/System/setting/dynamicDictData/dynamicDictData.vue'),
      },
      {
        path: 'permWord',
        name: 'permWord',
        meta: {
          title: '权限管理',
          hidden: false,
        },
        component: () => import('@/views/System/setting/permissionWord/permissionWord.vue'),
      },
      {
        path: 'systemConfig',
        name: 'systemConfig',
        meta: {
          title: '系统配置',
          hidden: false,
        },
        component: () => import('@/views/System/setting/systemConfig/systemConfig.vue'),
      },
      {
        path: 'jobPromotion',
        name: 'jobPromotion',
        meta: {
          title: '岗位升迁',
          hidden: false,
        },
        component: () => import('@/views/System/setting/jobPromotion/jobPromotion.vue'),
      },
      {
        path: 'promotionRecords',
        name: 'promotionRecords',
        meta: {
          title: '记录升迁',
          hidden: true,
          activeMenu: 'jobPromotion',
        },
        component: () => import('@/views/System/setting/promotionRecords/promotionRecords.vue'),
      },
    ],
  },
];

export default routes;
