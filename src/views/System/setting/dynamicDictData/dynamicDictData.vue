<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :title="$t('dongTaiZiDianXiangQingLieBiao')"
      ref="actionRef"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form/index';
  import { NTag } from 'naive-ui';
  import { getDynamicDictDataList } from '@/api/System/setting/dict/dynamicDictData';
  import { getDictMapList } from '@/api/System/setting/dict';
  import { transformDataSource } from '@/utils';
  import I18n from '@/lang/index'; //引入i18n组件
  //字典标识
  const dictType: any = ref(null);
  // 字典列表
  // const dictMapList = ref([]);

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
      field: 'dictKeySearch',
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
      field: 'dictValueSearch',
      component: 'NInput',
      label: I18n.global.t('ziDianJianZhi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZiDianJianZhi'),
        onInput: (e: any) => {
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

  // Table表格表头与数据配置
  const columns: any = ref([
    {
      title: I18n.global.t('ziDianBiaoQian'),
      key: 'label',
      render(row) {
        return h(
          NTag,
          {
            type: 'success',
          },
          { default: () => row.label }
        );
      },
    },
    {
      title: I18n.global.t('ziDianJianZhi'),
      key: 'value',
    },
  ]);

  //  获取Table表格数据
  const loadDataTable = async (page) => {
    return await getDynamicDictDataList({
      dictType: getSearchFieldsValue()?.dictType || dictType.value,
      dictKeySearch: getSearchFieldsValue()?.dictKeySearch,
      dictValueSearch: getSearchFieldsValue()?.dictValueSearch,
      pageParam: {
        ...page,
      },
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

  //获取字典数据列表接口
  const getDictMapDataList = async () => {
    transformDataSource(searchSchemas, [
      {
        key: 'dictType',
        values: [
          {
            changeKey: 'componentProps.options',
            changeValue: await getDictMapList({ type: '1' }),
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
