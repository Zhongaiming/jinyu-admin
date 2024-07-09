<template>
  <div class="h-full max-h-full">
    <n-scrollbar>
      <div
        class="flex w-full py-4 border-gray-200"
        style="border-bottom: 1px solid; border-color: var(--n-border-color) !important"
        v-if="listData?.length > 0"
        @click="handleView(firstNew)"
      >
        <div
          class="w-1/12 border-gray-200 mr-4 flex flex-col justify-center items-center"
          style="border-right: 1px solid; border-color: var(--n-border-color) !important"
        >
          <p class="text-3xl text-gray-500 mb-1 font-semibold">{{ firstDay }}</p>
          <p class="text-gray-500">{{ firstDate }}</p>
        </div>
        <div class="w-11/12">
          <p class="text-xl font-medium">{{ firstNew?.title }}</p>
          <!-- <p class="text-gray-500 line-clamp-2 mr-4">{{ firstNew?.link }}</p> -->
        </div>
      </div>

      <n-list class="full" v-if="listData?.length > 1" clickable>
        <n-list-item
          v-for="item in otherNew"
          :key="item[keyField]"
          class="news-item"
          :class="{ unread: !item.read }"
          @click="handleView(item)"
        >
          <div class="flex items-center justify-between px-4">
            <p class="text-s font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
              {{ item.title }}
            </p>
            <p class="text-xs text-gray-500 min-w-fit pl-4">{{ item.updateTime }}</p>
          </div>
        </n-list-item>
      </n-list>
      <div
        :class="{ 'h-full': listData?.length < 1 }"
        class="flex items-center justify-center empty-box"
        v-if="listData?.length < 2"
      >
        <n-empty :description="$t('zanWuShuJu')" />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { readNews } from '@/api/Default/dashboard/news';
  import { useUserStore } from '@/store/modules/user';
  const userStore = useUserStore();
  defineOptions({ name: 'NewsListComponent', required: true });
  const props = defineProps({
    listData: { type: Array<any>, default: () => [] },
    keyField: {
      type: String,
      default: 'id',
    },
  });

  const router = useRouter();

  const firstNew = computed(() => (props.listData.length >= 1 ? props.listData[0] : null));
  const otherNew = computed(() => (props.listData.length >= 1 ? props.listData.slice(1) : null));
  const firstDay = computed(() => new Date(firstNew.value?.updateTime).getDate());
  const firstDate = computed(() => {
    const date = new Date(firstNew.value?.updateTime);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const handleView = async (newsData) => {
    readNews({ newsId: newsData.newsId })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
    // TODO 修改逻辑
    const app = userStore.appList.find((item) => item.appId === newsData.internalAppId);
    if (app) {
      await userStore.changeApp(router, app, newsData.link);
    }
    // newsContent.value = newsData.link;
    // openModal();
    // router.push({ name: 'newsDetail', query: { newsId: newsData.newsId } });
  };
</script>

<style lang="less" scoped>
  :deep(.n-scrollbar-content) {
    height: 100%;
  }
  :deep(.n-list-item__main) {
    max-width: 100%;
  }
  .unread::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: green;
  }
</style>
