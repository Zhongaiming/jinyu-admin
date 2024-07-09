<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.postId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('xinJianGangWei') }}
        </n-button>
      </template>
    </BasicTable>

    <BasicModal
      ref="modalRef"
      :title="title"
      :width="I18n.global.locale.value === 'zh' ? 446 : 480"
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
  import { BasicModal } from '@/components/Modal/index';
  import { NTag } from 'naive-ui';
  import {
    getSysPostList,
    getSysPostView,
    addSysPost,
    updateSysPost,
    deleteSysPost,
  } from '@/api/System/setting/post';
  import { getCurrentPage } from '@/utils/index';
  import I18n from '@/lang/index'; //引入i18n组件
  // 岗位id(用于编辑)
  const postId = ref(null);
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'postName',
      component: 'NInput',
      label: I18n.global.t('gangWeiMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuGangWeiMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: I18n.global.locale.value === 'zh' ? 70 : 100,
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
    postId: string;
    postName: string;
    level: number;
    leaderPost: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('xuHao'),
      key: 'sort',
      width: I18n.global.locale.value === 'zh' ? 100 : 140,
      // sorter: {
      //   multiple: 1,
      // },
      render(row, index) {
        console.log(row);
        return index * actionRef.value.pagination.pageNum + 1;
      },
    },
    {
      title: I18n.global.t('gangWeiMingCheng'),
      key: 'postName',
      // sorter: {
      //   multiple: 2,
      // }
    },
    {
      title: I18n.global.t('gangWeiCengJi'),
      key: 'level',
      // defaultSortOrder: "ascend",
      sorter: (row1, row2) => row1.level - row2.level,
    },
    {
      title: I18n.global.t('lingDaoGangWei'),
      key: 'leaderPost',
      render(row) {
        return h(
          NTag,
          {
            type: row.leaderPost ? 'success' : 'error',
          },
          { default: () => (row.leaderPost ? I18n.global.t('shi') : I18n.global.t('fou')) }
        );
      },
    },
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
  const submitSchemas: FormSchema[] = [
    {
      field: 'postName',
      component: 'NInput',
      label: I18n.global.t('gangWeiMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuGangWeiMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('gangWeiMingChengBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'level',
      component: 'NInputNumber',
      label: I18n.global.t('gangWeiCengJi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuGangWeiCengJi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          type: 'number',
          message: I18n.global.t('gangWeiCengJiBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'leaderPost',
      component: 'NSwitch',
      label: I18n.global.t('lingDaoGangWei'),
      isShow: true,
      defaultValue: false,
      componentProps: {
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

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

  // 新增部门弹窗
  function addTable() {
    title.value = I18n.global.t('xinZengGangWei');
    postId.value = null;
    modalRef.value.openModal();
  }

  // 编辑部门弹窗
  function handleEdit(record: Recordable) {
    getSysPostView({ postId: record.postId }).then((res) => {
      postId.value = record.postId;
      title.value = I18n.global.t('bianJiGangWei');
      modalRef.value.openModal();
      nextTick(() => {
        setSubmitFieldsValue(res);
      });
    });
  }
  // 删除部门
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuGangWei'),
      content: I18n.global.t('queDingShanChuGaiGangWei'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteSysPost({ postId: record.postId }).then(() => {
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
    return await getSysPostList({
      sysPostDtoFilter: { ...getSearchFieldsValue() },
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
      if (postId.value != null) {
        updateSysPost({ sysPostDto: { postId: postId.value, ...form } }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          reloadTable();
        });
      } else {
        addSysPost({ sysPostDto: form }).then(() => {
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
