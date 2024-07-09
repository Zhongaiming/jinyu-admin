<template>
  <div class="h-full max-h-full">
    <n-scrollbar>
      <n-list class="full" v-if="listData?.length">
        <n-list-item v-for="item in listData" :key="item[keyField]" @click="handleView(item)">
          <template #prefix>
            <div class="w-10">
              <BasicImage
                width="40"
                height="40"
                round
                srcfull
                :src="schoolboy"
                :other="{ previewDisabled: true }"
              />
            </div>

            <!-- <n-avatar circle :size="40" :src="schoolboy" /> -->
          </template>
          <n-thing :title="item.title">
            <template #description
              ><p class="text-xs text-gray-500">{{ item.updateTime }}</p></template
            >
          </n-thing>
        </n-list-item>
      </n-list>
      <div class="h-full flex items-center justify-center empty-box" v-else>
        <n-empty :description="$t('zanWuShuJu')" />
      </div>
    </n-scrollbar>
    <BasicModal
      @register="modalRegister"
      ref="messageViewModalRef"
      class="basicModal"
      @on-ok="handleOk"
    >
      <template #default>
        <p>{{ messageContent }}</p>
      </template>
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'List', required: true });
  import { readMessage } from '@/api/Default/dashboard/message';
  import { messageContextTypeEnum } from '@/enums/messageEnum';
  import { useModal } from '@/components/Modal';
  import I18n from '@/lang/index'; //引入i18n组件
  defineProps({
    listData: Array<any>,
    keyField: {
      type: String,
      default: 'id',
    },
  });
  const messageContent = ref('');
  const schoolboy = new URL('@/assets/images/schoolboy.png', import.meta.url).href;
  const handleOk = () => {};
  const [modalRegister, { openModal }] = useModal({
    title: I18n.global.t('xiaoXiXiangQing'),
  });
  // 查看消息
  const handleView = (messageData) => {
    readMessage({ messageId: messageData.messageId })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
    switch (messageData.type) {
      case messageContextTypeEnum.RICHTEXT:
        // TODO 需要修改布局与样式
        messageContent.value = messageData.content;
        openModal();
        break;
      case messageContextTypeEnum.INTERNAL_LINK:
        // TODO 改为跳转内联
        window.open(messageData.content);
        break;
      case messageContextTypeEnum.EXTERNAL_LINK:
        window.open(messageData.content);
        break;
    }
  };
</script>

<style lang="less" scoped>
  :deep(.n-scrollbar-content) {
    height: 100%;
  }
</style>
