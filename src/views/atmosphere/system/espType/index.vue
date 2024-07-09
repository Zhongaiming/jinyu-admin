<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row: ListData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button
          type="primary"
          class="primary-button"
          @click="addTable"
          v-permission="{ action: ['api:v1:admin:app:espType:add'] }"
        >
          新建类型
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
import { BasicTable, TableAction, BasicColumn } from '@/components/Table';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { BasicModal } from '@/components/Modal/index';
import VTYPE from '@/api/atmosphere/espType';
import { getCurrentPage } from '@/utils/index';
// id(用于编辑)
const postId = ref(null);
// Table实例
const actionRef = ref();
// 弹出层实例
const modalRef: any = ref();
// 弹出层标题
const title = ref('');

// 搜索Form配置
const searchSchemas: FormSchema[] = [
  {
    field: 'typeName',
    component: 'NInput',
    label: '类型名称',
    isShow: true,
    componentProps: {
      placeholder: '请输入类型名称',
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
];
// 注册搜索 Form表单
const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
  labelWidth: 70,
  showAdvancedButton: true,
  schemas: searchSchemas,
  submitClassName: 'primary-button',
});

// Table表格字段接口
interface ListData {
  id: string;
  typeName: string;
  typeCode: string;
  createTime: string;
  defaultName: string;
}
// Table表格表头与数据配置
const columns: BasicColumn<ListData>[] = [
  {
    title: '序号',
    key: 'sort',
    width: 100,
    render(row, index) {
      row.id = row.id;
      return index * actionRef.value.pagination.pageNum + 1;
    },
  },
  {
    title: '类型名称',
    key: 'typeName',
  },
  {
    title: '类型编码',
    key: 'typeCode',
  },
  {
    title: '匹配文件名',
    key: 'defaultName',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
];
// Table表格操作配置
const actionColumn = reactive({
  width: 120,
  title: '操作',
  key: 'action',
  fixed: 'right',
  auth: ['api:v1:admin:app:espType:update', 'api:v1:admin:app:espType:delete'],
  render(record) {
    return h(TableAction as any, {
      style: 'button',
      actions: [
        {
          label: '编辑',
          type: 'info',
          text: true,
          onClick: handleEdit.bind(null, record),
          auth: ['api:v1:admin:app:espType:update'],
        },
        {
          label: '删除',
          type: 'error',
          class: 'ml-3',
          text: true,
          onClick: handleDelete.bind(null, record),
          auth: ['api:v1:admin:app:espType:delete'],
        },
      ],
    });
  },
});

// 提交Form配置
const submitSchemas: FormSchema[] = [
  {
    field: 'typeName',
    component: 'NInput',
    label: '类型名称',
    isShow: true,
    componentProps: {
      placeholder: '请输入类型名称',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '类型名称不能为空', trigger: ['blur', 'input'] }],
  },
  {
    field: 'typeCode',
    component: 'NInput',
    label: '类型编码',
    isShow: true,
    componentProps: {
      placeholder: '请输入类型编码',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '类型编码不能为空', trigger: ['blur', 'input'] }],
  },
  {
    field: 'defaultName',
    component: 'NInput',
    label: '匹配文件名',
    isShow: true,
    componentProps: {
      placeholder: '请输入匹配文件名',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '匹配文件名不能为空', trigger: ['blur', 'input'] }],
  },
];
// form 配置
const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
  gridProps: { cols: 1 },
  collapsedRows: 3,
  labelWidth: 120,
  layout: 'horizontal',
  schemas: submitSchemas,
  showAdvancedButton: true,
  submitButtonText: '确定',
  resetButtonText: '取消',
  submitClassName: 'primary-button',
  resetFunc: () => {
    return new Promise(() => {
      modalRef.value.closeModal();
    });
  },
});

/**
 * @description: 表格操作
 * @return {*}
 * @Date: 2024-06-26 10:03:46
 */
// 新增
function addTable() {
  title.value = '新增类型';
  postId.value = null;
  modalRef.value.openModal();
}
// 编辑
function handleEdit(record: Recordable) {
  VTYPE.getDetail({ id: record.id }).then((res) => {
    postId.value = record.id;
    title.value = '编辑类型';
    modalRef.value.openModal();
    nextTick(() => {
      setSubmitFieldsValue(res);
    });
  });
}
// 删除
function handleDelete(record: Recordable) {
  window['$dialog'].info({
    title: '删除类型',
    content: '确定删除该类型？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      VTYPE.deleteItem({ id: record.id }).then(() => {
        window['$message'].success('删除成功');
        let reduceNum = record.parentId ? 0 : 1;
        getCurrentPage(actionRef, reduceNum);
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}
// 查询
const loadDataTable = async (page: any, sort: any) => {
  return await VTYPE.get({
    espTypeDtoFilter: { ...getSearchFieldsValue() },
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
      VTYPE.update({ espTypeDto: { id: postId.value, ...form } }).then(() => {
        window['$message'].success('编辑成功');
        modalRef.value.closeModal();
        reloadTable();
      });
    } else {
      VTYPE.add({ espTypeDto: form }).then(() => {
        window['$message'].success('新建成功');
        modalRef.value.closeModal();
        reloadTable();
      });
    }
  } else {
    window['$message'].info('请填写完整信息');
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