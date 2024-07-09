<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card :bordered="false" class="pro-card">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.sectionId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :showPagination="false"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('tianJiaLanMu') }}
        </n-button>
      </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { getCmsSectionList, deleteCmsSection } from '@/api/News/news/columnManage';
  import { useDict, getDictLabel } from '@/utils/dict';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { section_type } = useDict('section_type');
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      component: 'NInput',
      label: I18n.global.t('lanMuBiaoTi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuLanMuBiaoTi'),
        onInput: (e: any) => {
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

  const router = useRouter();
  // Table实例
  const actionRef = ref();
  // Table表格字段接口
  interface ListData {
    sectionId: string;
    title: string;
    type: number;
    showOrder: number;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('lanMuId'),
      key: 'sectionId',
    },
    {
      title: I18n.global.t('biaoTi'),
      key: 'title',
    },
    {
      title: I18n.global.t('leiXing'),
      key: 'type',
      render(row) {
        return getDictLabel(section_type.value, row.type);
      },
    },
    {
      title: I18n.global.t('paiXu'),
      key: 'showOrder',
    },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: 220,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '＋' + I18n.global.t('ziLanMu'),
            type: 'primary',
            text: true,
            onClick: handleChildEdit.bind(null, record),
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

  // 新增栏目弹窗
  function addTable() {
    router.push({ name: 'addEditcolumn' });
  }

  // 添加子栏目弹窗
  function handleChildEdit(record: Recordable) {
    router.push({ name: 'addEditcolumn', query: { parentId: record.sectionId } });
  }

  // 编辑栏目弹窗
  function handleEdit(record: Recordable) {
    router.push({ name: 'addEditcolumn', query: { sectionId: record.sectionId } });
  }

  // 删除栏目
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuLanMu'),
      content: I18n.global.t('queDingShanChuGaiLanMu'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteCmsSection({ sectionId: record.sectionId }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          // getCurrentPage(actionRef, 1);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getCmsSectionList({
      cmsSectionDtoFilter: { ...getSearchFieldsValue() },
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
