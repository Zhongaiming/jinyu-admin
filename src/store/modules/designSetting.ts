import { defineStore } from 'pinia';
import { store } from '@/store';
import designSetting from '@/settings/designSetting';
import Cookies from 'js-cookie';

const { darkTheme, appTheme, appThemeList } = designSetting;
const cookiesStorage: any = {
  setItem(key: string, state) {
    return Cookies.set(key, state, { expires: 7 }); // 设置有效期 7 天，不设置默认同 sessionStorage 有效期一致
  },
  getItem(key: string) {
    return Cookies.get(key);
  },
};

interface DesignSettingState {
  //深色主题
  darkTheme: boolean;
  //系统风格
  appTheme: string;
  //系统内置风格
  appThemeList: string[];
}

export const useDesignSettingStore = defineStore({
  id: 'app-design-setting',
  state: (): DesignSettingState => ({
    darkTheme,
    appTheme,
    appThemeList,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'DARK-THEME',
        storage: cookiesStorage,
        paths: ['darkTheme'],
      },
      {
        key: 'APP-THEME',
        storage: cookiesStorage,
        paths: ['appTheme'],
      },
    ],
  },
  getters: {
    getDarkTheme(): boolean {
      return this.darkTheme;
    },
    getAppTheme(): string {
      return this.appTheme;
    },
    getAppThemeList(): string[] {
      return this.appThemeList;
    },
  },
  actions: {
    setDarkTheme(darkTheme: boolean) {
      this.darkTheme = darkTheme;
    },
  },
});

// Need to be used outside the setup
export function useDesignSetting() {
  return useDesignSettingStore(store);
}
