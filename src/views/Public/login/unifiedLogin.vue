<template>
  <n-layout>
    <div class="view-account"></div>
  </n-layout>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from 'naive-ui';

  const message = useMessage();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const token = route.query?.token;
  const toLogin = () => {
    setTimeout(() => {
      router.replace('/login');
    }, 1000);
  };
  onMounted(async () => {
    if (token) {
      try {
        userStore.setToken(String(token));
        const data = await userStore.login({}, String(token));
        message.destroyAll();
        if (data.appList?.length > 0) {
          const Loading = window['$loading'] || null;
          Loading && Loading.start();
          message.success('登录成功');
          await router.isReady();
          Loading && Loading.finish();
          if (userStore.currentApp?.menu?.length > 0) {
            router.replace(userStore.currentApp.menu[0].path);
          } else {
            router.replace('/');
          }
        } else {
          message.info('登录失败');
          toLogin();
        }
      } catch (error) {
        message.info('登录失败');
      }
    } else {
      message.info('没有获取到用户信息，请登录');
      toLogin();
    }
  });
  onUnmounted(() => {
    message.destroyAll();
  });
</script>
