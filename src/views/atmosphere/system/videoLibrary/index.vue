<template>
  <div class="card-graphics-wrapper">
    <n-card class="card-width" v-for="(item, index) in dataList" :key="index" v-if="0">
      <h5>{{ item!.videoName }}</h5>
      <h5>{{ item!.integral }}</h5>

      <div class="content">
        {{ getImgUrl(item) }}{{ getUrlTypeResult(item) }}
        <!-- <video :src="`${getImgUrl(item)}`" controls="true" v-if="getUrlTypeResult(item)"></video> -->
        <video :src="`${item.url}`" controls v-if="getUrlTypeResult(item)"></video>
        <n-image :src="`${getImgUrl(item)}`" v-else />
      </div>

      <div class="button-wrapper">
        <n-button quaternary type="primary" @click="handlePurchase(item)"> 购买 </n-button>
      </div>
    </n-card>
  </div>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row: ListData) => row.id" ref="actionRef"
      :actionColumn="actionColumn" @update:checked-row-keys="onCheckedRow" :scroll-x="1440">
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable"
          v-permission="{ action: [':api:v1:admin:app:atmosphereVideo:sendVideoFile'] }">
          新建视频
        </n-button>
      </template>
    </BasicTable>

    <BasicModal ref="modalRef" :title="title">
      <div class="mt-5" v-if="appId === null">
        <n-form ref="formRef" :model="addParams" :rules="rules">
          <n-form-item label="购买积分" path="integral">
            <n-input v-model:value="addParams.integral" type="text" placeholder="请输入" />
          </n-form-item>

          <n-form-item label="视频类型" path="videoTypeId">
            <n-select placeholder="请选择" v-model:value="addParams.videoTypeId" label-field="typeName" filterable
              value-field="id" :options="videoTypeList" />
          </n-form-item>

          <n-form-item>
            <n-upload :action="uploadUrl + '/admin/app/atmosphereVideo/sendVideoFile'" name="uploadFile"
              :headers="{ Authorization: token }" :data="{
        videoTypeId: String(addParams.videoTypeId),
        integral: String(addParams.integral),
      }" @before-upload="beforeUpload" :default-upload="false" multiple @change="handleChange" ref="uploadRef"
              @finish="finishUpload">
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
            <n-button class="marginLeft" type="info" :disabled="!fileListLengthRef" @click="handleClick">
              上传
            </n-button>
          </n-form-item>
        </n-form>
      </div>
      <div class="mt-5" v-else>
        <BasicForm @register="submitRegister" @submit="confirmForm" />
      </div>
    </BasicModal>

    <BasicModal ref="modalBuyRef" :title="buyTypeRef == 1 ? '预览' : '购买视频'">
      <div class="mt-5">
        <n-form>
          <n-form-item label="购买积分" v-if="buyTypeRef === 2">
            <h1>{{ operaItem.integral }}</h1>
          </n-form-item>
          <n-form-item label="所属场地" v-if="buyTypeRef === 2">
            <n-select placeholder="请选择" v-model:value="buyParams.placeId" label-field="placeName" filterable
              value-field="placeId" :options="userPlaceList" />
          </n-form-item>
          <n-form-item>
            <video v-if="getUrlTypeResult(operaItem)" :src="operaItem.url" controls style="width: 390px"></video>
            <n-image width="390" :src="operaItem.url" v-else />
          </n-form-item>
          <n-form-item class="form-botton-wrapper" v-if="buyTypeRef === 2"
            v-permission="{ action: ['api:v1:admin:app:atmospherePlaceVideo:buySystemFile'] }">
            <n-button @click="closeBuyModel">取消</n-button>
            <n-button class="marginLeft" type="info" @click="handleBuyClick"> 确认购买 </n-button>
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
import VIDEO from '@/api/atmosphere/atmosphereVideo';
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
const dataList = ref([]);
interface paramsInter {
  integral: string | null;
  videoTypeId: string | null;
}
const addParams = ref<paramsInter>({
  integral: null,
  videoTypeId: null,
});
interface buyInter {
  placeId: string | null;
  videoId: string | null;
}
const buyParams = ref<buyInter>({
  placeId: null,
  videoId: null,
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
const rules: FormRules = {
  integral: [
    {
      required: true,
      message: '请输入',
    },
  ],
  videoTypeId: [
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
const buyTypeRef = ref(1);
// 弹出层标题
const title = ref('');
// Table表格字段接口
interface ListData {
  id: string;
  videoName: string;
  videoType: string;
  createTime: string;
  url: string;
  status: number;
  integral: number;
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
    title: '购买积分',
    key: 'integral',
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
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: row.status === 1 ? 'success' : 'error',
        },
        { default: () => getDictLabel(data_status.value, row.status) }
      );
    },
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
    ':api:v1:admin:app:atmosphereVideo:update',
    ':api:v1:admin:app:atmosphereVideo:delete',
    'api:v1:admin:app:atmospherePlaceVideo:buySystemFile',
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
          auth: [':api:v1:admin:app:atmosphereVideo:update'],
        },
        {
          label: '删除',
          type: 'error',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handleDelete.bind(null, record),
          auth: [':api:v1:admin:app:atmosphereVideo:delete'],
        },
        {
          label: '预览',
          type: 'info',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handlePreview.bind(null, record),
          auth: ['api:v1:admin:app:atmospherePlaceVideo:buySystemFile'],
        },
        {
          label: '购买',
          type: 'info',
          // secondary: true,
          text: true,
          class: 'ml-3',
          onClick: handlePurchase.bind(null, record),
          auth: ['api:v1:admin:app:atmospherePlaceVideo:buySystemFile'],
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
    field: 'integral',
    component: 'NInput',
    label: '购买积分',
    isShow: true,
    componentProps: {
      placeholder: '请输入购买积分',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '请输入', trigger: ['blur', 'input'] }],
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
    field: 'status',
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
    integral: null,
    videoTypeId: null,
  };
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
      res.integral = res.integral + '';
      res.status = res.status + '';
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
  let res = await VIDEO.get({
    atmosphereVideoDtoFilter: { ...getSearchFieldsValue() },
    pageParam: { ...page },
    orderParam: [...sort],
  });
  dataList.value = res.dataList;
  return res;
};
// 预览
function handlePreview(record: Recordable) {
  operaItem.value = record;
  buyTypeRef.value = 1;
  modalBuyRef.value.openModal();
}
// 购买
function handlePurchase(record: Recordable) {
  operaItem.value = record;
  buyParams.value.videoId = record.id;
  buyTypeRef.value = 2;
  modalBuyRef.value.openModal();
}
function handleBuyClick() {
  if (!buyParams.value.placeId) {
    return window['$message'].error('请选择所属场地~');
  }
  window['$dialog'].info({
    title: '购买视频',
    content: '确定购买该视频？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      VIDEO.buySystemFile({ ...buyParams.value }).then(() => {
        window['$message'].success('购买成功');
        // getCurrentPage(actionRef, 1);
        closeBuyModel();
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
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
    if (appId.value != null) {
      let atmosphereVideoDto = Object.assign(operaItem.value, form);
      VIDEO.update({ atmosphereVideoDto }).then(() => {
        window['$message'].success('编辑成功');
        modalRef.value.closeModal();
        reloadTable();
      });
    } else {
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
function handleClick(e: MouseEvent) {
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
function closeBuyModel() {
  modalBuyRef.value.closeModal();
}
function finishUpload() {
  uploadTime += 1;
  if (fileListLengthRef.value === uploadTime) {
    modalRef.value.closeModal();
    actionRef.value.updatePage(1);
  }
}

async function getTestUrl() {
  let url = 'http://fw.ztuwl.com/LOGO.mp4';
  let url1 = 'http://fw.static.ztuwl.com/uploadFile/20240705142017/999LOGO.AVI?Expires=1720411084&OSSAccessKeyId=LTAI5tRpKbVnU5X5FhBnZrJz&Signature=j6kPuxmjuKOpAHzyHv2r4VirOz4%3D'
}

function getUrlTypeResult(imgUrl: any): Boolean {
  if (imgUrl.videoName.indexOf('.mp4') > -1 || imgUrl.videoName.indexOf('.AVI') > -1) return true;
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

.card-graphics-wrapper {
  display: flex;
  flex-wrap: wrap;

  .card-width {
    width: calc(20% - 24px);
    margin-right: 12px;
    margin-bottom: 12px;
  }

  .content {
    height: 160px;
    overflow: hidden;
    margin: 10px 0 12px;
  }

  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}
</style>