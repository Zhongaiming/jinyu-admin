<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card :bordered="false" class="pro-card">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.pushLogId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { getCmsArticlePushLog, cancelCmsArticlePushLog } from '@/api/News/news/pushRecords';
  import { NTag } from 'naive-ui';
  import { getCurrentPage } from '@/utils';
  import { useDict } from '@/utils/dict';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { article } = useDict('article');
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'articleId',
      component: 'NSelect',
      label: I18n.global.t('xinWenWenZhang'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeXinWenWenZhang'),
        options: article,
        filterable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: 100,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  // Table实例
  const actionRef = ref();
  // Table表格字段接口
  interface ListData {
    pushLogId: string;
    article: any;
    status: number;
    operation: number;
    createTime: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('tuiSongRiZhiId'),
      key: 'pushLogId',
    },
    {
      title: I18n.global.t('lanMuBiaoTi'),
      key: 'sectionTitle',
      render(row) {
        return row.article.sectionTitle;
      },
    },
    {
      title: I18n.global.t('wenZhangBiaoTi'),
      key: 'title',
      render(row) {
        return row.article.title;
      },
    },
    {
      title: I18n.global.t('leiXing'),
      key: 'status',
      render(row) {
        return h(
          'div',
          {},
          {
            default: () =>
              row.operation === 1 ? I18n.global.t('tuiSong') : I18n.global.t('cheXiao'),
          }
        );
      },
    },
    {
      title: I18n.global.t('zhuangTai'),
      key: 'status',
      render(row) {
        return h(
          NTag,
          {
            type: row.status === 1 ? 'success' : 'error',
          },
          {
            default: () =>
              row.status === 1 ? I18n.global.t('chengGong') : I18n.global.t('shiBai'),
          }
        );
      },
    },
    {
      title: I18n.global.t('chuangJianShiJian'),
      key: 'createTime',
    },
  ];

  // Table表格操作配置
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
            label: I18n.global.t('cheXiaoTuiSong'),
            type: 'error',
            text: true,
            class: 'ml-3',
            disabled:
              (record.operation === 1 && record.status === 2) ||
              (record.operation === 2 && record.status === 1),
            onClick: handleCancel.bind(null, record),
          },
        ],
      });
    },
  });

  // 撤销推送
  function handleCancel(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('cheXiaoTuiSong'),
      content: I18n.global.t('queDingCheXiaoGaiWenZhangDeTuiSong'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        cancelCmsArticlePushLog({ pushLogIds: [record.pushLogId] }).then(() => {
          window['$message'].success(I18n.global.t('cheXiaoChengGong'));
          getCurrentPage(actionRef, 1);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getCmsArticlePushLog({
      cmsArticlePushLogDtoFilter: { ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  // Table搜索方法
  function onTableSearch() {
    // 搜索重置页码
    actionRef.value.updatePage(1);
    // actionRef.value.reload();
  }
</script>

<style lang="less" scoped>
  .pro-card {
    :deep(.n-card__content) {
      padding: 20px 16px 16px;
    }
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
  :deep(.table-toolbar) {
    padding: 0 0 16px;
  }
</style>
