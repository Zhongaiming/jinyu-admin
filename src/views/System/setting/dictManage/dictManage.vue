<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
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
        <div class="flex flex-col items-start">
          <n-button type="primary" @click="addTable" class="primary-button">
            {{ $t('xinJianZiDian') }}
          </n-button>
          <n-radio-group
            v-model:value="type"
            name="radioButtonGroup"
            class="mt-5"
            @update:value="onTableSearch"
          >
            <n-radio-button
              v-for="item in dict_type"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </n-radio-group>
        </div>
      </template>
    </BasicTable>

    <BasicModal
      ref="modalRef"
      :title="title"
      :width="I18n.global.locale.value === 'zh' ? 520 : 550"
    >
      <div class="mt-5">
        <BasicForm @register="submitRegister" @submit="confirmForm">
          <template #tableNameSolt="{ model, field }">
            <n-select
              v-model:value="model[field]"
              :options="olineDblinkList"
              filterable
              clearable
              label-field="dblinkDesc"
              value-field="dblinkId"
              @update:value="changeTableName"
            />
          </template>
          <template #dbLinkIdSolt="{ model, field }">
            <n-select
              v-model:value="model[field]"
              :options="dblinkTablesList"
              filterable
              clearable
              label-field="tableName"
              value-field="tableName"
              @update:value="changeDbTable"
            />
          </template>
          <template #dictKeySolt="{ model, field }">
            <n-select
              v-model:value="model[field]"
              :options="dblinkTableColumnsList"
              filterable
              clearable
              label-field="columnName"
              value-field="columnName"
            />
          </template>
          <template #dictValueSolt="{ model, field }">
            <n-select
              v-model:value="model[field]"
              :options="dblinkTableColumnsList"
              filterable
              clearable
              label-field="columnName"
              value-field="columnName"
            />
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { BasicModal } from '@/components/Modal/index';
  import { NTag } from 'naive-ui';
  import { transformDataSource } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  import I18n from '@/lang/index'; //引入i18n组件
  import {
    getDictList,
    getDictView,
    addDict,
    updateDict,
    deleteDict,
    getOlineDblinkList,
    getListDblinkTableColumns,
    getListDblinkTables,
  } from '@/api/System/setting/dict';
  import { useDict, getDictLabel } from '@/utils/dict';
  import { getCurrentPage } from '@/utils/index';
  // 获取字典
  const { dict_type, data_status } = useDict('dict_type', 'data_status');
  // 字典id(用于编辑)
  const dictId = ref(null);
  // 默认颜色
  const cssPrimaryColor = ref(cssConvert('primaryColor', 0.9));
  // 默认Hover颜色
  const cssPrimaryColorHover = ref(cssConvert('primaryColorHover', 0.8));
  // 字典类型
  const type = ref('0');
  // 数据库
  const olineDblinkList = ref([]);
  // 数据表
  const dblinkTablesList = ref([]);

  // 表字段
  const dblinkTableColumnsList = ref([]);

  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'postName',
      component: 'NInput',
      label: I18n.global.t('ziDianMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZiDianMingCheng'),
        clearable: true,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'dictType',
      component: 'NInput',
      label: I18n.global.t('ziDianBiaoShi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZiDianBiaoShi'),
        clearable: true,
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
  // 弹出层实例
  const modalRef: any = ref();
  // 弹出层标题
  const title: Ref<string> = ref('');

  // Table表格字段接口
  interface ListData {
    id: number;
    name: string;
    dictType: string;
    status: string;
    remark: string;
    createTime: string;
    // 不显示属性
    type: number;
    dictKey: string;
    dictValue: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('ziDianBianHao'),
      key: 'id',
    },
    {
      title: I18n.global.t('ziDianMingCheng'),
      key: 'name',
    },
    {
      title: I18n.global.t('ziDianBiaoShi'),
      key: 'dictType',
      render(row) {
        return h(
          'div',
          {
            class: 'link-type',
            onClick: () => {
              row.type == 0
                ? router.push({
                    name: 'staticDictData',
                    query: { dictType: row.dictType },
                  })
                : router.push({
                    name: 'dynamicDictData',
                    query: {
                      dictType: row.dictType,
                      dictKey: row.dictKey,
                      dictValue: row.dictValue,
                    },
                  });
            },
          },
          { default: () => row.dictType }
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
    width: 130,
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
            // secondary: true,
            text: true,
            onClick: handleEdit.bind(null, record),
          },
          {
            label: I18n.global.t('shanChu'),
            type: 'error',
            class: 'ml-4',
            // secondary: true,
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
      field: 'name',
      component: 'NInput',
      label: I18n.global.t('ziDianMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZiDianMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('ziDianMingChengBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'dictType',
      component: 'NInput',
      label: I18n.global.t('ziDianBiaoShi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZiDianBiaoShi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('ziDianBiaoShiBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'type',
      component: 'NRadioGroup',
      label: I18n.global.t('ziDianLeiXing'),
      isShow: true,
      defaultValue: '0',
      componentProps: {
        options: dict_type,
        onUpdateValue: (e: any) => {
          if (e === '0') {
            transformDataSource(submitSchemas, [
              { key: 'tableName', values: [{ changeKey: 'isShow', changeValue: false }] },
              { key: 'dbLinkId', values: [{ changeKey: 'isShow', changeValue: false }] },
              { key: 'dictKey', values: [{ changeKey: 'isShow', changeValue: false }] },
              { key: 'dictValue', values: [{ changeKey: 'isShow', changeValue: false }] },
            ]);
          } else {
            setSubmitFieldsValue({
              tableName: null,
              dbLinkId: null,
              dictKey: null,
              dictValue: null,
            });
            transformDataSource(submitSchemas, [
              { key: 'tableName', values: [{ changeKey: 'isShow', changeValue: true }] },
              { key: 'dbLinkId', values: [{ changeKey: 'isShow', changeValue: true }] },
              { key: 'dictKey', values: [{ changeKey: 'isShow', changeValue: true }] },
              { key: 'dictValue', values: [{ changeKey: 'isShow', changeValue: true }] },
            ]);
          }
        },
      },
    },
    {
      field: 'dbLinkId',
      component: 'NSelect',
      label: I18n.global.t('shuJuKu'),
      isShow: false,
      slot: 'tableNameSolt',
      rules: [
        {
          required: true,
          type: 'number',
          message: I18n.global.t('shuJuKuBuNengWeiKong'),
          trigger: ['change'],
        },
      ],
    },
    {
      field: 'tableName',
      component: 'NSelect',
      label: I18n.global.t('shuJuBiao'),
      isShow: false,
      slot: 'dbLinkIdSolt',
      rules: [
        {
          required: true,
          message: I18n.global.t('shuJuBiaoBuNengWeiKong'),
          trigger: ['change'],
        },
      ],
    },
    {
      field: 'dictKey',
      component: 'NSelect',
      label: I18n.global.t('ziDianJianZiDuan'),
      isShow: false,
      slot: 'dictKeySolt',
      rules: [
        {
          required: true,
          message: I18n.global.t('ziDianJianZiDuanBuNengWeiKong'),
          trigger: ['change'],
        },
      ],
    },
    {
      field: 'dictValue',
      component: 'NSelect',
      label: I18n.global.t('ziDianZhiZiDuan'),
      isShow: false,
      slot: 'dictValueSolt',
      rules: [
        {
          required: true,
          message: I18n.global.t('ziDianZhiZiDuanBuNengWeiKong'),
          trigger: ['change'],
        },
      ],
    },
    {
      field: 'status',
      component: 'NSwitch',
      label: I18n.global.t('zhuangTai'),
      isShow: true,
      defaultValue: '0',
      componentProps: {
        checkedValue: '0',
        uncheckedValue: '1',
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
    labelWidth: I18n.global.locale.value === 'zh' ? 120 : 160,
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

  // 新增字典弹窗
  function addTable() {
    title.value = I18n.global.t('xinZengZiDian');
    dictId.value = null;
    transformDataSource(submitSchemas, [
      { key: 'tableName', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'dbLinkId', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'dictKey', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'dictValue', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
    modalRef.value.openModal();
  }

  // 编辑字典弹窗
  function handleEdit(record: Recordable) {
    transformDataSource(submitSchemas, [
      { key: 'tableName', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'dbLinkId', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'dictKey', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'dictValue', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
    getDictView({ id: record.id }).then((res) => {
      dictId.value = record.id;
      title.value = I18n.global.t('bianJiZiDian');
      modalRef.value.openModal();
      if (res.type === '1') {
        transformDataSource(submitSchemas, [
          { key: 'tableName', values: [{ changeKey: 'isShow', changeValue: true }] },
          { key: 'dbLinkId', values: [{ changeKey: 'isShow', changeValue: true }] },
          { key: 'dictKey', values: [{ changeKey: 'isShow', changeValue: true }] },
          { key: 'dictValue', values: [{ changeKey: 'isShow', changeValue: true }] },
        ]);
        getOlineDblink();
        getDblinkTables(res.dbLinkId);
        getDblinkTableColumns(res.dbLinkId, res.tableName);
      }
      nextTick(() => {
        setSubmitFieldsValue(res);
      });
    });
  }
  // 删除字典
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuZiDian'),
      content: I18n.global.t('queDingShanChuGaiZiDian'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteDict({ id: record.id }).then(() => {
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
    return await getDictList({
      sysDictDtoFilter: { type: type.value, ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // 获取数据库
  function getOlineDblink() {
    getOlineDblinkList({ pageParam: { pageNum: 1, pageSize: 9999 } }).then((res) => {
      olineDblinkList.value = res.dataList;
    });
  }

  // 获取数据表接口
  function getDblinkTables(dblinkId) {
    getListDblinkTables({ dblinkId }).then((res) => {
      dblinkTablesList.value = res;
    });
  }

  // 获取表字段
  function getDblinkTableColumns(dblinkId, tableName) {
    getListDblinkTableColumns({ dblinkId, tableName }).then((res) => {
      dblinkTableColumnsList.value = res;
    });
  }

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
      if (dictId.value != null) {
        updateDict({ sysDictDto: { id: dictId.value, ...form } }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      } else {
        addDict({ sysDictDto: form }).then(() => {
          window['$message'].success(I18n.global.t('xinJianChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  // 数据库Select改变
  function changeTableName(value) {
    getDblinkTables(value);
  }
  // 数据表Select改变
  function changeDbTable(value, option) {
    console.log(value);
    getDblinkTableColumns(option.dblinkId, option.tableName);
  }
  onMounted(() => {
    getOlineDblink();
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
    align-items: flex-start;
    padding: 0 0 16px;
  }
  :deep(.link-type) {
    color: v-bind(cssPrimaryColor);
    cursor: pointer;
    &:hover {
      color: v-bind(cssPrimaryColorHover);
    }
  }
</style>
