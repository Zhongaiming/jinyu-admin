import { defineStore } from 'pinia';
import { store } from '@/store';
import { useAsyncRouteStore } from '@/store/modules/asyncRoute';
import { useTabsViewStore } from '@/store/modules/tabsView';
import type { RouteRecordRaw } from 'vue-router';
import {
  ACCESS_TOKEN,
  CURRENT_USER,
  IS_SCREENLOCKED,
  CURRENT_APP,
  CURRENT_APPID,
  CURRENT_APPLIST,
  TABS_ROUTES,
  MENUID,
} from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login, logout } from '@/api/Public/login';
import { storage } from '@/utils/Storage';
import { websiteConfig } from '@/config/website.config';

export type UserInfoType = {
  name: string;
  email: string;
  appList: Recordable[];
  headImageUrl: string;
  phone: string;
  isAdmin: boolean;
  menuList: Recordable[];
  permissions: Recordable[];
  showName: string;
  postShowName: string;
  tokenData: string;
  userId: string;
  nowDeptPostId: string;
  deptPostJson: string;
  loginName: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
  // 当前使用的appId数组
  appId: string;
  currentApp: Recordable;
  appList: Recordable[];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
    appId: storage.get(CURRENT_APPID),
    currentApp: storage.get(CURRENT_APP, websiteConfig),
    appList: storage.get(CURRENT_APPLIST, []),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
    getAppId(): string {
      return this.appId;
    },
    getCurrentApp(): Recordable {
      return this.currentApp;
    },
    getAppList(): Recordable[] {
      return this.appList;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any, token = '') {
      const response = token !== '' ? await this.getInfo() : await login(params);
      let data = response?.data;
      const code = response?.code;
      if (code === ResultEnum.SUCCESS || response.appList?.length > 0) {
        if (token !== '') {
          data = { ...response };
          data.tokenData = token;
        }
        const ex = 7 * 24 * 60 * 60;
        // storage.remove(CURRENT_APPID);
        const tabsViewStore = useTabsViewStore();
        tabsViewStore.tabsList = [];
        storage.remove(TABS_ROUTES);
        // 本地存储信息
        const currentApp =
          data.appList.find((item) => item.appId === data.defaultAppId) || data.appList[0];
        storage.set(CURRENT_APPID, currentApp.appId, ex);
        storage.set(CURRENT_APP, currentApp, ex);
        storage.set(ACCESS_TOKEN, data.tokenData, ex);
        storage.set(CURRENT_USER, data, ex);
        storage.set(CURRENT_APPLIST, data.appList, ex);
        storage.set(IS_SCREENLOCKED, false);
        // pinia
        this.setCurrentApp(currentApp);
        this.setToken(data.tokenData);
        this.setUserInfo(data);
        this.setAppList(data.appList);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      try {
        const $message = window['$message'];
        const result = await getUserInfoApi();
        if (result.permissions && result.permissions.length) {
          const permissionsList = result.permissions;
          this.setPermissions(permissionsList);
          this.setUserInfo(result);
        } else {
          throw new Error('getInfo: permissionsList must be a non-null array !');
        }
        this.setAvatar(result.avatar);
        if (result.passwordExpirationTime) {
          $message.warning(result.passwordExpirationTime);
        }
        return result;
      } catch (err) {
        console.error('Error', err);
      }
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      await logout({});
      // this.setUserInfo({ name: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      storage.remove(CURRENT_APPLIST);
      storage.remove(CURRENT_APPID);
      storage.remove(CURRENT_APP);
      const tabsViewStore = useTabsViewStore();
      tabsViewStore.tabsList = [];
      storage.remove(TABS_ROUTES);
      storage.remove(MENUID);
    },
    async changeApp(router, app, replaceSrc?: Recordable) {
      const asyncRouteStore = useAsyncRouteStore();
      const tabsViewStore = useTabsViewStore();
      // 存储id和当前应用信息（回显logo和title）
      this.appId = app.appId;
      storage.set(CURRENT_APPID, app.appId);
      this.currentApp = app;
      storage.set(CURRENT_APP, app);
      // 切换路由
      const routers = await asyncRouteStore.generateRoutes(this.info);
      tabsViewStore.clearAllTabs();
      routers.forEach(async (item) => {
        await router.addRoute(item as unknown as RouteRecordRaw);
      });
      if (replaceSrc) {
        router.replace(replaceSrc);
      } else if (routers.length > 0) {
        // 默认跳转第1个
        router.replace({
          name: routers[0].name,
        });
      }
    },
    // 插入appId
    setAppId(appId: string) {
      this.appId = appId;
    },
    // 插入appList
    setAppList(appList: Recordable[]) {
      this.appList = appList;
    },
    setCurrentApp(currentApp: Recordable) {
      this.currentApp = currentApp;
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
