<template>
  <div class="version_form">
    <n-form ref="formRef" :model="info" :rules="rules" label-placement="left" label-width="120">
      <n-form-item :label="I18n.global.t('banBenMingCheng') + ':'" path="versionName">
        <n-input
          v-model:value="info.versionName"
          :readonly="!isEdit"
          :placeholder="I18n.global.t('qingShuRuBanBenMingCheng')"
        />
      </n-form-item>
      <n-form-item :label="I18n.global.t('banBenHao') + ':'" path="versionCode">
        <n-input
          v-model:value="info.versionCode"
          :readonly="!isEdit"
          :placeholder="I18n.global.t('qingshurubanbenhao')"
        />
      </n-form-item>
      <n-form-item :label="I18n.global.t('shiFouShiZuiXinBanBen') + ':'">
        <n-radio-group v-model:value="info.nowVersion" :disabled="!isEdit">
          <n-radio :value="1">{{ I18n.global.t('shi') }}</n-radio>
          <n-radio :value="0">{{ I18n.global.t('fou') }}</n-radio>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="I18n.global.t('gengXinLeiXing') + ':'">
        <n-radio-group v-model:value="info.updateType" :disabled="!isEdit">
          <n-radio value="forcibly">{{ I18n.global.t('qiangZhiGengXin') }}</n-radio>
          <n-radio value="solicit">{{ I18n.global.t('tanKuangQueRenGengXin') }}</n-radio>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="I18n.global.t('gengXinAPK') + ':'" path="downloadUrl">
        <n-upload
          :action="`${uploadUrl}/common/upload/upload`"
          :data="{ asImage: false }"
          :disabled="!isEdit"
          @finish="handleFinish"
          :default-file-list="fileList"
          :max="1"
          @remove="removeFile"
          @before-upload="beforeUpload"
          name="uploadFile"
          ref="uploadFileRef"
        >
          <n-button type="primary" size="small">{{ I18n.global.t('shangChuanWenJian') }}</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item :label="I18n.global.t('banBenMiaoShu') + ':'" path="versionInfo">
        <n-input
          v-model:value="info.versionInfo"
          type="textarea"
          :readonly="!isEdit"
          :placeholder="I18n.global.t('qingShuRuBanBenMiaoShu')"
        />
      </n-form-item>
      <n-form-item v-if="isEdit" style="display: flex; justify-content: center">
        <n-button type="error" size="small" @click="resetForm">{{
          I18n.global.t('zhongZhi')
        }}</n-button>
        <n-button type="success" size="small" style="margin-left: 10px" @click="updateHandle">{{
          I18n.global.t('queDingGengXin')
        }}</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { type UploadFileInfo, useMessage } from 'naive-ui';
  import { useGlobSetting } from '@/hooks/setting';
  import I18n from '@/lang/index'; //引入i18n组件
  import { getVersionDetail } from '@/api/Version/index';
  const { uploadUrl, fileUrl } = useGlobSetting();

  const formRef = ref();
  const message = useMessage();
  const emit = defineEmits(['submit']);
  const uploadFileRef = ref();

  const props = withDefaults(
    defineProps<{
      isEdit?: boolean;
      id?: string | number;
    }>(),
    {
      isEdit: true,
    }
  );

  const info = ref({
    updateType: 'solicit',
    versionCode: '',
    versionName: '',
    versionInfo: '',
    downloadUrl: '',
    nowVersion: 1,
  });

  const fileList = ref<Array<UploadFileInfo>>([]);

  const rules = {
    versionCode: { required: true, message: I18n.global.t('qingshurubanbenhao'), trigger: 'blur' },
    versionName: {
      required: true,
      message: I18n.global.t('qingShuRuBanBenMingCheng'),
      trigger: 'blur',
    },
    downloadUrl: { required: true, message: I18n.global.t('qingShangChuanAPK'), trigger: 'blur' },
    versionInfo: {
      required: true,
      message: I18n.global.t('qingShuRuBanBenMiaoShu'),
      trigger: 'blur',
    },
  };

  // 上传结束后回显
  const handleFinish = ({ event }: { event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response);
    if (res.code == 200) {
      info.value.downloadUrl = res.data.downloadUri;
    }
  };

  const removeFile = () => {
    fileList.value = [];
    uploadFileRef.value.clear();
    info.value.downloadUrl = '';
  };

  const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    if (data.file.type != 'application/vnd.android.package-archive') {
      message.error(I18n.global.t('zhiNengShangChuanAPKWenJian'));
      return false;
    }
    return true;
  };

  const updateHandle = (e) => {
    e.preventDefault();
    formRef.value.validate((errors) => {
      if (!errors) {
        emit('submit', info.value);
      } else {
        message.error(I18n.global.t('qingTianXieWanZhengXinXi'));
      }
    });
  };

  const resetForm = () => {
    info.value.updateType = 'solicit';
    info.value.versionCode = '';
    info.value.versionName = '';
    info.value.versionInfo = '';
    info.value.downloadUrl = '';
    info.value.nowVersion = 1;
  };

  const getDetial = () => {
    getVersionDetail({ id: props.id }).then((res) => {
      info.value = res;
      if (res.downloadUrl) {
        let fileName = info.value.downloadUrl.split('/');
        fileList.value.push({
          id: '1111122111222',
          name: fileName[fileName.length - 1],
          status: 'finished',
          url: fileUrl + info.value.downloadUrl,
        });
      }
    });
  };

  onMounted(() => {
    if (props.id) {
      getDetial();
    }
  });

  defineExpose({
    resetForm,
  });
</script>

<style scoped lang="less">
  .version_form {
    background-color: #ffffff;
    margin-top: 20px;
  }
</style>
