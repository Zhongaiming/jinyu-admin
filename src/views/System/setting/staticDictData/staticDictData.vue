<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card :bordered="false" class="pro-card">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('xinJianZiDianShuJu') }}
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title" :width="500">
      <div class="mt-5">
        <BasicForm @register="submitRegister" @submit="confirmForm" />
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { BasicModal } from '@/components/Modal/index';
  import { NTag } from 'naive-ui';
  import { useDict, getDictLabel } from '@/utils/dict';
  import {
    getStaticDictDataList,
    getStaticDictDataView,
    addStaticDictData,
    updateStaticDictData,
    deleteStaticDictData,
  } from '@/api/System/setting/dict/staticDictData';
  import { getDictMapList } from '@/api/System/setting/dict';
  import { getCurrentPage, transformDataSource } from '@/utils';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { data_status } = useDict('data_status');
  // 字典数据编码(用于编辑)
  const dictDataId = ref(null);
  //字典标识
  const dictType: any = ref(null);
  // 搜索Form配置
  const searchSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'dictType',
      component: 'NSelect',
      label: I18n.global.t('ziDianBiaoShi'),
      isShow: true,
      componentProps: {
        options: [],
        labelField: 'name',
        valueField: 'dictType',
        filterable: true,
        onUpdateValue: (value: any) => {
          console.log(value);
        },
      },
    },
    {
      field: 'dictLabel',
      component: 'NInput',
      label: I18n.global.t('ziDianBiaoQian'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZiDianBiaoQian'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: I18n.global.t('zhuangTai'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeZiDianZhuangTai'),
        options: data_status,
        filterable: true,
        clearable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
  ]);

  const [
    searchRegister,
    { getFieldsValue: getSearchFieldsValue, setFieldsValue: setSearchFieldsValue },
  ] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: 100,
    showAdvancedButton: true,
    showResetButton: false,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  const route = useRoute();
  // Table实例
  const actionRef = ref();

  // 弹出层实例
  const modalRef: any = ref();
  // 弹出层标题
  const title = ref('');

  // Table表格字段接口
  interface ListData {
    id: string;
    dictLabel: string;
    dictValue: string;
    dictSort: number;
    status: string;
    remark: string;
    createTime: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('ziDianShuJuId'),
      key: 'id',
    },
    {
      title: I18n.global.t('ziDianBiaoQian'),
      key: 'dictLabel',
      render(row) {
        return h(
          NTag,
          {
            type: 'success',
          },
          { default: () => row.dictLabel }
        );
      },
    },
    {
      title: I18n.global.t('ziDianJianZhi'),
      key: 'dictValue',
    },
    {
      title: I18n.global.t('ziDianPaiXu'),
      key: 'dictSort',
    },
    {
      title: I18n.global.t('zhuangTai'),
      key: 'status',
      render(row) {
        return h(
          NTag,
          {
            type: row.status === '0' ? 'success' : 'error',
          },
          { default: () => getDictLabel(data_status.value, row.status) }
        );
      },
    },
    {
      title: I18n.global.t('beiZhu'),
      key: 'remark',
    },
    // {
    //   title: "创建时间",
    //   key: "createTime",
    // },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: 120,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('bianJi'),
            type: 'info',
            text: true,
            onClick: handleEdit.bind(null, record),
          },
          {
            label: I18n.global.t('shanChu'),
            type: 'error',
            class: 'ml-3',
            text: true,
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'dictType',
      component: 'NInput',
      label: I18n.global.t('ziDianBiaoShi'),
      isShow: true,
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'dictLabel',
      component: 'NInput',
      label: I18n.global.t('shuJuBiaoQian'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuShuJuBiaoQian'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('shuJuBiaoQianBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'dictValue',
      component: 'NInput',
      label: I18n.global.t('shuJuJianZhi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuShuJuJianZhi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('shuJuJianZhiBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'dictSort',
      component: 'NInputNumber',
      label: I18n.global.t('xianShiPaiXu'),
      isShow: true,
      componentProps: {
        min: 1,
        placeholder: I18n.global.t('qingShuRuXianShiPaiXu'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          type: 'number',
          message: I18n.global.t('xianShiPaiXuBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'status',
      component: 'NSwitch',
      label: I18n.global.t('zhuangTai'),
      isShow: true,
      defaultValue: 0,
      componentProps: {
        checkedValue: 0,
        uncheckedValue: 1,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'remark',
      component: 'NInput',
      label: I18n.global.t('beiZhu'),
      isShow: true,
      componentProps: {
        type: 'textarea',
        placeholder: I18n.global.t('qingShuRuBeiZhu'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 120,
    layout: 'horizontal',
    schemas: submitSchemas,
    showAdvancedButton: true,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        modalRef.value.closeModal();
      });
    },
  });

  // 新增字典数据弹窗
  function addTable() {
    title.value = I18n.global.t('xinZengZiDianShuJu');
    dictDataId.value = null;
    modalRef.value.openModal();
    nextTick(() => {
      setSubmitFieldsValue({ dictType: dictType.value });
    });
  }

  // 编辑字典数据弹窗
  function handleEdit(record: Recordable) {
    getStaticDictDataView({ id: record.id }).then((res) => {
      dictDataId.value = record.id;
      title.value = I18n.global.t('bianJiZiDianShuJu');
      modalRef.value.openModal();
      nextTick(() => {
        setSubmitFieldsValue(res);
      });
    });
  }
  // 删除字典数据
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuZiDianShuJu'),
      content: I18n.global.t('queDingShanChuGaiZiDianShuJu'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteStaticDictData({ id: record.id }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          let reduceNum = record.parentId ? 0 : 1;
          getCurrentPage(actionRef, reduceNum);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getStaticDictDataList({
      // dictType会被覆盖
      sysDictDataDtoFilter: { dictType: dictType.value, ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }
  // Table表格刷新
  function reloadTable() {
    actionRef.value.reload();
  }
  // Table搜索方法
  function onTableSearch() {
    // 搜索重置页码
    actionRef.value.updatePage(1);
    // actionRef.value.reload();
  }
  // 弹窗From提交
  function confirmForm(form) {
    if (form) {
      if (dictDataId.value != null) {
        updateStaticDictData({ sysDictDataDto: { id: dictDataId.value, ...form } }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      } else {
        addStaticDictData({ sysDictDataDto: form }).then(() => {
          window['$message'].success(I18n.global.t('xinJianChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  //获取字典数据列表接口
  const getDictMapDataList = async () => {
    transformDataSource(searchSchemas, [
      {
        key: 'dictType',
        values: [
          {
            changeKey: 'componentProps.options',
            changeValue: await getDictMapList({ type: '0' }),
          },
        ],
      },
    ]);
    setSearchFieldsValue({ dictType: dictType.value });
  };

  onMounted(() => {
    dictType.value = route.query.dictType || null;
    getDictMapDataList();
  });
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
