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
          class="primary-button marginR"
          @click="addTable"
          v-permission="{ action: [':api:v1:admin:app:atmosphereSystemFile:add'] }"
        >
          新建文件
        </n-button>

        <n-button
          type="error"
          class="primary-button marginR"
          @click="handleSelectDelete"
          :disabled="selectIdList.length === 0"
          v-permission="{ action: [':api:v1:admin:app:atmosphereSystemFile:delete'] }"
        >
          删除文件
        </n-button>

        <n-button
          type="error"
          class="primary-button marginR"
          @click="handleAllDelete"
          v-permission="{ action: ['api:v1:admin:app:atmosphereSystemFile:deleteAllSystemFile'] }"
        >
          一键删除
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title">
      <div class="mt-5" v-if="appId === null">
        <n-form ref="formRef">
          <n-form-item>
            <n-upload
              :action="uploadUrl + '/admin/app/atmosphereSystemFile/add'"
              name="uploadFile"
              :headers="{ Authorization: token }"
              @before-upload="beforeUpload"
              :default-upload="false"
              multiple
              @change="handleChange"
              ref="uploadRef"
              @finish="finishUpload"
              :data="{ type: '1' }"
            >
              <n-button>
                <n-icon size="18" class="m-auto">
                  <PlusOutlined />
                </n-icon>
                <span class="upload-title">选择文件</span>
              </n-button>
            </n-upload>
          </n-form-item>

          <n-form-item class="form-botton-wrapper">
            <n-button @click="closeModel">取消</n-button>
            <n-button
              class="marginLeft"
              type="info"
              :disabled="!fileListLengthRef"
              @click="handleClick"
            >
              上传
            </n-button>
          </n-form-item>
        </n-form>
      </div>

      <div class="mt-5" v-else>
        <BasicForm ref="modalFormRef" @register="submitRegister" @submit="confirmForm" />
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, BasicColumn } from '@/components/Table';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { BasicModal } from '@/components/Modal/index';
import { getCurrentPage, transformDataSource } from '@/utils';
import { useGlobSetting } from '@/hooks/setting';
// 后加
import { useUser } from '@/store/modules/user';
import type { UploadInst, UploadFileInfo } from 'naive-ui';
import { PlusOutlined } from '@vicons/antd';
import ESPFILE from '@/api/atmosphere/atmosphereSystemFile';
import { useMessage } from 'naive-ui';

const userStore = useUser();
const token = userStore.getToken;
// 文件id
const appId = ref(null);
// 类型
const videoTypeId = ref('');
const selectIdList = ref([]);

// 搜索Form配置
const searchSchemas: FormSchema[] = [
  {
    field: 'systemFileName',
    component: 'NInput',
    label: '文件名称',
    isShow: true,
    componentProps: {
      placeholder: '请输入文件名称',
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
const operaItem = ref({});
// Table表格字段接口
interface ListData {
  id: string;
  systemFileName: string;
  videoType: string;
  createTime: string;
  systemFileUrl: string;
  status: number;
}
// Table表格表头与数据配置
const columns: BasicColumn<ListData>[] = [
  {
    type: 'selection',
    disabled(row: ListData) {
      return false;
    },
  },
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
    title: '文件名称',
    key: 'systemFileName',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
];
// Table表格操作配置
const actionColumn = reactive({
  width: 200,
  title: '操作',
  key: 'action',
  fixed: 'right',
  auth: [
    ':api:v1:admin:app:atmosphereSystemFile:update',
    ':api:v1:admin:app:atmosphereSystemFile:delete',
  ],
  render(record) {
    return h(TableAction as any, {
      style: 'button',
      actions: [
        {
          label: '编辑',
          type: 'info',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handleEdit.bind(null, record),
          auth: [':api:v1:admin:app:atmosphereSystemFile:update'],
        },
        {
          label: '删除',
          type: 'error',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handleDelete.bind(null, record),
          auth: [':api:v1:admin:app:atmosphereSystemFile:delete'],
        },
      ],
    });
  },
});

// 提交Form配置
const submitSchemas: Ref<FormSchema[]> = ref([
  {
    field: 'systemFileName',
    component: 'NInput',
    label: '文件名称',
    isShow: true,
    componentProps: {
      placeholder: '请输入文件名称',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '文件名称不能为空', trigger: ['blur', 'input'] }],
  },
]);
// 新建文件 form
const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
  gridProps: { cols: 1 },
  collapsedRows: 3,
  labelWidth: 100,
  layout: 'horizontal',
  schemas: submitSchemas,
  submitButtonText: '确定',
  resetButtonText: '取消',
  submitClassName: 'primary-button',
  resetFunc: () => {
    return new Promise(() => {
      modalRef.value.closeModal();
    });
  },
});

// 新增
function addTable() {
  title.value = '新增文件';
  appId.value = null;
  videoTypeId.value = '';
  transformDataSource(submitSchemas, [
    { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
  ]);
  fileListLengthRef.value = 0;
  modalRef.value.openModal();
}
// 编辑
function handleEdit(record: Recordable) {
  title.value = '编辑文件';
  operaItem.value = record;
  ESPFILE.getView({ id: record.id }).then((res) => {
    transformDataSource(submitSchemas, [
      { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
    appId.value = record.id;
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
// 删除
function handleDelete(record: Recordable) {
  window['$dialog'].info({
    title: '删除文件',
    content: '确定删除该文件？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      let idList: any = [];
      idList.push(record.id);
      ESPFILE.deleteItem({ idList }).then(() => {
        window['$message'].success('删除成功');
        getCurrentPage(actionRef, 1);
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}
function handleSelectDelete() {
  window['$dialog'].info({
    title: '批量删除',
    content: `确定删除选中的 ${selectIdList.value.length} 个文件？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      let idList = selectIdList.value;
      ESPFILE.deleteItem({ idList }).then(() => {
        window['$message'].success('删除成功');
        getCurrentPage(actionRef, 1);
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}
function handleAllDelete() {
  window['$dialog'].info({
    title: '全部删除',
    content: '确定要“一键删除”所有系统文件？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ESPFILE.deleteAll({}).then(() => {
        window['$message'].success('删除成功');
        getCurrentPage(actionRef, 1);
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}
//  获取
const loadDataTable = async (page, sort) => {
  return await ESPFILE.get({
    atmosphereSystemFileDtoFilter: { ...getSearchFieldsValue() },
    pageParam: { ...page },
    // orderParam: [...sort],
    orderParam: [
      {
        asc: false,
        dateAggregateBy: '',
        fieldName: 'createTime',
      },
    ],
  });
};
// Table表格选中行
function onCheckedRow(rowKeys: any) {
  console.log(rowKeys);
  selectIdList.value = rowKeys;
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
      let atmosphereSystemFileDto = Object.assign(operaItem.value, form);
      ESPFILE.update({ atmosphereSystemFileDto }).then(() => {
        window['$message'].success('编辑成功');
        modalRef.value.closeModal();
        reloadTable();
      });
    } else {
      handleClick();
      // addApplication({ espDto: form }).then(() => {
      //     window['$message'].success('新建成功');
      //     modalRef.value.closeModal();
      //     reloadTable();
      // });
    }
  } else {
    window['$message'].info('请填写完整信息');
  }
}

// 公共上传接口
const { uploadUrl } = useGlobSetting();
const fileListLengthRef = ref(0);
const uploadRef = ref<UploadInst | null>(null);
const message = useMessage();

function handleChange(options: { fileList: UploadFileInfo[] }) {
  fileListLengthRef.value = options.fileList.length;
}

var uploadTime = 0;
function handleClick() {
  // if (!videoTypeId.value) {
  //     return window['$message'].info('请选择文件类型');
  // }
  window['$dialog'].info({
    title: '文件上传',
    content: '确定上传选中文件？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      uploadTime = 0;
      uploadRef.value?.submit();
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}

//上传之前
function beforeUpload({ file }) {
  const fileInfo = file.file;
  // const accept = '.mp4,.jpg,.png,.jpeg,.svg,.gif';
  // const acceptRef = (isString(accept) && accept.split(',')) || [];
  const maxSize = 1000;
  // 设置最大值，则判断
  if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
    message.error(`上传文件最大值不能超过${maxSize}M`);
    return false;
  }

  // 设置类型,则判断
  // if (acceptRef.length > 0) {
  //     message.error(`只能上传文件类型为${accept}`);
  //     return false;
  // }

  return true;
}
function closeModel() {
  modalRef.value.closeModal();
}

function finishUpload() {
  uploadTime += 1;
  if (fileListLengthRef.value === uploadTime) {
    modalRef.value.closeModal();
    actionRef.value.updatePage(1);
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

.form-botton-wrapper {
  display: flex;
  justify-content: flex-end;

  .marginLeft {
    margin-left: 12px;
  }
}

.marginR {
  margin-right: 12px;
}
</style>