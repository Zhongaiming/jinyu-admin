<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.appId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          <!-- <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template> -->
          {{ $t('xinJianYingYong') }}
        </n-button>
      </template>

      <!-- <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template> -->
    </BasicTable>

    <BasicModal
      ref="modalRef"
      :title="title"
      :width="I18n.global.locale.value === 'zh' ? 446 : 500"
    >
      <div class="mt-5">
        <BasicForm @register="submitRegister" @submit="confirmForm" />
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { BasicImage } from '@/components/Image/index';
  import {
    getApplicationList,
    getApplicationView,
    addApplication,
    updateApplication,
    deleteApplication,
  } from '@/api/System/setting/application';
  // import { PlusOutlined } from '@vicons/antd';
  // import { useRouter } from 'vue-router';
  import { getCurrentPage, transformDataSource } from '@/utils';
  import { useDict, getDictLabel } from '@/utils/dict';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { application_type } = useDict('application_type');
  // 应用id
  const appId = ref(null);

  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('yingYongMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYingYongMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'type',
      // labelMessage: '应用类型',
      component: 'NSelect',
      label: I18n.global.t('yingYongLeiXing'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeLeiXing'),
        options: application_type,
        filterable: true,
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
  const title = ref('');

  // Table表格字段接口
  interface ListData {
    appId: string;
    title: string;
    showOrder: number;
    address: string;
    type: string;
    svg: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('yingYongId'),
      key: 'appId',
    },
    {
      title: I18n.global.t('yingYongMingCheng'),
      key: 'title',
    },
    {
      title: I18n.global.t('yingYongLeiXing'),
      key: 'type',
      render(row) {
        return getDictLabel(application_type.value, row.type);
      },
    },
    {
      title: I18n.global.t('paiXu'),
      key: 'showOrder',
    },
    {
      title: I18n.global.t('tuBiao'),
      key: 'avatar',
      render(row) {
        return h(BasicImage, {
          width: 48,
          height: 48,
          src: row.svg,
        });
      },
    },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: I18n.global.locale.value === 'zh' ? 200 : 260,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('caiDanPeiZhi'),
            type: 'success',
            // secondary: true,
            text: true,
            onClick: handleToAddMenu.bind(null, record),
          },
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
      label: I18n.global.t('yingYongMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYingYongMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('yingYongMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'type',
      component: 'NSelect',
      label: I18n.global.t('yingYongLeiXing'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeYingYongLeiXing'),
        options: application_type,
        filterable: true,
        onUpdateValue: (e: any) => {
          if (e === '2') {
            transformDataSource(submitSchemas, [
              { key: 'url', values: [{ changeKey: 'isShow', changeValue: true }] },
            ]);
          } else {
            transformDataSource(submitSchemas, [
              { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
            ]);
          }
        },
      },
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
      rules: [
        {
          required: true,
          message: I18n.global.t('paiXuBuNengWeiKong'),
          type: 'number',
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'url',
      component: 'NInput',
      label: I18n.global.t('zhanWaiYingYongUrl'),
      isShow: false,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuUrl'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'svg',
      component: 'BasicUpload',
      label: I18n.global.t('yingYongTuBiao'),
      isShow: true,
      componentProps: {
        action: '/common/upload/upload',
        data: { asImage: true },
        name: 'uploadFile',
        width: 96,
        height: 96,
        max: 1,
        helpText: '',
      },
    },
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 100 : 140,
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
  // 新增应用弹窗
  function addTable() {
    title.value = I18n.global.t('xinZengYingYong');
    appId.value = null;
    transformDataSource(submitSchemas, [
      { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
    modalRef.value.openModal();
  }

  // 编辑应用弹窗
  function handleEdit(record: Recordable) {
    getApplicationView({ appId: record.appId }).then((res) => {
      transformDataSource(submitSchemas, [
        { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
      ]);
      appId.value = record.appId;
      title.value = I18n.global.t('bianJiYingYong');
      modalRef.value.openModal();
      if (res.type === '2') {
        transformDataSource(submitSchemas, [
          { key: 'url', values: [{ changeKey: 'isShow', changeValue: true }] },
        ]);
      }
      nextTick(() => {
        setSubmitFieldsValue({ ...res });
      });
    });
  }

  // 删除应用
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuYingYong'),
      content: I18n.global.t('queDingShanChuGaiYingYong'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteApplication({ appId: record.appId }).then(() => {
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
    return await getApplicationList({
      appDtoFilter: { ...getSearchFieldsValue() },
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
      if (appId.value != null) {
        updateApplication({ appDto: { appId: appId.value, ...form } }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      } else {
        addApplication({ appDto: form }).then(() => {
          window['$message'].success(I18n.global.t('xinJianChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
  // 跳转至添加菜单
  function handleToAddMenu(record: Recordable) {
    router.push({ name: 'menuConfig', query: { appId: record.appId } });
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
