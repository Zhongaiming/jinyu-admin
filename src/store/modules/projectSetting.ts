import { defineStore } from 'pinia';
import projectSetting from '@/settings/projectSetting';
import Cookies from 'js-cookie';
import { storage } from '@/utils/Storage';
import type { IHeaderSetting, IMenuSetting, IMultiTabsSetting, ICrumbsSetting } from '/#/config';
import { LOCALE } from '@/store/mutation-types';
const cookiesStorage: any = {
  setItem(key: string, state) {
    return Cookies.set(key, state, { expires: 7 }); // 设置有效期 7 天，不设置默认同 sessionStorage 有效期一致
  },
  getItem(key: string) {
    return Cookies.get(key);
  },
};

const {
  navMode,
  navTheme,
  isMobile,
  headerSetting,
  // showFooter,
  menuSetting,
  multiTabsSetting,
  crumbsSetting,
  permissionMode,
  isPageAnimate,
  pageAnimateType,
} = projectSetting;

interface ProjectSettingState {
  navMode: string; //导航模式
  navTheme: string; //导航风格
  headerSetting: IHeaderSetting; //顶部设置
  // showFooter: boolean; //页脚
  menuSetting: IMenuSetting; //多标签
  multiTabsSetting: IMultiTabsSetting; //多标签
  crumbsSetting: ICrumbsSetting; //面包屑
  permissionMode: string; //权限模式
  isPageAnimate: boolean; //是否开启路由动画
  pageAnimateType: string; //路由动画类型
  isMobile: boolean; // 是否处于移动端模式
  locale: string; //语言
}

export const useProjectSettingStore = defineStore({
  id: 'app-project-setting',
  state: (): ProjectSettingState => ({
    navMode,
    navTheme,
    isMobile,
    headerSetting,
    // showFooter,
    menuSetting,
    multiTabsSetting,
    crumbsSetting,
    permissionMode,
    isPageAnimate,
    pageAnimateType,
    locale: storage.get(LOCALE, 'zh'),
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'NAV-MODE',
        storage: cookiesStorage,
        paths: ['navMode'],
      },
      {
        key: 'NAV-THEME',
        storage: cookiesStorage,
        paths: ['navTheme'],
      },
      {
        key: 'IS-MOBILE',
        storage: cookiesStorage,
        paths: ['isMobile'],
      },
      {
        key: 'HEADER-SETTING',
        storage: cookiesStorage,
        paths: ['headerSetting'],
      },
      // {
      //   key: "SHOW-FOOTER",
      //   storage: cookiesStorage,
      //   paths: ["showFooter"],
      // },
      {
        key: 'MENU-SETTING',
        storage: cookiesStorage,
        paths: ['menuSetting'],
      },
      {
        key: 'MULTI-TABS-SETTING',
        storage: cookiesStorage,
        paths: ['multiTabsSetting'],
      },
      {
        key: 'CRUMBS-SETTING',
        storage: cookiesStorage,
        paths: ['crumbsSetting'],
      },
      // {
      //   key: "PERMISSION-MODE",
      //   storage: cookiesStorage,
      //   paths: ["permissionMode"],
      // },
      {
        key: 'IS-PAGE-ANIMATE',
        storage: cookiesStorage,
        paths: ['isPageAnimate'],
      },
      {
        key: 'PAGE-ANIMATE-TYPE',
        storage: cookiesStorage,
        paths: ['pageAnimateType'],
      },
      {
        key: 'LOCALE',
        storage: cookiesStorage,
        paths: ['locale'],
      },
    ],
  },
  getters: {
    getNavMode(): string {
      return this.navMode;
    },
    getNavTheme(): string {
      return this.navTheme;
    },
    getIsMobile(): boolean {
      return this.isMobile;
    },
    getHeaderSetting(): object {
      return this.headerSetting;
    },
    // getShowFooter(): boolean {
    //   return this.showFooter;
    // },
    getMenuSetting(): object {
      return this.menuSetting;
    },
    getMultiTabsSetting(): object {
      return this.multiTabsSetting;
    },
    getCrumbsSetting(): object {
      return this.crumbsSetting;
    },
    getPermissionMode(): string {
      return this.permissionMode;
    },
    getIsPageAnimate(): boolean {
      return this.isPageAnimate;
    },
    getPageAnimateType(): string {
      return this.pageAnimateType;
    },
    getLocale(): string {
      return this.locale;
    },
  },
  actions: {
    setNavTheme(value: string): void {
      this.navTheme = value;
    },
    setIsMobile(value: boolean): void {
      this.isMobile = value;
    },
    setLocale(value: string): void {
      // 设置当前语言
      const ex = 7 * 24 * 60 * 60;
      storage.set(LOCALE, value, ex);
      this.locale = value;
    },
  },
});
