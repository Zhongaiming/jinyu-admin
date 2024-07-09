<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>

  <n-card class="pro-card" hoverable>
    <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row: ListData) => row.id" ref="actionRef"
      :actionColumn="actionColumn" @update:checked-row-keys="onCheckedRow" :scroll-x="1440">
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable"
          v-permission="{ action: ['api:v1:admin:app:atmospherePlaceEsp:add'] }">
          新建文件
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title">
      <div class="mt-5" v-if="appId === null">
        <n-form ref="formRef">
          <n-form-item label="上传场地">
            <n-select placeholder="请选择" v-model:value="placeId" label-field="placeName" filterable value-field="placeId"
              :options="userPlaceList" />
          </n-form-item>

          <n-form-item>
            <!-- <n-upload
              :action="uploadUrl + '/admin/app/esp/sendEspFile'"
              name="uploadFile"
              :headers="{ Authorization: token }"
              @before-upload="beforeUpload"
              :default-upload="false"
              multiple
              @change="handleChange"
              :data="{ placeId: placeId }"
              @finish="finishUpload"
            > -->
            <n-upload ref="uploadRef" action="#" @before-upload="beforeUpload" @change="handleChange"
              :default-upload="false" :custom-request="myUpload">
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
            <n-button class="marginLeft" :disabled="!fileListLengthRef" type="info" @click="handleClick">
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
import type { UploadInst, UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui';
import { PlusOutlined } from '@vicons/antd';
import ESPFILE from '@/api/atmosphere/atmospherePlaceEsp';
import USERPLACE from '@/api/atmosphere/atmosphereUserPlace';
import { useMessage } from 'naive-ui';
import { UserInfoType, useUserStore } from '@/store/modules/user';
import axios from 'axios';
const userSId = useUserStore();
const userInfo: UserInfoType = userSId.getUserInfo || {};
const userStore = useUser();
const token = userStore.getToken;
// 文件id
const appId = ref(null);
const placeId = ref<string | null>(null);
// 类型
const videoTypeId = ref('');
const userPlaceList = ref([]);
onMounted(() => {
  getUserPlace();
});
async function getUserPlace() {
  let res = await USERPLACE.get({
    atmosphereUserPlaceDtoFilter: { userId: userInfo.userId },
    pageParam: { pageNum: 1, pageSize: 1000 },
  });
  userPlaceList.value = res.dataList;
}
// 搜索Form配置
const searchSchemas: FormSchema[] = [
  {
    field: 'espName',
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
    key: 'espName',
  },
  {
    title: '所属场地',
    key: 'placeName',
  },
  {
    title: '所属编号',
    key: 'placeCode',
  },
];
// Table表格操作配置
const actionColumn = reactive({
  width: 200,
  title: '操作',
  key: 'action',
  fixed: 'right',
  auth: [
    'api:v1:admin:app:atmospherePlaceEsp:update',
    'api:v1:admin:app:atmospherePlaceEsp:delete',
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
          auth: ['api:v1:admin:app:atmospherePlaceEsp:update'],
        },
        {
          label: '删除',
          type: 'error',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handleDelete.bind(null, record),
          auth: ['api:v1:admin:app:atmospherePlaceEsp:delete'],
        },
      ],
    });
  },
});
// 提交Form配置
const submitSchemas: Ref<FormSchema[]> = ref([
  {
    field: 'espName',
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
  {
    field: 'placeId',
    component: 'NSelect',
    label: '所属场地',
    isShow: true,
    componentProps: {
      placeholder: '请选择',
      filterable: true,
      options: userPlaceList,
      labelField: 'placeName',
      valueField: 'placeId',
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '请选择', trigger: ['change'] }],
  },
  // {
  //     field: 'svg',
  //     component: 'BasicUpload',
  //     label: '',
  //     isShow: true,
  //     componentProps: {
  //         // action: '/common/upload/upload',
  //         action: '/admin/app/atmosphereVideo/sendVideoFile',
  //         data: { asImage: true },
  //         name: 'uploadFile',
  //         width: 100,
  //         height: 100,
  //         max: 100,
  //         helpText: '',
  //         accept: '.mp4,.jpg,.png,.jpeg,.svg,.gif',
  //         maxSize: 1000,
  //     },
  // },
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
  placeId.value = userPlaceList.value.length ? userPlaceList.value[0].placeId : null;
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
      ESPFILE.deleteItem({ id: record.id }).then(() => {
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
    AtmospherePlaceEspDtoFilter: { ...getSearchFieldsValue() },
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
      let atmospherePlaceEspDto = Object.assign(operaItem.value, form);
      ESPFILE.update({ atmospherePlaceEspDto }).then(() => {
        window['$message'].success('编辑成功');
        modalRef.value.closeModal();
        reloadTable();
      });
    } else {
      handleClick();
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

function handleChange(options: { fileList: UploadFileInfo[]; file: any }) {
  fileListLengthRef.value = options.fileList.length;
}

var uploadTime = 0;
function handleClick() {
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
async function finishUpload() {
  uploadTime += 1;
  if (fileListLengthRef.value === uploadTime) {
    modalRef.value.closeModal();
    actionRef.value.updatePage(1);
  }
}

const myUpload = ({ file }: UploadCustomRequestOptions) => {
  let data = new FormData();
  if (file.file !== null && file.file !== undefined) {
    data.append('uploadFile', file.file);
  }
  if (placeId.value !== null && placeId.value !== undefined) {
    data.append('placeId', placeId.value);
  }
  axios({
    url: uploadUrl + '/admin/app/esp/sendEspFile',
    method: 'post',
    data: data,
    headers: { Authorization: token }
  }).then((res) => {
    if (res.data.code === 200) {
      modalRef.value.closeModal();
      actionRef.value.updatePage(1);
    } else if (res.data.code === -1 && res.data.message !== undefined) {
      window['$message'].error(res.data.message);
    }
  });
};
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
</style>