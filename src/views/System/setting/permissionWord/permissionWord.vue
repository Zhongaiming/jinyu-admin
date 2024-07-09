<template>
  <div>
    <n-card class="search-card mb-1.5" hoverable>
      <BasicForm @register="register" @submit="onPermissionWordTableSearch" />
    </n-card>
    <n-card class="pro-card" hoverable>
      <BasicTable
        :columns="columns"
        :title="$t('quanXianZiLieBiao')"
        :request="loadDataTable"
        :row-key="(row) => row.permCodeId"
        :actionColumn="actionColumn"
        ref="permTableRef"
      />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'PermissionWord' });
  import { getPermCodeList, updatePermCode } from '@/api/System/setting/perm';
  import { TableAction, BasicColumn } from '@/components/Table';
  import { useForm, BasicForm, type FormSchema } from '@/components/Form';
  import I18n from '@/lang/index'; //引入i18n组件
  /**
   * 表格ref
   */
  const permTableRef = ref();

  // 搜索框字段
  const searchSchema: FormSchema[] = [
    {
      field: 'showName',
      label: I18n.global.t('mingCheng'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuMingCheng'),
      },
    },
    {
      field: 'aliasName',
      label: I18n.global.t('bieMing'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuBieMing'),
      },
    },
  ];
  // Table表格操作配置
  const actionColumn = reactive({
    width: I18n.global.locale.value === 'zh' ? 120 : 140,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: createActions(record),
      });
    },
  });

  // 自定义按钮
  function createActions(record) {
    if (!record.editable) {
      return [
        {
          label: I18n.global.t('xiuGaiBieMing'),
          type: 'info',
          text: true,
          onClick: handleEdit.bind(null, record),
        },
      ];
    } else {
      return [
        {
          label: I18n.global.t('baoCun'),
          onClick: handleEditSave.bind(null, record),
        },
        {
          label: I18n.global.t('quXiao'),
          onClick: handleEditCancel.bind(null, record),
        },
      ];
    }
  }
  // Table表格刷新
  function reloadTable() {
    permTableRef.value.reload();
  }

  async function handleEditSave(record) {
    await record.onEdit?.(false, true);
    updatePermCode({ sysPermCodeDto: { ...record } }).then(() => {
      window['$message'].success(I18n.global.t('xiuGaiChengGong'));
      reloadTable();
    });
  }

  function handleEditCancel(record) {
    record.onEdit?.(false, false);
  }
  function handleEdit(record: Recordable) {
    console.log(record);
    record.onEdit?.(true);
  }
  // 定义表单属性
  const [register, { getFieldsValue: getSearchsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    collapsedRows: 3,
    labelWidth: 60,
    submitOnReset: true,
    schemas: searchSchema,
    submitClassName: 'primary-button',
  });
  // 搜索方法
  const onPermissionWordTableSearch = () => {
    // 搜索重置页码
    if (permTableRef.value) {
      permTableRef.value.updatePage(1);
    }
  };

  // Table表格字段接口
  interface ListData {
    permCodeId: string;
    showName: string;
    permCode: string;
    aliasName: number;
  }
  // 表格字段
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('mingCheng'),
      key: 'showName',
    },
    {
      title: I18n.global.t('quanXianZi'),
      key: 'permCode',
    },
    {
      title: I18n.global.t('bieMing'),
      key: 'aliasName',
      editComponent: 'NInput',
      editRule: true,
      editRow: true,
      edit: true,
    },
  ];
  /**
   * 获取表格数据
   */
  const loadDataTable = async (page) => {
    return await getPermCodeList({ sysPermCodeDto: { ...getSearchsValue() }, pageParam: page });
  };
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
