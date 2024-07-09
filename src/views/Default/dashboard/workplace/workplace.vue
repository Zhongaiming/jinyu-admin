<template>
  <div class="workplace">
    <n-grid cols="1 s:1 m:1 l:1 xl:2 2xl:2" responsive="screen" :x-gap="12" :y-gap="9">
      <!-- 左侧区域 -->
      <n-gi class="grid gap-4 grid-rows-2 grid-cols-1 grid-height">
        <!-- 项目 -->
        <n-card
          content-style="padding: 0;"
          :bordered="false"
          size="small"
          class="message-box-wrap pl-4"
        >
          <template #header>
            <n-tabs type="bar" animated @update:value="handleNewsTypeValue">
              <n-tab :name="newsTypeEnum[1]"> {{ $t('xinWen') }} </n-tab>
              <n-tab :name="newsTypeEnum[2]"> {{ $t('gongGao') }} </n-tab>
              <template #suffix>
                <n-button type="text" @click="openNewsList">{{ $t('gengDuo') }}</n-button>
              </template>
            </n-tabs>
          </template>
          <NewsListComponent :listData="newsList" keyField="newsId" />
        </n-card>
        <n-card
          :segmented="{ content: true }"
          content-style="padding-top: 0;padding-bottom: 0"
          :bordered="false"
          size="small"
          :title="$t('xiaoXi')"
          class="message-box-wrap"
        >
          <template #header-extra
            ><n-button type="text" @click="openMessageList">{{ $t('gengDuo') }}</n-button></template
          >
          <list :listData="messageList" keyField="messageId" />
        </n-card>
      </n-gi>
      <!--右侧区域 -->

      <n-gi class="max-h-full grid-gi-right">
        <!-- 工作台 -->
        <n-card
          :bordered="false"
          :title="$t('gongZuoTai')"
          class="mb-4 min-h-fit"
          :segmented="{
            content: true,
          }"
        >
          <n-grid cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
            <n-gi>
              <div class="flex items-center">
                <div>
                  <n-avatar circle :size="64" :src="schoolboy" />
                </div>
                <div>
                  <p class="px-4 text-xl">早安，Ah jung，开始您一天的工作吧！</p>
                  <p class="px-4 text-gray-400"> 今日阴转大雨，15℃ - 25℃，出门记得带伞哦。 </p>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex justify-end w-full">
                <div class="flex flex-col justify-center flex-1 text-right">
                  <span class="text-secondary">{{ $t('yingYongShu') }}</span>
                  <span class="text-2xl">{{ appList.length }}</span>
                </div>
                <div class="flex flex-col justify-center flex-1 text-right">
                  <span class="text-secondary">{{ $t('daiBan') }}</span>
                  <span class="text-2xl">3/15</span>
                </div>
                <div class="flex flex-col justify-center flex-1 text-right">
                  <span class="text-secondary">{{ $t('gongZuoTiXing') }}</span>
                  <span class="text-2xl">{{ messageCount }}</span>
                </div>
              </div>
            </n-gi>
          </n-grid>
        </n-card>
        <!-- 快捷操作 -->
        <n-card
          :segmented="{ content: true }"
          content-style="padding: 0"
          :bordered="false"
          size="small"
          :title="$t('kuaiJieCaoZuo')"
          class="mb-4 min-h-fit"
        >
          <div class="flex flex-wrap project-card">
            <n-card
              size="small"
              class="cursor-pointer project-card-item"
              hoverable
              v-for="shortcut in userShortcuts"
              :key="shortcut.name"
            >
              <div
                class="flex flex-col justify-center text-gray-500"
                @click="handleShortcut(shortcut)"
              >
                <span class="text-center">
                  <n-icon size="30" color="#68c755">
                    <DashboardOutlined />
                  </n-icon>
                </span>
                <span class="text-center text-lx">{{ shortcut.meta.title }}</span>
              </div>
            </n-card>
          </div>
          <div
            class="h-full flex items-center justify-center empty-box"
            v-if="!userShortcuts.length"
          >
            <n-empty description="暂无数据" />
          </div>
        </n-card>
        <!-- 待办已办 -->
        <n-card :bordered="false" class="mb-4 max-h-min min-h-52" content-style="height:100%">
          <n-tabs type="bar" animated @update:value="handleMatterTypeValue">
            <n-tab :name="matterTypeEnum[1]"> {{ $t('daiBan') }} </n-tab>
            <n-tab :name="matterTypeEnum[2]"> {{ $t('yiBan') }} </n-tab>
          </n-tabs>
          <div class="list-wrap">
            <list :listData="matterList" keyField="messageId" />
          </div>
        </n-card>
        <!-- 应用列表 -->
        <n-card
          :segmented="{ content: true }"
          content-style="padding: 0;"
          :bordered="false"
          size="small"
          class="min-h-fit"
          :title="$t('yingYongLieBiao')"
        >
          <template #header-extra
            ><n-button type="text" @click="openMoreApp">{{ $t('gengDuo') }}</n-button></template
          >
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
                <BasicImage
                  width="56"
                  height="56"
                  :src="item.svg"
                  :other="{ previewDisabled: true }"
                />
                {{ item.title }}
              </n-flex>
            </n-card>
          </div>
        </n-card>
      </n-gi>
    </n-grid>
    <!-- <div style="height:100px; width:100%"></div> -->
  </div>
</template>
<script lang="ts" setup>
  defineOptions({ name: 'DashboardWorkplace' });

  import { getUserMessageList, getUserMessageCount } from '@/api/Default/dashboard/message';
  import { getUserNewsList } from '@/api/Default/dashboard/news';
  import schoolboy from '@/assets/images/schoolboy.png';
  import { DashboardOutlined } from '@vicons/antd';
  import { useUserStore } from '@/store/modules/user';
  // 枚举
  import { appTypeEnum } from '@/enums/appEnum';
  import { storage } from '@/utils/Storage';
  import { SHORTCUTS } from '@/store/mutation-types';
  import { messageTypeEnum, matterTypeEnum } from '@/enums/messageEnum';
  import { newsTypeEnum } from '@/enums/newsEnum';

  import List from './component/List.vue';
  import NewsListComponent from './component/newsList.vue';

  const userStore = useUserStore();
  const appList = computed(() => userStore.appList.slice(0, 6));
  const router = useRouter();

  const messageList = ref<Recordable[]>([]);
  const newsList = ref<Recordable[]>([]);
  const matterList = ref<Recordable[]>([]);
  const userShortcuts = ref(storage.get(SHORTCUTS, []));
  const messageCount = ref(0);

  // 分页常量
  const pageParam = {
    pageNum: 0,
    pageSize: 7,
  };
  // 排序
  const orderParam = [
    {
      asc: false,
      fieldName: 'createTime',
    },
  ];

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
  /**
   * 切换待办已办
   */
  function handleMatterTypeValue(value: string) {
    switch (value) {
      case matterTypeEnum[1]:
        getMatterList(1);
        break;
      case matterTypeEnum[2]:
        getMatterList(2);
        break;
    }
  }
  /**
   * 切换待办已办
   */
  function handleNewsTypeValue(value: string) {
    switch (value) {
      case newsTypeEnum[1]:
        getNewsList(1);
        break;
      case newsTypeEnum[2]:
        getNewsList(2);
        break;
    }
  }
  /**
   * 获取用户消息数量并更新 messageCount 变量。
   */
  function getMessageCount() {
    getUserMessageCount().then((res) => {
      messageCount.value = res.backlogMessageCount;
    });
  }

  /**
   * 获取新闻列表
   */
  function getNewsList(type) {
    const newsDtoFilter: Recordable = {
      newsType: type,
      // read: false,
    };
    getUserNewsList({ newsDtoFilter, pageParam, orderParam }).then((res) => {
      newsList.value = res.dataList;
    });
  }
  /**
   * 获取消息列表
   */
  function getMessageList() {
    const messageDtoFilter: Recordable = {
      messageType: messageTypeEnum.MESSAGE,
      read: false,
    };
    getUserMessageList({ messageDtoFilter, pageParam, orderParam }).then((res) => {
      messageList.value = res.dataList;
    });
  }
  /**
   * 获取代办已办
   */
  function getMatterList(type) {
    const messageDtoFilter: Recordable = {
      messageType: messageTypeEnum.MATTER,
      // read: false,
      matterType: type,
    };
    const pageParam = {
      pageNum: 0,
      pageSize: 999,
    };
    getUserMessageList({ messageDtoFilter, pageParam, orderParam }).then((res) => {
      matterList.value = res.dataList;
    });
  }
  /**
   * 点击快捷方式跳转
   */
  async function handleShortcut(shortcut) {
    const app = appList.value.find((item) => item.appId === shortcut.meta.appId);
    if (app) {
      await userStore.changeApp(router, app, shortcut);
    }
  }
  /**
   * 点击消息的更多，跳转消息列表
   */
  function openMoreApp() {
    router.push({ name: 'moreAppList' });
  }
  /**
   * 点击消息的更多，跳转消息列表
   */
  function openMessageList() {
    router.push({ name: 'messageList' });
  }
  /**
   * 点击新闻的更多，跳转新闻列表
   */
  function openNewsList() {
    router.push({ name: 'newsList' });
  }
  // 初始化
  onMounted(() => {
    getMessageList();
    getMatterList(matterTypeEnum.AGENT);
    getMessageCount();
    getNewsList(newsTypeEnum.NEWS);
  });
</script>

<style lang="less" scoped>
  .project-card {
    margin-right: -6px;

    &-item {
      margin: -1px;
      width: 33.33333%;
    }
  }

  .app-card-item {
    width: 16.666666%;
  }

  .message-box-wrap {
    :deep(.n-card__content) {
      overflow-y: auto;
    }
  }
  .list-wrap {
    height: calc(100% - 33px);
  }
  .grid-height {
    height: calc(100vh - 130px);
  }
  .grid-gi-right {
    height: calc(100vh - 130px);
    display: grid;
    grid-template-rows: 180px 230px 1fr 170px;
  }
</style>
