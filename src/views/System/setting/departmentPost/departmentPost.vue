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
          {{ $t('gangWeiSheZhi') }}
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title" :width="1200">
      <div class="mt-5 w-full">
        <BasicForm @register="modalSearchRegister" @submit="onModalTableSearch" />
        <BasicTable
          :columns="modalColumns"
          :request="modalLoadDataTable"
          :row-key="(row:ListData) => row.postId"
          ref="modalActionRef"
          @update:checked-row-keys="onModalCheckedRow"
          :scroll-x="1000"
        >
          <template #tableTitle>
            <n-button
              type="primary"
              class="primary-button"
              :disabled="!modalCheckedList.length"
              @click="confirmForm"
            >
              {{ $t('tianJiaGangWei') }}
            </n-button>
          </template>
        </BasicTable>
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
    getSysDeptPostList,
    getNotInSysDeptPostList,
    addSysDeptPost,
    updateSysDeptPost,
    deleteSysDeptPost,
  } from '@/api/System/setting/department/departmentPost';
  import { getCurrentPage } from '@/utils/index';
  import I18n from '@/lang/index'; //引入i18n组件
  // 部门id
  const deptId: any = ref(null);
  // 弹窗table选择行数组
  const modalCheckedList = ref([]);
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

  // 弹窗搜索Form配置
  const modalSearchSchemas: FormSchema[] = [
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

  const [modalSearchRegister, { getFieldsValue: getModalSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:3 xxl:3' },
    labelWidth: I18n.global.locale.value === 'zh' ? 70 : 100,
    showAdvancedButton: true,
    schemas: modalSearchSchemas,
    submitClassName: 'primary-button',
  });

  const route = useRoute();
  // Table实例
  const actionRef = ref();
  // 弹窗Table实例
  const modalActionRef = ref();
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
      width: I18n.global.locale.value === 'zh' ? 100 : 120,
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
      title: I18n.global.t('gangWeiBieMing'),
      key: 'sysDeptPost.postShowName',
      editComponent: 'NInput',
      editRule: true,
      editRow: true,
      edit: true,
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

  const modalColumns: BasicColumn<ListData>[] = [
    {
      type: 'selection',
      key: 'selection',
      width: 80,
    },
    {
      title: I18n.global.t('xuHao'),
      key: 'sort',
      width: 130,
      // sorter: {
      //   multiple: 1,
      // },
      render(row, index) {
        console.log(row);
        return index * modalActionRef.value.pagination.pageNum + 1;
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
    width: 160,
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
          // secondary: true,
          text: true,
          onClick: handleEdit.bind(null, record),
        },
        {
          label: I18n.global.t('yiChu'),
          type: 'error',
          class: 'ml-3',
          // secondary: true,
          text: true,
          onClick: handleDelete.bind(null, record),
        },
      ];
    } else {
      return [
        {
          label: I18n.global.t('baoCun'),
          onClick: handleSave.bind(null, record),
        },
        {
          label: I18n.global.t('quXiao'),
          onClick: handleCancel.bind(null, record),
        },
      ];
    }
  }

  // 自定义按钮保存
  async function handleSave(record) {
    await record.onEdit?.(false, true);
    delete record.sysDeptPost.level;
    updateSysDeptPost({ sysDeptPostDto: record.sysDeptPost }).then(() => {
      window['$message'].success(I18n.global.t('xiuGaiChengGong'));
      reloadTable();
    });
  }

  // 自定义按钮取消
  function handleCancel(record) {
    record.onEdit?.(false, false);
  }
  // 添加部门岗位弹窗
  function addTable() {
    title.value = I18n.global.t('gangWeiSheZhi');
    modalRef.value.openModal();
  }
  // 修改部门岗位别名
  function handleEdit(record: Recordable) {
    console.log(record);
    record.onEdit?.(true);
  }
  // 删除部门岗位
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('yiChuGangWei'),
      content: I18n.global.t('queDingYiChuGaiGangWei'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteSysDeptPost({
          deptId: record.sysDeptPost.deptId,
          postId: record.sysDeptPost.postId,
        }).then(() => {
          window['$message'].success(I18n.global.t('yiChuChengGong'));
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
    return await getSysDeptPostList({
      deptId: deptId.value,
      sysPostDtoFilter: { ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  //  获取弹窗Table表格数据
  const modalLoadDataTable = async (page, sort) => {
    return await getNotInSysDeptPostList({
      deptId: deptId.value,
      sysPostDtoFilter: { ...getModalSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }
  // 弹窗Table表格选中行
  function onModalCheckedRow(rowKeys, rows) {
    console.log(rowKeys);
    modalCheckedList.value = rows.map((item) => {
      return {
        postId: item.postId,
        postShowName: item.postName,
      };
    });
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
  // 弹窗Table搜索方法
  function onModalTableSearch() {
    // 搜索重置页码
    modalActionRef.value.updatePage(1);
    modalActionRef.value.reload();
  }
  // 添加岗位
  function confirmForm() {
    addSysDeptPost({
      deptId: deptId.value,
      sysDeptPostDtoList: modalCheckedList.value,
    }).then(() => {
      window['$message'].success(I18n.global.t('tianJiaChengGong'));
      modalRef.value.closeModal();
      reloadTable();
    });
  }
  onMounted(() => {
    deptId.value = route.query.deptId || null;
  });
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
  :deep(.n-dialog.n-modal) {
    max-width: auto !important;
  }
</style>
