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
          v-permission="{ action: [':api:v1:admin:app:atmospherePlaceVideo:add'] }"
        >
          新建视频
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title">
      <div class="mt-5" v-if="appId === null">
        <n-form ref="formRef" :model="addParams" :rules="rules">
          <n-form-item label="视频类型" path="videoType">
            <n-select
              placeholder="请选择"
              v-model:value="addParams.videoType"
              label-field="typeName"
              filterable
              value-field="id"
              :options="videoTypeList"
            />
          </n-form-item>

          <n-form-item label="上传场地" path="placeId">
            <n-select
              placeholder="请选择"
              v-model:value="addParams.placeId"
              label-field="placeName"
              filterable
              value-field="placeId"
              :options="userPlaceList"
            />
          </n-form-item>

          <n-form-item>
            <n-upload
              :action="uploadUrl + '/admin/app/atmospherePlaceVideo/sendVideoFileByUserSelf'"
              name="uploadFile"
              :headers="{ Authorization: token }"
              :data="{
                videoType: String(addParams.videoType),
                placeId: String(addParams.placeId),
                type: '2',
              }"
              @before-upload="beforeUpload"
              :default-upload="false"
              multiple
              @change="handleChange"
              ref="uploadRef"
              @finish="finishUpload"
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
        <BasicForm @register="submitRegister" @submit="confirmForm" />
      </div>
    </BasicModal>

    <BasicModal ref="modalBuyRef" title="预览">
      <div class="mt-5">
        <n-form>
          <n-form-item>
            <video
              :src="operaItem.videoUrl"
              controls="true"
              v-if="getUrlTypeResult(operaItem.videoUrl)"
              style="width: 390px"
            ></video>
            <n-image width="390" :src="operaItem.videoUrl" v-else />
          </n-form-item>
        </n-form>
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, BasicColumn } from '@/components/Table';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { BasicModal } from '@/components/Modal/index';
import { FormRules, FormInst } from 'naive-ui';
import { getCurrentPage, transformDataSource } from '@/utils';
import { useGlobSetting } from '@/hooks/setting';
import { getVideoTypeName } from '@/utils/dict';
// 后加
import { useUser } from '@/store/modules/user';
import type { UploadInst, UploadFileInfo } from 'naive-ui';
import { PlusOutlined } from '@vicons/antd';
import VIDEO from '@/api/atmosphere/atmospherePlaceVideo';
import USERPLACE from '@/api/atmosphere/atmosphereUserPlace';

import VTYPE from '@/api/atmosphere/espType';
import { useMessage } from 'naive-ui';
import { NTag } from 'naive-ui';
import { getDictLabel } from '@/utils/dict';

const userStore = useUser();
const token = userStore.getToken;
const userId = userStore.info.userId;
// 视频id
const appId = ref(null);
const operaItem = ref<Recordable>({});
// 类型
const videoTypeList = ref([]);
const userPlaceList = ref([]);
interface paramsInter {
  placeId: string | null;
  videoType: string | null;
}
const addParams = ref<paramsInter>({
  placeId: null,
  videoType: null,
});
const data_status = ref([
  {
    label: '正常',
    value: '1',
  },
  {
    label: '停用',
    value: '0',
  },
]);
const type_status = ref([
  {
    label: '自定义',
    value: 2,
  },
  {
    label: '积分购买',
    value: 3,
  },
]);
const rules: FormRules = {
  placeId: [
    {
      required: true,
      message: '请输入',
    },
  ],
  videoType: [
    {
      required: true,
      message: '请选择',
    },
  ],
};
onMounted(() => {
  getVideoType();
  getUserPlace();
});
async function getVideoType() {
  let res = await VTYPE.get({
    sysPostDtoFilter: {},
    pageParam: { pageNum: 1, pageSize: 1000 },
    orderParam: [],
  });
  videoTypeList.value = res.dataList;
}
async function getUserPlace() {
  let res = await USERPLACE.get({
    atmosphereUserPlaceDtoFilter: { userId },
    pageParam: { pageNum: 1, pageSize: 1000 },
  });
  userPlaceList.value = res.dataList;
}
// 搜索Form配置
const searchSchemas: FormSchema[] = [
  {
    field: 'videoName',
    component: 'NInput',
    label: '视频名称',
    isShow: true,
    componentProps: {
      placeholder: '请输入视频名称',
      filterable: true,
      onInput: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'videoType',
    component: 'NSelect',
    label: '视频类型',
    isShow: true,
    componentProps: {
      placeholder: '请选择类型',
      options: videoTypeList,
      labelField: 'typeName',
      valueField: 'id',
      filterable: true,
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'placeId',
    component: 'NSelect',
    label: '所属场地',
    isShow: true,
    componentProps: {
      placeholder: '请选择所属场地',
      options: userPlaceList,
      labelField: 'placeName',
      valueField: 'placeId',
      filterable: true,
      onUpdateValue: (e: any) => {
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
const formRef = ref<FormInst | null>(null);
// Table实例
const actionRef = ref();
// 弹出层实例
const modalRef: any = ref();
const modalBuyRef: any = ref();
// 弹出层标题
const title = ref('');
// Table表格字段接口
interface ListData {
  id: string;
  videoName: string;
  videoType: string;
  createTime: string;
  url: string;
  videoStatus: number;
  placeId: number;
  type: number;
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
    title: '视频名称',
    key: 'videoName',
  },
  {
    title: '视频类型',
    key: 'videoType',
    render(row) {
      return getVideoTypeName(videoTypeList.value, row.videoType);
    },
  },
  {
    title: '状态',
    key: 'videoStatus',
    render(row) {
      return h(
        NTag,
        {
          type: row.videoStatus === 1 ? 'success' : 'error',
        },
        { default: () => getDictLabel(data_status.value, row.videoStatus) }
      );
    },
  },
  {
    title: '来源',
    key: 'type',
    render(row) {
      return h(
        NTag,
        {
          type: row.type === 2 ? 'info' : 'warning',
        },
        { default: () => getDictLabel(type_status.value, row.type) }
      );
    },
  },
  {
    title: '所属场地',
    key: 'placeName',
  },
];
// Table表格操作配置
const actionColumn = reactive({
  width: 200,
  title: '操作',
  key: 'action',
  fixed: 'right',
  auth: [
    ':api:v1:admin:app:atmospherePlaceVideo:update',
    ':api:v1:admin:app:atmospherePlaceVideo:delete',
    ':api:v1:admin:app:atmospherePlaceVideo:view',
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
          auth: [':api:v1:admin:app:atmospherePlaceVideo:update'],
        },
        {
          label: '删除',
          type: 'error',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handleDelete.bind(null, record),
          auth: [':api:v1:admin:app:atmospherePlaceVideo:delete'],
        },
        {
          label: '预览',
          type: 'info',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handlePreview.bind(null, record),
          auth: [':api:v1:admin:app:atmospherePlaceVideo:view'],
        },
      ],
    });
  },
});
// 提交Form配置
const submitSchemas: Ref<FormSchema[]> = ref([
  {
    field: 'videoName',
    component: 'NInput',
    label: '视频名称',
    isShow: true,
    componentProps: {
      placeholder: '请输入视频名称',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '视频名称不能为空', trigger: ['blur', 'input'] }],
  },
  {
    field: 'videoType',
    component: 'NSelect',
    label: '视频类型',
    isShow: true,
    componentProps: {
      placeholder: '请选择',
      filterable: true,
      options: videoTypeList,
      labelField: 'typeName',
      valueField: 'id',
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '请选择', trigger: ['change'] }],
  },
  {
    field: 'videoStatus',
    component: 'NSelect',
    label: '状态',
    isShow: true,
    componentProps: {
      placeholder: '请选择',
      filterable: true,
      options: data_status,
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '请选择', trigger: ['change'] }],
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
]);
// 新建视频 form
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
  title.value = '新增视频';
  appId.value = null;
  addParams.value = {
    placeId: null,
    videoType: null,
  };
  addParams.value.placeId = userPlaceList.value.length ? userPlaceList.value[0].placeId : null;
  transformDataSource(submitSchemas, [
    { key: 'url', values: [{ changeKey: 'isShow', changeValue: false }] },
  ]);
  fileListLengthRef.value = 0;
  modalRef.value.openModal();
}
// 编辑
function handleEdit(record: Recordable) {
  title.value = '编辑视频';
  operaItem.value = record;
  VIDEO.getView({ id: record.id }).then((res) => {
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
      res.placeId = res.placeId + '';
      res.videoStatus = res.videoStatus + '';
      setSubmitFieldsValue({ ...res });
    });
  });
}
// 删除
function handleDelete(record: Recordable) {
  window['$dialog'].info({
    title: '删除视频',
    content: '确定删除该视频？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      VIDEO.deleteItem({ id: record.id }).then(() => {
        window['$message'].success('删除成功');
        getCurrentPage(actionRef, 1);
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}
// 获取
const loadDataTable = async (page, sort) => {
  return await VIDEO.get({
    atmospherePlaceVideoDtoFilter: { ...getSearchFieldsValue() },
    pageParam: { ...page },
    orderParam: [...sort],
  });
};
const hasDataResult = (videoType: string, placeId: string) => {
  return new Promise(async (resolve, reject) => {
    let res = await VIDEO.get({
      AtmospherePlaceEspDtoFilter: {
        videoType,
        placeId,
        videoStatus: 1,
      },
      pageParam: { pageNum: 1, pageSize: 1 },
    });
    resolve(res.dataList.length > 0);
  });
};
// 预览
function handlePreview(record: Recordable) {
  operaItem.value = record;
  modalBuyRef.value.openModal();
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
    if (appId.value != null) {
      let atmospherePlaceVideoDto = Object.assign(operaItem.value, form);
      VIDEO.update({ atmospherePlaceVideoDto }).then(() => {
        window['$message'].success('编辑成功');
        modalRef.value.closeModal();
        reloadTable();
      });
    } else {
      // addApplication({ appDto: form }).then(() => {
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
async function handleClick(e: MouseEvent) {
  // let res = await hasDataResult(String(addParams.value.videoType), String(addParams.value.placeId));
  // if (res) return window['$message'].error('同一场地、同一类型，仅可拥有一个“正常”启用视频~');
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      uploadTime = 0;
      uploadRef.value?.submit();
    } else {
      console.log(errors);
    }
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
function getUrlTypeResult(imgUrl: any): Boolean {
  if (imgUrl.indexOf('.mp4') > -1 || imgUrl.indexOf('.AVI') > -1) return true;
  return false;
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
</style>