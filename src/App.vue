<template>
  <NConfigProvider
    v-if="!isLock"
    :locale="customizedLocale"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateLocaleMap[settingStore.getLocale]"
  >
    <AppProvider>
      <!-- <n-global-style /> -->
      <RouterView />
    </AppProvider>
  </NConfigProvider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted } from 'vue';
  import { zhCN, dateZhCN, enUS, dateEnUS, darkTheme, createLocale } from 'naive-ui';
  import { LockScreen } from '@/components/Lockscreen';
  import { AppProvider } from '@/components/Application';
  import { useScreenLockStore } from '@/store/modules/screenLock.js';
  import { useRoute } from 'vue-router';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';
  import { lighten } from '@/utils/index';
  const route = useRoute();
  const useScreenLock = useScreenLockStore();
  const designStore = useDesignSettingStore();
  const isLock = computed(() => useScreenLock.isLocked);
  const lockTime = computed(() => useScreenLock.lockTime);
  const settingStore = useProjectSettingStore();

  const localeMap = ref({
    zh: zhCN,
    en: enUS,
  });

  const dateLocaleMap = ref({
    zh: dateZhCN,
    en: dateEnUS,
  });
  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
        primaryColorSuppl: appTheme,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  const customizedLocale = computed(() => {
    return createLocale(
      {
        // Input: {
        //   placeholder: "不提申请不构成加班",
        // },
      },
      localeMap.value[settingStore.getLocale]
    );
  });

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

  let timer: NodeJS.Timer;

  const timekeeping = () => {
    clearInterval(timer);
    if (route.name == 'login' || isLock.value) return;
    // 设置不锁屏
    useScreenLock.setLock(false);
    // 重置锁屏时间
    useScreenLock.setLockTime();
    timer = setInterval(() => {
      // 锁屏倒计时递减
      useScreenLock.setLockTime(lockTime.value - 1);
      if (lockTime.value <= 0) {
        // 设置锁屏
        useScreenLock.setLock(true);
        return clearInterval(timer);
      }
    }, 1000);
  };

  onMounted(() => {
    document.addEventListener('mousedown', timekeeping);
    let html: any = document.querySelector('html');
    html.setAttribute('theme', getDarkTheme.value ? 'dark' : 'light');
  });

  onUnmounted(() => {
    document.removeEventListener('mousedown', timekeeping);
  });
</script>

<style lang="less">
  @import 'styles/index.less';
</style>
