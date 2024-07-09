<template>
  <div class="logo">
    <BasicImage
      width="32"
      height="32"
      :src="appLogo"
      :fallsrc="noLogoUrl"
      :class="{ 'mr-2': !props.collapsed }"
      :other="{ previewDisabled: true }"
    />
    <div v-show="!props.collapsed" class="title">{{ currentApp.title }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';
  const noLogoUrl = new URL('@/assets/images/noLogo.png', import.meta.url).href;
  const props = defineProps({
    collapsed: {
      type: Boolean,
    },
  });
  const { fileUrl } = useGlobSetting();
  const userStore = useUserStore();
  const currentApp = computed(() => userStore.currentApp);
  const appLogo = computed(() => {
    if (userStore.currentApp.svg) {
      return fileUrl + currentApp.value?.svg;
    } else {
      return userStore.currentApp.logo;
    }
  });
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin: 0;
    }
  }
</style>
