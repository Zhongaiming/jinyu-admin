<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="register" @submit="onMessageTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadMessageTable"
      :row-key="(row) => row.messageId"
      ref="messageTableRef"
      :actionColumn="actionColumn"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button
          type="primary"
          class="primary-button"
          @click="router.push({ name: 'msgAuthApp' })"
        >
          {{ $t('xiaoXiShouQuanYingYong') }}
        </n-button>
      </template>
    </BasicTable>
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
  </n-card>
</template>

<script setup lang="ts">
  import { useModal } from '@/components/Modal';
  import { getAdminMessageList, readMessage } from '@/api/Default/dashboard/message';
  import type { FormSchema } from '@/components/Form';
  import { useForm } from '@/components/Form';
  import { TableAction, BasicColumn } from '@/components/Table';
  import { messageContextTypeEnum } from '@/enums/messageEnum';
  import { useDict, getDictLabel, dictTagView } from '@/utils/dict';
  import I18n from '@/lang/index'; //引入i18n组件
  // 初始化ref
  const messageTableRef = ref();
  const messageViewModalRef = ref();
  const messageContent = ref('');
  const router = useRouter();
  // 设置name
  defineOptions({ name: 'MessageManage' });
  // 获取字典
  const { message_type, message_notify_type, message_type_dict, publish_status, sys_user_dict } =
    useDict(
      'message_type',
      'message_notify_type',
      'message_type_dict',
      'publish_status',
      'sys_user_dict'
    );
  // 搜索框字段
  const searchSchema: FormSchema[] = [
    {
      field: 'title',
      label: I18n.global.t('biaoTi'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuBiaoTi'),
      },
    },
    {
      field: 'notifyType',
      label: I18n.global.t('shouQuanLeiXing'),
      isShow: true,
      component: 'NSelect',
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeShouQuanLeiXing'),
        options: message_notify_type,
        filterable: true,
        clearable: true,
      },
    },
    {
      field: 'messageType',
      label: I18n.global.t('xiaoXiLeiXing'),
      isShow: true,
      component: 'NSelect',
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeShouQuanLeiXing'),
        options: message_type_dict,
        filterable: true,
        clearable: true,
      },
    },
    {
      field: 'publishStatus',
      label: I18n.global.t('shiFouShangJia'),
      isShow: true,
      component: 'NSelect',
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeShiFouShangJia'),
        options: publish_status,
        filterable: true,
        clearable: true,
      },
    },
    {
      field: 'type',
      label: I18n.global.t('xiaoXiNeiRongLeiXing'),
      isShow: true,
      component: 'NSelect',
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeXiaoXiNeiRongLeiXing'),
        options: message_type,
        filterable: true,
        clearable: true,
      },
    },
  ];
  // Table表格字段接口
  interface ListData {
    messageId: string;
    notifyType: string;
    title: string;
    type: string;
    createUserId: string;
    createTime: string;
  }
  // 表格字段
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('shouQuanLeiXing'),
      key: 'notifyType',
      render(row) {
        return getDictLabel(message_notify_type.value, row.notifyType);
      },
    },
    {
      title: I18n.global.t('biaoTi'),
      key: 'title',
    },
    {
      title: I18n.global.t('xiaoXiLeiXing'),
      key: 'type',
      render(row) {
        return dictTagView(getDictLabel(message_type.value, row.type));
      },
    },
    {
      title: I18n.global.t('chuangJianYongHu'),
      key: 'createUserId',
      render(row) {
        return dictTagView(
          getDictLabel(sys_user_dict.value, row.createUserId, I18n.global.t('weiZhi'))
        );
      },
    },
    {
      title: I18n.global.t('chuangJianShiJian'),
      key: 'createTime',
    },
  ];
  const handleOk = () => {};
  const [modalRegister, { openModal }] = useModal({
    title: I18n.global.t('xiaoXiXiangQing'),
  });
  // 点击提交
  const onMessageTableSearch = () => {
    // 搜索重置页码
    messageTableRef.value.updatePage(1);
  };
  // 表格操作
  const actionColumn = reactive({
    width: 100,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('chaKan'),
            type: 'info',
            text: true,
            disabled: record.userType === '0',
            onClick: handleView.bind(null, record),
          },
        ],
      });
    },
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
  // 加载表格数据
  const loadMessageTable = async (page, sort) => {
    return await getAdminMessageList({
      messageDtoFilter: { ...getSearchsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };
  const [register, { getFieldsValue: getSearchsValue }] = useForm({
    gridProps:
      I18n.global.locale.value === 'zh'
        ? { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' }
        : { cols: '1 s:1 m:2 l:3 xl:4 xxl:4' },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 120 : 150,
    submitOnReset: true,
    schemas: searchSchema,
    submitClassName: 'primary-button',
  });
</script>

<style lang="less" scoped>
  .pro-card {
    :deep(.n-card__content) {
      padding: 20px 16px 16px;
    }
  }
  :deep(.table-toolbar) {
    padding: 0 0 16px;
  }
  .search-card {
    :deep(.n-card__content) {
      padding: 20px 16px !important;
    }
    :deep(.n-grid) {
      gap: 24px 0px !important;
    }
    :deep(.n-form-item .n-form-item-feedback-wrapper) {
      min-height: auto;
    }
  }
</style>
