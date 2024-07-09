<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.tagId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('xinJianBiaoQian') }}
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title">
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
  import I18n from '@/lang/index'; //引入i18n组件
  import {
    getCmsArticleTagList,
    getCmsArticleTagView,
    addCmsArticleTag,
    updateCmsArticleTag,
    deleteCmsArticleTag,
  } from '@/api/News/news/articleTags';
  // 获取字典
  const { data_status } = useDict('data_status');
  import { getCurrentPage, transformDataSource } from '@/utils';
  // 文章标签id
  const articleTagId = ref(null);

  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('biaoQianBiaoTi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuBiaoQianBiaoTi'),
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

  // Table实例
  const actionRef = ref();
  // 弹出层实例
  const modalRef: any = ref();
  // 弹出层标题
  const title = ref('');

  // Table表格字段接口
  interface ListData {
    tagId: string;
    title: string;
    showOrder: number;
    status: number;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('biaoQianId'),
      key: 'tagId',
    },
    {
      title: I18n.global.t('biaoQianBiaoTi'),
      key: 'title',
    },
    {
      title: I18n.global.t('paiXu'),
      key: 'showOrder',
    },
    {
      title: I18n.global.t('zhuangTai'),
      key: 'status',
      render(row) {
        return h(
          NTag,
          {
            type: row.status === 0 ? 'success' : 'error',
          },
          { default: () => getDictLabel(data_status.value, row.status) }
        );
      },
    },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: 200,
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
            class: 'ml-3',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: I18n.global.t('shanChu'),
            type: 'error',
            // secondary: true,
            text: true,
            class: 'ml-3',
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'title',
      component: 'NInput',
      label: I18n.global.t('biaoQianBiaoTi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('biaoQianBiaoTi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('biaoQianBiaoTiBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'showOrder',
      component: 'NInputNumber',
      label: I18n.global.t('paiXu'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuPaiXu'),
        min: 1,
        onInput: (e: any) => {
          console.log(e);
        },
      },
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
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 100,
    layout: 'horizontal',
    schemas: submitSchemas,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        modalRef.value.closeModal();
      });
    },
  });
  // 新增文章标签弹窗
  function addTable() {
    title.value = I18n.global.t('xinZengWenZhangBiaoQian');
    articleTagId.value = null;
    transformDataSource(submitSchemas, [
      { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
    modalRef.value.openModal();
  }

  // 编辑文章标签弹窗
  function handleEdit(record: Recordable) {
    getCmsArticleTagView({ articleTagId: record.tagId }).then((res) => {
      articleTagId.value = record.tagId;
      title.value = I18n.global.t('bianJiWenZhangBiaoQian');
      modalRef.value.openModal();
      nextTick(() => {
        setSubmitFieldsValue({ ...res });
      });
    });
  }

  // 删除应用
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuWenZhangBiaoQian'),
      content: I18n.global.t('queDingShanChuGaiWenZhangBiaoQian'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteCmsArticleTag({ articleTagId: record.tagId }).then(() => {
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
    return await getCmsArticleTagList({
      cmsArticleTagDtoFilter: { ...getSearchFieldsValue() },
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
      if (articleTagId.value != null) {
        updateCmsArticleTag({
          cmsArticleTagDto: { tagId: articleTagId.value, ...form },
        }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      } else {
        addCmsArticleTag({ cmsArticleTagDto: form }).then(() => {
          window['$message'].success(I18n.global.t('xinJianChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
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
