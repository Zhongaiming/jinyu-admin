import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';
import I18n from '@/lang/index'; //引入i18n组件
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
      title: I18n.global.t('sheZhiYeMian'),
      icon: renderIcon(SettingOutlined),
      sort: 5,
      hidden: true,
    },
    children: [
      {
        path: 'settingAccount',
        name: 'settingAccount',
        meta: {
          title: I18n.global.t('geRenSheZhi'),
          menuId: 'overallSituationMenu',
        },
        component: () => import('@/views/System/setting/account/account.vue'),
      },
    ],
  },
];

export default routes;
