<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.emailBehaviorId"
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
  import { getEmailBehaviorList, deleteEmailBehavior } from '@/api/System/email/behavior';
  import { getCurrentPage } from '@/utils/index';
  import I18n from '@/lang/index'; //引入i18n组件
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('hangWeiMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuHangWeiMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: I18n.global.locale.value === 'zh' ? 70 : 120,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  // Table实例
  const actionRef = ref();
  // Table表格字段接口
  interface ListData {
    emailBehaviorId: string;
    behaviorKey: string;
    title: string;
    keyword: string;
    createTime: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('hangWeiId'),
      key: 'emailBehaviorId',
    },
    {
      title: I18n.global.t('hangWeiKey'),
      key: 'behaviorKey',
    },
    {
      title: I18n.global.t('hangWeiMingCheng'),
      key: 'title',
    },
    {
      title: I18n.global.t('guanJianZi'),
      key: 'keyword',
      render(row) {
        if (row.keyword && Object.keys(JSON.parse(row.keyword)).length > 0) {
          return h(
            'span',
            {},
            Object.keys(JSON.parse(row.keyword)).map((key: string) => {
              return h(
                'div',
                {},
                {
                  default: () => key + ': ' + JSON.parse(row.keyword)[key],
                }
              );
            })
          );
        } else {
          return I18n.global.t('zanWu');
        }
      },
    },
    {
      title: I18n.global.t('chuangJianShiJian'),
      key: 'createTime',
    },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: 180,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('shanChu'),
            type: 'error',
            text: true,
            class: 'ml-3',
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  // 删除邮件行为
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuYouJianHangWei'),
      content: I18n.global.t('shiFouQueRenShanChuYouJianHangWei'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteEmailBehavior({ roleId: record.roleId }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
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
    return await getEmailBehaviorList({
      sysRoleDtoFilter: { ...getSearchFieldsValue() },
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
