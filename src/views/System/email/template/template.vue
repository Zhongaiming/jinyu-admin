<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.emailTemplateId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('xinJianYouJianMoBan') }}
        </n-button>
      </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { getEmailTemplateList, delEmailTemplate } from '@/api/System/email/template';
  import { getCurrentPage } from '@/utils/index';
  import I18n from '@/lang/index'; //引入i18n组件
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('moBanMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuMoBanMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'emailTitle',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('youJianBiaoTi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYouJianBiaoTi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: I18n.global.locale.value === 'zh' ? 100 : 140,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  const router = useRouter();
  // Table实例
  const actionRef = ref();
  // Table表格字段接口
  interface ListData {
    emailTemplateId: string;
    templateKey: string;
    title: string;
    emailTitle: string;
    receiveEmail: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('youJianMoBanId'),
      key: 'emailTemplateId',
    },
    {
      title: I18n.global.t('youJianMoBanKey'),
      key: 'templateKey',
    },
    {
      title: I18n.global.t('moBanMingCheng'),
      key: 'title',
    },
    {
      title: I18n.global.t('youJianBiaoTi'),
      key: 'emailTitle',
    },
    {
      title: I18n.global.t('jieShouYouXiangZu'),
      key: 'receiveEmail',
      render(row) {
        if (row.receiveEmail && JSON.parse(row.receiveEmail).length > 0) {
          return h(
            'span',
            {},
            JSON.parse(row.receiveEmail).map((item: string) => {
              return h(
                'div',
                {},
                {
                  default: () => item,
                }
              );
            })
          );
        } else {
          return I18n.global.t('zanWu');
        }
      },
    },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: I18n.global.locale.value === 'zh' ? 180 : 200,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('jieBang'),
            type: 'primary',
            text: true,
            class: 'ml-3',
            onClick: () => {
              router.push({
                name: 'emailSendingRule',
              });
            },
          },
          {
            label: I18n.global.t('bianJi'),
            type: 'info',
            text: true,
            class: 'ml-3',
            onClick: handleEdit.bind(null, record),
          },
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

  // 删除邮件模板
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuYouJianMoBan'),
      content: I18n.global.t('shiFouQueRenShanChuYouJianMoBan'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        delEmailTemplate({ emailTemplateId: record.emailTemplateId }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          getCurrentPage(actionRef, 1);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  // 新增邮件模板
  function addTable() {
    router.push({
      name: 'addEditEmailTemplate',
      query: {},
    });
  }

  // 编辑邮件模板
  function handleEdit(record: Recordable) {
    router.push({
      name: 'addEditEmailTemplate',
      query: { emailTemplateId: record.emailTemplateId },
    });
  }

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getEmailTemplateList({
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
