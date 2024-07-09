<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onUserTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadUserTable"
      :row-key="(row) => row.meetingUserId"
      ref="userTableRef"
      :actionColumn="actionColumn"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="handleAddUser">
          {{ $t('xinJianYongHu') }}
        </n-button>
      </template>
    </BasicTable>
    <BasicModal @register="modalRegister" ref="addEditUserModalRef">
      <template #default>
        <BasicForm @register="userRegister" @submit="handleOk">
          <template #voiceprintSlot="{ model, field }">
            <div>
              <div class="flex items-center user-upload-audio">
                <template v-if="model[field]">
                  <audio-player
                    :audio-list="[fileUrl + model[field]]"
                    :theme-color="cssPrimaryColor"
                    :showPrevButton="false"
                    :showNextButton="false"
                    :showVolumeButton="false"
                    :showProgressBar="false"
                    :showPlaybackRate="false"
                    :showPlayLoading="false"
                    class="w-full"
                    :isLoop="false"
                  />
                  <n-icon size="18" @click="model[field] = ''">
                    <Delete />
                  </n-icon>
                </template>
                <div v-else>
                  <n-tag :bordered="false" type="warning"> {{ $t('zanWu') }} </n-tag>
                </div>
              </div>
              <div class="flex mt-4">
                <template v-if="recorder">
                  <!-- 录音提示语 -->
                  <div>
                    <n-h4>{{ $t('qingLangDuYiXiaNeiRong') }}：</n-h4>
                    <n-p>
                      {{
                        $t(
                          'zunJingDeGeWeiLingDaoTongShiMenDaJiaHaoJinTianWoXiangHeDaJiaFenXiangYiXiaWoDuiWeiLaiRenGongZhiNengFaZhanDeKanFaRenGongZhiNengShiDangJinShiJieFaZhanZuiKuaiDeJiShuZhiYiTaZhengZaiShenKeDiGaiBianZhuoWoMenDeShengHuoFangShi'
                        )
                      }}
                    </n-p>
                    <n-p>
                      {{
                        $t(
                          'zaiWeiLaiRenGongZhiNengJiangBanYanGengJiaZhongYaoDeJiaoSeTaJiangBangZhuWoMenJieJueXuDuoZhongDaNanTiLiRuQiHouBianHuaJiBingHePinKunDangRanRenGongZhiNengDeFaZhanYeMianLinZhuoYiXieTiaoZhanLiRuLunLiWenTiHeAnQuanWenTiWoMenXuYaoJinShenDiYanJiuHeKaiFaRenGongZhiNengJiShuQueBaoTaNengGouZaoFuRenLei'
                        )
                      }}
                    </n-p>
                    <n-p>
                      {{
                        $t(
                          'woXiangXinRenGongZhiNengDeWeiLaiShiGuangMingDeRangWoMenXieShouHeZuoGongTongChuangZaoYiGeRenGongZhiNengDeMeiHaoWeiLaiXieXieDaJia'
                        )
                      }}
                    </n-p>
                    <n-icon size="32" @click="stopAndUpload">
                      <StopFilledAlt />
                    </n-icon>
                  </div>
                </template>
                <template v-else>
                  <!-- 上传 -->
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
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <n-icon size="32">
                          <CloudUpload />
                        </n-icon>
                      </template>
                      {{ $t('dianJiShangChuanZiJiDeLuYinWenJianXuYaoWavGeShiDe') }}
                    </n-tooltip>
                  </n-upload>
                  <!-- 录音 -->
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-icon size="32" @click="startRecording">
                        <MicrophoneFilled />
                      </n-icon>
                    </template>
                    {{ $t('dianJiKaiShiLuRuShengYin') }}
                  </n-tooltip>
                </template>
              </div>
              <!-- 声波图 -->
              <canvas ref="canvasRef" class="w-full h-10 px-4" v-if="recorder"></canvas>
            </div>
          </template>
        </BasicForm>
      </template>
    </BasicModal>
  </n-card>
</template>
<script setup lang="ts">
  import { MicrophoneFilled, StopFilledAlt, CloudUpload, Delete } from '@vicons/carbon';
  import { useModal } from '@/components/Modal';
  import {
    getMeetingUserList,
    deleteMeetingUserById,
    addMeetingUser,
    updateMeetingUser,
  } from '@/api/Meeting/user/user';
  import { saveWavFile } from '@/api/Meeting/meeting/meeting';
  import type { FormSchema } from '@/components/Form';
  import { useForm } from '@/components/Form';
  import { TableAction } from '@/components/Table';
  import { getDictLabel, dictTagView } from '@/utils/dict';
  import { useGlobSetting } from '@/hooks/setting';
  import AudioPlayer from '@liripeng/vue-audio-player';
  import { useMessage, useDialog, UploadFileInfo } from 'naive-ui';
  import { getCurrentPage } from '@/utils';
  import Recorder from 'js-audio-recorder';
  import { cssConvert } from '@/hooks/useThemeVars';
  import I18n from '@/lang/index'; //引入i18n组件
  const message = useMessage();
  const dialog = useDialog();
  const cssPrimaryColor = ref(cssConvert('primaryColor', 1));
  const { fileUrl, uploadUrl } = useGlobSetting();
  // 初始化ref
  const userTableRef = ref();
  const addEditUserModalRef = ref();
  const isEditUser = ref(false);
  let meetingUserId = '',
    userModalTitle = I18n.global.t('tianJiaYongHu');
  const recorder = ref();
  // 绘制事件的id
  const drawRecordId = ref();
  // canvas的ref
  const canvasRef = ref();
  let canvasCtx;
  // 设置name
  defineOptions({ name: 'MeetingUserManage' });
  // 是否 字典
  const is_dict = [
    {
      value: 'true',
      label: I18n.global.t('shi'),
    },
    {
      value: 'false',
      label: I18n.global.t('fou'),
    },
  ];

  // 表格字段
  const columns = [
    {
      title: I18n.global.t('yongHuMing'),
      key: 'meetingUserName',
      align: 'center',
      render(row) {
        return dictTagView(row.meetingUserName);
      },
    },
    {
      title: I18n.global.t('shiFouYiShangChuanShengWen'),
      key: 'isUploadVoiceprint',
      align: 'center',

      render(row) {
        return dictTagView(getDictLabel(is_dict, row.isUploadVoiceprint));
      },
    },
    {
      title: I18n.global.t('shengWenWenJian'),
      key: 'voiceprint',
      align: 'center',

      render(row) {
        if (!row.voiceprint) return dictTagView(I18n.global.t('wu'));
        return h(AudioPlayer, {
          audioList: [fileUrl + row.voiceprint],
          themeColor: cssPrimaryColor.value,
          showPrevButton: false,
          showNextButton: false,
          showVolumeButton: false,
          showProgressBar: false,
          showPlaybackRate: false,
          showPlayLoading: false,
        });
      },
    },
  ];
  const handleOk = () => {
    userValidate()
      .then(async () => {
        const user = getUserValue();
        if (isEditUser.value) {
          let meetingUserDto = {
            ...user,
            meetingUserId: meetingUserId,
          };
          await updateMeetingUser({ meetingUserDto });
          message.success(I18n.global.t('xiuGaiChengGong'));
        } else {
          await addMeetingUser({ meetingUserDto: user });
          message.success(I18n.global.t('tianJiaChengGong'));
        }
        resetUserFields();
        closeModal();
        userTableRef.value.reload();
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setSubLoading(false);
      });
  };
  const [modalRegister, { openModal, setProps: setModalProps, setSubLoading, closeModal }] =
    useModal({
      title: userModalTitle,
      // showDefaultAction: true,
    });
  // 点击提交
  const onUserTableSearch = () => {
    // 搜索重置页码
    userTableRef.value.updatePage(1);
  };

  // 表格操作
  const actionColumn = reactive({
    width: 120,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('bianJi'),
            type: 'info',
            text: true,
            onClick: handleEditUser.bind(null, record),
          },
          {
            label: I18n.global.t('shanChu'),
            type: 'error',
            text: true,
            onClick: handleDeleteUser.bind(null, record),
          },
        ],
      });
    },
  });
  const handleDeleteUser = (user) => {
    dialog.info({
      title: I18n.global.t('shanChuYongHu'),
      content: I18n.global.t('queDingShanChuGaiYongHu'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteMeetingUserById({ meetingUserId: user.meetingUserId }).then(() => {
          message.success(I18n.global.t('shanChuChengGong'));
          getCurrentPage(userTableRef, 1);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  };
  // 编辑用户
  const handleEditUser = (user) => {
    isEditUser.value = true;
    meetingUserId = user.meetingUserId;
    userModalTitle = I18n.global.t('bianJiYongHu');
    setModalProps({ title: userModalTitle });
    openModal();
    nextTick(() => {
      setUserValue(toRaw(user));
    });
  };
  const handleAddUser = () => {
    isEditUser.value = false;
    userModalTitle = I18n.global.t('xinZengYongHu');
    setModalProps({ title: userModalTitle });
    openModal();
  };
  // 加载表格数据
  const loadUserTable = async (page) => {
    return await getMeetingUserList({
      meetingUserDtoFilter: { ...getSearchsValue() },
      pageParam: { ...page },
    });
  };
  // 搜索框字段
  const searchSchema: FormSchema[] = [
    {
      field: 'meetingUserName',
      label: I18n.global.t('yongHuMing'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYongHuMing'),
      },
    },
  ];
  // 注册搜索表单
  const [searchRegister, { getFieldsValue: getSearchsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 60 : 80,
    submitOnReset: true,
    schemas: searchSchema,
    submitClassName: 'primary-button',
  });
  // 用户表单字段
  const userSchema: FormSchema[] = [
    {
      field: 'meetingUserName',
      label: I18n.global.t('yongHuMing'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYongHuMing'),
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('yongHuMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'voiceprint',
      label: I18n.global.t('shengWen'),
      labelMessage: I18n.global.t('xuYao_30MiaoZuoYou'),
      isShow: true,
      slot: 'voiceprintSlot',
    },
  ];
  const [
    userRegister,
    {
      getFieldsValue: getUserValue,
      setFieldsValue: setUserValue,
      validate: userValidate,
      resetFields: resetUserFields,
    },
  ] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 100,
    submitOnReset: true,
    layout: 'horizontal',
    schemas: userSchema,
    submitClassName: 'primary-button',
    submitButtonText: I18n.global.t('queRen'),
    resetButtonText: I18n.global.t('quXiao'),
    resetFunc: () => {
      return new Promise(() => {
        addEditUserModalRef.value.closeModal();
      });
    },
    // showSubmitButton: false,
    // showResetButton: false,
  });
  // 上传结束后回显
  const handleUploadFinish = ({ event }: { event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response);
    setUserValue({ voiceprint: res.data.downloadUri });
  };
  /**
   * 上传前验证
   */
  const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    console.log('beforeUpload  getUserValue()', getUserValue());
    console.log(getUserValue()['meetingUserName']);
    if (data.file.file?.type !== 'audio/wav' && data.file.file?.type !== 'audio/pcm') {
      message.error(
        I18n.global.t('zhiNengShangChuanWavHuoPcmGeShiDeYinPinWenJianQingZhongXinShangChuan')
      );
      return false;
    }
    return true;
  };
  /**
   * 点击录音
   */
  const startRecording = () => {
    recorder.value = new Recorder({
      sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1, // 声道，支持 1 或 2， 默认是1
      compiling: true, //(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
    // 获取录音权限
    Recorder.getPermission().then(
      async () => {
        await recorder.value.start(); // 开始录音
        nextTick(() => {
          canvasCtx = canvasRef.value.getContext('2d');
          drawRecord();
        });
      },
      (error) => {
        recorder.value = null;
        message.error(I18n.global.t('maiKeFengTiaoYongShiBai'));
        console.error(error);
      }
    );
  };
  /**
   * 绘制路由波形图
   */
  const drawRecord = () => {
    drawRecordId.value = requestAnimationFrame(drawRecord);
    // 实时获取音频大小数据
    let dataArray = recorder.value.getRecordAnalyseData(),
      bufferLength = dataArray.length;

    // 填充背景色
    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

    // 设定波形绘制颜色
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    var sliceWidth = (canvasRef.value.width * 1.0) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
      x = 0; // 绘制点的x轴位置

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * canvasRef.value.height) / 2;

      if (i === 0) {
        // 第一个点
        canvasCtx.moveTo(x, y);
      } else {
        // 剩余的点
        canvasCtx.lineTo(x, y);
      }
      // 依次平移，绘制所有点
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvasRef.value.width, canvasRef.value.height / 2);
    canvasCtx.stroke();
  };
  const stopAndUpload = async () => {
    if (recorder.value) {
      try {
        const wavBlob = recorder.value.getWAVBlob();
        const blob = new Blob([wavBlob], { type: 'audio/wav' });
        const fileRes = await saveWavFile({ file: blob });
        console.log('上传成功');
        recorder.value.stop();
        recorder.value.destroy();
        // 没有错误再赋值
        setUserValue({ voiceprint: fileRes.data.data.downloadUri });
      } catch (err) {
        console.error(err);
      }
      recorder.value = null;
      // 取消绘制
      drawRecordId.value && cancelAnimationFrame(drawRecordId.value);
    } else {
      console.warn('没有录音实例');
    }
  };
</script>
<style lang="less" scoped>
  @import '@/styles/base.less';
  .user-upload-audio {
    :deep(.audio__play-start) {
      margin-left: 0px !important;
    }
  }
</style>
