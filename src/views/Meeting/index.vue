<template>
  <n-card :bordered="false" class="proCard pl-8 pr-8 pt-12 pb-0">
    <div class="flex justify-around w-4/5 my-0 mx-auto" style="min-height: 265px">
      <div
        class="meeting-create-box wrap-box flex justify-center flex-col p-4"
        :style="{
          height: I18n.global.locale.value === 'zh' ? '240px' : '300px',
          width: I18n.global.locale.value === 'zh' ? '253px' : '280px',
        }"
        @click="createMeeting"
      >
        <div class="btn-icon"></div>
        <div
          class="text-2xl font-semibold m-1"
          :class="[I18n.global.locale.value === 'zh' ? '' : 'mt-8']"
        >
          {{ $t('kaiQiShiShiJiLu') }}
        </div>
        <div class="text-lg m-1">{{ $t('shiShiYuYinZhuanWenZi') }}</div>
        <div class="text-lg m-1">{{ $t('tongBuFanYiZhiNengZongJieYaoDian') }}</div>
        <div class="jump-btn-icon ml-1 mt-4"></div>
      </div>
      <n-upload
        :action="`${uploadUrl}/common/upload/upload`"
        @before-upload="beforeUpload"
        accept="audio/wav, audio/pcm"
        :data="{ asImage: false }"
        :show-file-list="false"
        style="width: 32px"
        class="mr-4"
        @finish="handleUploadFinish"
        name="uploadFile"
      >
        <div
          class="meeting-archive-box wrap-box flex justify-center flex-col p-4"
          :style="{
            height: I18n.global.locale.value === 'zh' ? '240px' : '300px',
            width: I18n.global.locale.value === 'zh' ? '253px' : '280px',
          }"
        >
          <div class="btn-icon"></div>
          <div class="text-2xl font-semibold m-1">{{ $t('shangChuanYinPin') }}</div>
          <div class="text-lg m-1">{{ $t('yinPinZhuanWenZi') }}</div>
          <div class="text-lg m-1">{{ $t('quFenFaYanRenYiJianDaoChu') }}</div>
          <div class="jump-btn-icon ml-1 mt-4"></div>
        </div>
      </n-upload>
    </div>
    <n-divider />
    <div class="data-box flex w-full p-4">
      <!-- 日历 -->
      <n-calendar
        v-model:value="toDay"
        #="{ year, month, date }"
        class="p-4 w-full"
        :on-panel-change="handlePanelChange"
      >
        <DateList :dataList="meetingDateData" v-bind="{ year, month, date }" />
      </n-calendar>
    </div>
    <BasicModal @register="modalRegister" ref="meetingTitleModalRef" @on-ok="handleOk">
      <n-form size="large" :model="meetingForm" :rules="rules" ref="meetingFormRef">
        <n-form-item path="title">
          <n-input
            v-model:value="meetingForm.title"
            type="text"
            :placeholder="$t('qingShuRuHuiYiBiaoTi')"
            autofocus
          />
        </n-form-item>
      </n-form>
    </BasicModal>
  </n-card>
</template>

<script setup lang="ts">
  defineOptions({ name: 'Meeting' });
  import { formatToDate } from '@/utils/dateUtil';
  import { getMeetingDateList, addMeeting } from '@/api/Meeting/meeting/meeting';
  import DateList from './components/dateList.vue';
  import { useModal } from '@/components/Modal';
  import { startOfMonth } from 'date-fns';
  import { type UploadFileInfo, useMessage } from 'naive-ui';
  import { useGlobSetting } from '@/hooks/setting';
  import I18n from '@/lang/index'; //引入i18n组件
  const message = useMessage();
  const { uploadUrl } = useGlobSetting();
  let url;
  const meetingTitleModalRef = ref();
  const meetingFormRef = ref();
  const meetingForm = reactive({ title: '' });
  const rules = {
    title: {
      required: true,
      message: I18n.global.t('qingShuRuHuiYiBiaoTi'),
      trigger: 'blur',
    },
  };
  const [modalRegister, { openModal, setSubLoading, closeModal, setProps }] = useModal({
    title: I18n.global.t('xinJianHuiYi'),
    showDefaultAction: true,
    submitText: I18n.global.t('chuangJian'),
  });
  const router = useRouter();
  const toDay = ref(new Date().valueOf());
  const toDayDate = computed(() => formatToDate(toDay.value, 'yyyy-MM-dd HH:mm:ss'));
  const meetingDateData = ref({});
  const getMeetingDateListFn = async (date: string) => {
    try {
      const res = await getMeetingDateList({ date });
      meetingDateData.value = res;
    } catch (err) {
      console.error('getMeetingDateListFn  err', err);
    }
  };
  const handlePanelChange = ({ year, month }) => {
    toDay.value = startOfMonth(new Date(year, month - 1)).getTime();
    getMeetingDateListFn(toDayDate.value);
  };
  // const handleUploadMeeting = () => {};
  const handleOk = () => {
    meetingFormRef.value?.validate((errors) => {
      if (!errors) {
        if (url) {
          let meetingDto = {
            meetingName: meetingForm.title,
            tapeFile: url,
          };
          addMeeting({ meetingDto }).then((res) => {
            router.push({ name: 'MeetingMinute', query: { meetingId: res } });
          });
        } else {
          router.push({ name: 'MeetingMinute', query: { title: meetingForm.title } });
          closeModal();
        }
      }

      setSubLoading(false);
    });
  };
  // 上传结束后回显
  const handleUploadFinish = ({ event }: { event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response);
    url = res.data.downloadUri;
    setProps({ title: I18n.global.t('daoRuHuiYi') });
    openModal();
  };
  /**
   * 上传前验证
   */
  const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    if (data.file.file?.type !== 'audio/wav' && data.file.file?.type !== 'audio/pcm') {
      message.error(
        I18n.global.t('zhiNengShangChuanWavHuoPcmGeShiDeYinPinWenJianQingZhongXinShangChuan')
      );
      return false;
    }
    return true;
  };
  const createMeeting = () => {
    // setProps({ title: '新建会议' });
    // openModal();

    router.push({
      name: 'MeetingMinute',
      query: { title: formatToDate(new Date().valueOf(), 'yyyy-MM-dd HH:mm:ss') },
    });
    // router.push({ name: 'MeetingMinute' });
  };
  onMounted(() => {
    getMeetingDateListFn(toDayDate.value);
  });
</script>

<style lang="less" scoped>
  .meeting-create-box {
    background: url('@/assets/images/meeting/meeting-bg.png') 0px 0px / 100% 100% no-repeat;

    .btn-icon {
      background: url('@/assets/images/meeting/meeting-icon.svg') 0px 0px / cover no-repeat;
    }
    .jump-btn-icon {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAQAAABezYzpAAAANklEQVR42mNgwAD/Gf6L/hdlwA/Aiq78v0JAIVTZ/yGk8D9hAFJIpDKKXDcYFREd9WCFYuiKAKn5tWLp7X/CAAAAAElFTkSuQmCC)
        0px 0px no-repeat;
      width: 18.41px;
      height: 14.83px;
      opacity: 0;
    }
    &:hover {
      background: url('@/assets/images/meeting/meeting-active-bg.png') 0px 0px / 100% 100% no-repeat;
      height: 261px;
      background-size: 100% 100%;
      color: rgb(255, 255, 255);
      transform: translateY(-10px);
      .btn-icon {
        background: url('@/assets/images/meeting/meeting-active-icon.svg') 0px 0px / cover no-repeat;
      }
      .jump-btn-icon {
        opacity: 1;
      }
    }
  }
  .meeting-archive-box {
    background: url('@/assets/images/meeting/audio-bg.png') 0px 0px / 100% 100% no-repeat;
    .btn-icon {
      background: url('@/assets/images/meeting/audio-icon.svg') 0px 0px / cover no-repeat;
    }
    .jump-btn-icon {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAQAAABezYzpAAAANklEQVR42mNgwAD/Gf6L/hdlwA/Aiq78v0JAIVTZ/yGk8D9hAFJIpDKKXDcYFREd9WCFYuiKAKn5tWLp7X/CAAAAAElFTkSuQmCC)
        0px 0px no-repeat;
      width: 18.41px;
      height: 14.83px;
      opacity: 0;
    }
    &:hover {
      background: url('@/assets/images/meeting/audio-active-bg.png') 0px 0px / 100% 100% no-repeat;
      height: 261px;
      background-size: 100% 100%;
      color: rgb(255, 255, 255);
      transform: translateY(-10px);
      .btn-icon {
        background: url('@/assets/images/meeting/audio-active-icon.svg') 0px 0px / cover no-repeat;
      }
      .jump-btn-icon {
        opacity: 1;
      }
    }
  }
  // .data-box {
  //   border-top: 1px solid rgb(239, 239, 245);
  // }
  // @media (min-width: 1600px) {
  .wrap-box {
    width: 253px;
    height: 240px;
    background-size: 100% 100%;
    border-radius: 8px;
    position: relative;
    .btn-icon {
      width: 117px;
      height: 126px;
      position: absolute;
      left: 16px;
      top: -53px;
    }
  }
  :deep(.n-divider:not(.n-divider--vertical)) {
    // margin-top: 0px;
    // margin-bottom: 0px
  }
  :deep(.n-card__content) {
    padding-bottom: 0px !important;
  }
  .proCard {
    :deep(.n-calendar-cell) {
      padding-bottom: 0;
    }
  }
</style>
