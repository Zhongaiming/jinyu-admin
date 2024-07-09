<template>
  <n-card
    :segmented="{ content: true }"
    content-style="padding: 0"
    :bordered="false"
    size="small"
    :title="$t('yingYongLieBiao')"
  >
    <template #header-extra> {{ $t('gong') }}{{ appList.length }}{{ $t('geYingYong') }} </template>
    <div class="flex flex-wrap project-card">
      <n-card
        size="small"
        class="cursor-pointer app-card-item"
        hoverable
        v-for="item in appList"
        @click="changeApp(item)"
        :key="item.appId"
      >
        <n-flex align="center" vertical>
          <BasicImage width="56" height="56" :src="item.svg" :other="{ previewDisabled: true }" />
          {{ item.title }}
        </n-flex>
      </n-card>
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user';
  import { appTypeEnum } from '@/enums/appEnum';
  const userStore = useUserStore();
  const appList = computed(() => userStore.appList);
  const router = useRouter();
  /**
   * 切换app
   */
  function changeApp(app) {
    if (app.type === appTypeEnum.URL_APP) {
      window.open(app.url);
      return;
    }
    userStore.changeApp(router, app);
  }
</script>

<style lang="less" scoped>
  .app-card-item {
    width: 10%;
  }
</style>
