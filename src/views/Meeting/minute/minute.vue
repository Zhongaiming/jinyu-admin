<template>
  <div class="MettingMinute">
    <n-card class="proCard">
      <template #header>
        <template v-if="!isEditTitle">
          {{ recorderData.meetingName }}
          <n-icon size="18" @click="() => (isEditTitle = !isEditTitle)">
            <Edit />
          </n-icon>
        </template>
        <div v-else class="w-1/5 flex items-center">
          <n-input
            v-model:value="recorderData.meetingName"
            size="small"
            type="text"
            :placeholder="$t('qingShuRuHuiYiBiaoTi')"
          />
          <n-icon size="18" @click="() => (isEditTitle = !isEditTitle)">
            <EditOff />
          </n-icon>
        </div>
      </template>
      <n-grid cols="400:1 600:2">
        <!-- 左侧区域 -->
        <n-gi>
          <div class="h-full">
            <!-- 会议信息 -->
            <div class="flex w-full mb-2">
              <div class="w-1/2 p-2">
                <div class="w-full">
                  {{ $t('canHuiRenYuan') }}：
                  <div class="flex flex-wrap relative items-center top-[-0.55rem] left-[-0.75rem]">
                    <n-tag
                      closable
                      v-for="item in recorderData.personList"
                      @close="usersClose(item)"
                      :key="item.value"
                      class="ml-3 mt-3"
                      type="primary"
                    >
                      {{ item.label }}
                    </n-tag>
                    <n-button
                      @click="openUsersSelectModal"
                      size="small"
                      dashed
                      class="ml-3 mt-3"
                      type="primary"
                    >
                      <template #icon>
                        <n-icon>
                          <PlusOutlined />
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                  <SelectModal
                    ref="selectUsersModalRef"
                    :title="$t('xuanZeYongHu')"
                    type="MeetingMan"
                    width="800px"
                    @on-ok="selectUsersModalOk"
                  />
                </div>
                <div class="w-full">
                  {{ $t('jiLuYuan') }}：
                  <div class="flex flex-wrap relative items-center top-[-0.5rem] left-[-0.75rem]">
                    <n-tag closable @close="userClose" class="ml-3 mt-3" type="primary">
                      {{ recorderData.recorder.label }}
                    </n-tag>
                    <n-button
                      @click="openUserSelectModal"
                      size="small"
                      dashed
                      class="ml-3 mt-3"
                      type="primary"
                    >
                      <template #icon>
                        <n-icon>
                          <PlusOutlined />
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                  <SelectModal
                    ref="selectUserModalRef"
                    :title="$t('xuanZeYongHu')"
                    type="Man"
                    width="800px"
                    :isMultiple="false"
                    @on-ok="selectUserModalOk"
                  />
                </div>
              </div>
              <div class="w-1/2 p-2">
                {{ $t('dangQianShiJian') }}：
                <div class="flex h-20 justify-center items-center text-lg">
                  {{ computedTime }}
                </div>
              </div>
            </div>
            <!-- 转写内容 -->
            <div
              class="overflow-y-auto"
              style="
                height: calc(100vh - 708px);
                max-height: calc(100vh - 708px);
                min-height: 300px;
              "
            >
              <div v-for="item in recorderData.originalText" :key="item.partIndex" class="mb-2">
                <template v-if="item.isEdit">
                  <div class="w-4/5 inline-block">
                    <n-icon size="18" @click="() => (item.isEdit = !item.isEdit)">
                      <Edit />
                    </n-icon>
                    <n-input v-model:value="item.speakerId" class="m-1" />
                    <n-input
                      v-model:value="item.text"
                      type="textarea"
                      :placeholder="$t('qingShuRuNeiRong')"
                      round
                      class="m-1"
                    />
                  </div>
                </template>
                <div class="text-lg" v-else>
                  <n-icon size="18" @click="() => (item.isEdit = !item.isEdit)">
                    <Edit />
                  </n-icon>
                  {{ `${item.speakerId} : ` }}
                </div>
                <div class="text-sm p-2">
                  {{ item.text }}
                </div>
              </div>
              <template v-if="recorderData.originalText.length <= 0">
                <div class="flex items-center justify-center h-full text-gray-500 text-lg">
                  {{ $t('zanWuShuoHuaRenShuJu') }}
                </div>
              </template>
            </div>
            <!-- 实时转写内容 -->
            <div class="mb-2">{{ $t('shiShiZhuanLu') }}：</div>
            <div class="border p-4 text-gray-500 h-40">{{ tempOriginalText }}</div>
            <!--按钮容器  -->
            <div class="btn-box flex justify-center m-2 flex-wrap">
              <n-button
                strong
                secondary
                class="m-2"
                @click="downloadFiles('recorder')"
                :disabled="!recorderData.tapeFile"
              >
                {{ $t('xiaZaiLuYin') }}
              </n-button>
              <n-button strong secondary type="primary" class="m-2" @click="generateSummary">
                {{ $t('shengChengJiYao') }}
              </n-button>
              <n-button strong secondary class="m-2" @click="SyncSummary">{{
                $t('tongBuJiYaoWenJian')
              }}</n-button>
              <n-button
                strong
                secondary
                type="tertiary"
                class="m-2"
                @click="downloadFiles('docx')"
                :disabled="!recorderData.summaryFile"
              >
                {{ $t('xiaZaiWenDang') }}
              </n-button>
              <n-button
                strong
                secondary
                type="warning"
                class="m-2"
                @click="downloadFiles('pdf')"
                :disabled="!recorderData.pdfFile"
              >
                {{ $t('jiYaoXiaZaiDaoChuPdf') }}
              </n-button>
            </div>
            <!--  -->
            <div class="flex justify-center mt-2 relative flex-wrap">
              <div class="p-2" v-if="Mic.length > 0">
                <template v-if="isCreateMinute">
                  <n-icon size="32" @click="startRecording">
                    <MicrophoneFilled />
                  </n-icon>
                </template>
                <!-- 播放器 -->
              </div>
              <n-button class="sm:absolute right-0" type="warning" @click="saveMeeting">
                {{ isCreateMinute ? $t('jieShu') : $t('gengXin') }}{{ $t('bingBaoCun') }}
              </n-button>
            </div>
            <template v-if="!isCreateMinute">
              <audio-player
                :audio-list="[fileUrl + recorderData.tapeFile]"
                :theme-color="cssPrimaryColor"
                :show-prev-button="false"
                :show-next-button="false"
                class="w-full"
                :isLoop="false"
              />
            </template>
            <canvas ref="canvasRef" class="w-full h-10 px-4" v-if="isCreateMinute"></canvas>
          </div>
        </n-gi>
        <!-- 右侧区域 纪要-->
        <n-gi class="h-full">
          <div class="p-2">
            <div>{{ $t('maiKeFeng') }}：</div>
            <n-radio-group v-model:value="deviceId" name="radiogroup" v-if="Mic.length > 0">
              <n-space>
                <n-radio
                  v-for="device in Mic"
                  :key="device.deviceId"
                  :value="device.deviceId"
                  :on-update:value="onDeviceChange"
                >
                  {{ device.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
            <div v-else class="text-center">
              <n-tag type="error"> {{ $t('wu') }} </n-tag>
            </div>
          </div>
          <div class="p-2 min-h-[300px]" style="height: calc(100% - 100px)">
            <tinymce-editor
              class="f-full"
              :config="{ inline: false }"
              ref="content"
              v-model:value="recorderData.summary"
              v-model:defaultValue="tinymceHTML"
            />
          </div>
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { storage } from '@/utils/Storage';
  import Recorder from '@/utils/lib/recorder';
  // import Recorder from 'recorder-core';
  // import { TinymceEditor } from '@/components/TinymceEditor';
  import AudioPlayer from '@liripeng/vue-audio-player';
  import { useWebSocket, useNow, useDateFormat, useTimestamp } from '@vueuse/core';
  import { useMessage } from 'naive-ui';
  import { downloadByUrl } from '@/utils/downloadFile';
  import { MicrophoneFilled, Edit, EditOff } from '@vicons/carbon';
  import { PlusOutlined } from '@vicons/antd';
  import { cssConvert } from '@/hooks/useThemeVars';
  import {
    addMeeting,
    createSummary,
    saveSummaryFile,
    getMeetingDataById,
    getTapFileByName,
    updateMeeting,
    sendMeetingUsers,
  } from '@/api/Meeting/meeting/meeting';
  import { useGlobSetting } from '@/hooks/setting';
  import { useUserStore } from '@/store/modules/user';
  import { SelectModal } from '@/components/SelectModal';
  import { isArray } from '@/utils/is';
  import { cloneDeep } from 'lodash-es';
  import { DataViewToUint8Array } from './utils';
  import I18n from '@/lang/index'; //引入i18n组件
  const cssPrimaryColor = ref(cssConvert('primaryColor', 1));
  const useStore = useUserStore();
  // ws连接地址和图片前缀
  const { fileUrl, wsUrl } = useGlobSetting();
  const route = useRoute();
  const { title, meetingId } = route.query;
  const tinymceHTML = ref('');
  // 实时时间
  const time = useTimestamp();
  // 转换格式，用来显示
  const computedTime = useDateFormat(time, 'YYYY-MM-DD HH:mm:ss');
  // message组件
  const message = useMessage();

  const router = useRouter();
  // 录音器实例
  let recorder,
    // 定时器
    timer,
    // 发送socket
    socketSend,
    //关闭socket
    socketClose;
  // 是否是创建会议
  const isCreateMinute = ref(!meetingId);
  // 是否第一次录音
  const isRecorder = ref(true);
  // 选人组件ref
  const selectUsersModalRef = ref(),
    selectUserModalRef = ref();
  const hasMediaDevices = ref(false);
  const Mic = reactive<MediaDeviceInfo[]>([]);
  const deviceId = ref('');
  // 默认显示文字
  const tempOriginalText = ref(I18n.global.t('dianJiMaiKeFengKaiShiHuiYi'));
  // 是否在编辑标题
  const isEditTitle = ref(false);
  // 绘制事件的id
  const drawRecordId = ref();
  // canvas的ref
  const canvasRef = ref();
  let canvasCtx;
  //会议数据
  let recorderData = reactive<Recordable>({
    meetingName: title ?? I18n.global.t('huiYiBiaoTi'),
    // 转录后的文字
    originalText: [],
    // 纪要文字
    summary: '',
    meetingStartTime: useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value,
    // meetingEndTime: '',
    personList: [],
    // 记录员id 默认当前用户
    recorder: {
      label: useStore.info.showName,
      value: useStore.info.userId,
    },
    // 当前会议录音的名字
    meetingRecorderName: 'null',
  });
  let reconnectSum = 0;
  const initWebSocket = () => {
    const { send, close } = useWebSocket(
      `${wsUrl}/${recorderData.meetingName}/${recorderData.meetingRecorderName}`,
      {
        autoClose: false,
        onMessage: (_ws, event) => {
          if (event.data) {
            try {
              let res = JSON.parse(event.data);
              res.map((item) => {
                if (item.type === 'integral') {
                  tempOriginalText.value += item.text;
                } else if (item.type === 'distinguish') {
                  if (
                    recorderData.originalText.length > 0 &&
                    item.speaker_id === recorderData.originalText.at(-1)?.speakerId
                  ) {
                    recorderData.originalText[recorderData.originalText.length - 1].text +=
                      item.text;
                  } else {
                    recorderData.originalText.push({
                      text: item.text,
                      speakerId: item.speaker_id,
                      isEdit: false,
                    });
                  }
                } else if (item.type === 'fileName') {
                  recorderData.meetingRecorderName = item.text;
                  sendMeetingUserList();
                }
              });
              const div = document.getElementsByClassName('overflow-y-auto')[0];
              div.scrollTop = div.scrollHeight;
            } catch (err) {
              console.log('数据转换失败', event.data);
              console.error(err);
            }
          }
        },
        onError(_ws, event) {
          console.error('onError   event', event);
          initWebSocket();
        },
        onConnected() {
          console.log('websocket connected');
        },
        onDisconnected(_ws, event) {
          console.warn('onDisconnected  event', event);
          if (event.code !== 1000) {
            console.warn('不正常断开');
            reconnectSum++;
            if (reconnectSum <= 10) {
              initWebSocket();
            }
          }
        },
      }
    );
    socketSend = send;
    socketClose = close;
  };

  // 是否暂停录音
  let isPause = false;
  /**
   * 点击录音
   */
  const startRecording = () => {
    if (!isRecorder.value) {
      if (isPause) {
        recorder && recorder.resume();
        isPause = false;
      } else {
        recorder && recorder.pause();
        isPause = true;
      }
      return;
    } else {
      recorder && recorder.start();
    }
    // 清空原始文本
    tempOriginalText.value = '';

    // 初始化socket连接
    initWebSocket();

    isRecorder.value = false;
    //启动浏览器麦克风，开始录制
    handleStartRecorder();
  };
  /**
   * 初始化录音器
   */
  const initRecorder = () => {
    recorder = new Recorder({
      sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1, // 声道，支持 1 或 2， 默认是1
      compiling: true, //(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
  };
  //启动录音实例
  const handleStartRecorder = async () => {
    await initRecorder();
    // 获取录音权限
    Recorder.getPermission().then(
      async () => {
        await recorder.start(); // 开始录音
        drawRecord();
      },
      (error) => {
        message.error('麦克风调用失败');
        console.error(error);
      }
    );
    // 记录定时器
    timer = intervalFn(sendRecorderText);
  };

  const intervalFn = (fn, ms = 1000) => setInterval(fn, ms);

  // 获取麦克风列表
  if (navigator.mediaDevices) {
    // 弹框获取麦克风
    // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    try {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (device) {
          if (device.kind === 'audioinput') {
            // 麦克风
            if (device.deviceId !== 'default' && device.deviceId !== 'communications') {
              Mic.push(device);
              deviceId.value = Mic[0].deviceId;
            }
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
    //   // 只是为了获取麦克风权限，获取以后立马关闭
    //   stream.getTracks().forEach((track) => track.stop());
    // });
  } else {
    hasMediaDevices.value = false;
  }
  /**
   * 点击加号，打开modal
   */
  const openUserSelectModal = () => {
    selectUserModalRef.value.openModal();
  };
  /**
   * 点击加号，打开modal
   */
  const openUsersSelectModal = () => {
    selectUsersModalRef.value.openModal();
  };

  /**
   * 点击确定
   */
  const selectUserModalOk = (data) => {
    if (isArray(data)) {
      recorderData.recorder = data[0];
    }
  };
  /**
   * 点击确定
   */
  const selectUsersModalOk = (data) => {
    recorderData.personList = data;
  };
  /**
   * 点击删除当前元素
   */
  const userClose = () => {
    recorderData.recorder = '';
  };
  /**
   * 点击删除当前元素
   */
  const usersClose = (item) => {
    recorderData.personList = recorderData.personList.filter((user) => user !== item);
  };
  /**
   * 绘制路由波形图
   */
  const drawRecord = () => {
    drawRecordId.value = requestAnimationFrame(drawRecord);
    // 实时获取音频大小数据
    let dataArray = recorder.getRecordAnalyseData(),
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
  /**
   * 当前页面下载文件方法
   */
  const downloadFiles = (type: string) => {
    let url = fileUrl ?? '';
    let suffix = '.wav';
    switch (type) {
      case 'recorder':
        url += recorderData.tapeFile;
        break;
      case 'docx':
        url += recorderData.pdfFile;
        suffix = '.docx';
        break;
      case 'pdf':
        url += recorderData.summaryFile;
        suffix = '.pdf';
        break;
    }
    downloadByUrl({ url, target: '_self', fileName: recorderData.meetingName + suffix });
  };
  /**
   * 生成纪要的方法
   */
  const generateSummary = () => {
    let message = recorderData.originalText.reduce(
      (prev, next) => `${prev}${next.speakerId}:${next.text}`,
      ''
    );
    createSummary({ message }).then((res) => {
      recorderData.summary = res;
      tinymceHTML.value = res;
    });
  };
  /**
   * 同步纪要
   */
  const SyncSummary = () => {
    const summary = recorderData.summary;
    saveSummaryFile({ summary }).then((res) => {
      recorderData.summaryFile = res.docx;
      recorderData.pdfFile = res.pdf;
    });
  };

  /**
   * 退出并保存
   *
   */
  const saveMeeting = async () => {
    let meetingDto = cloneDeep(toRaw(recorderData));
    const meetingRecorderName = recorderData.meetingRecorderName;
    delete meetingDto.meetingRecorderName;
    meetingDto.personList = JSON.stringify(meetingDto.personList);
    meetingDto.recorder = JSON.stringify(meetingDto.recorder);
    if (isCreateMinute.value) {
      meetingDto.meetingEndTime = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value;
      if (recorder || meetingRecorderName !== 'null') {
        let res = await getTapFileByName({ meetingFileName: meetingRecorderName });
        meetingDto.tapeFile = res;
        try {
          await addMeeting({ meetingDto });
          router.back();
          storage.remove('recorderData');
        } catch (err) {
          console.error(err);
        }
      } else {
        console.warn('没有录音实例');
        message.warning('请先录音再保存');
      }
    } else {
      try {
        await updateMeeting({ meetingDto });
        router.back();
      } catch (err) {
        console.error(err);
      }
    }
  };
  // 录音设备改变
  const onDeviceChange = () => {
    initRecorder();
  };

  /**
   * 获取录音数据，并发送
   */
  const sendRecorderText = () => {
    if (recorder) {
      const pcmDataView = recorder.getNextData();
      // 将DataView数组转换为Uint8Array
      const byteArray = DataViewToUint8Array(pcmDataView);
      socketSend(byteArray);
    } else {
      console.warn('没有录音实例');
    }
  };
  const getMeetingData = () => {
    getMeetingDataById({ meetingId }).then((res) => {
      recorderData = Object.assign(recorderData, cloneDeep(res));
      recorderData.personList = recorderData.personList && JSON.parse(recorderData.personList);
      recorderData.recorder = recorderData.recorder && JSON.parse(recorderData.recorder);
      tinymceHTML.value = recorderData.summary;
    });
  };
  const sendMeetingUserList = () => {
    if (recorderData.meetingRecorderName !== 'null' && recorderData.personList.length > 0) {
      sendMeetingUsers({
        meetingUserIds: recorderData.personList.map((item) => item.value).join(','),
        fileName: recorderData.meetingRecorderName,
      })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
  };
  // 截取实时转录文字的长度
  watch(tempOriginalText, (newValue) => {
    if (newValue.length > 150) {
      tempOriginalText.value = newValue.slice(-150);
    }
  });
  // 参会人员改变时，发送数据
  watch(
    () => recorderData.personList,
    (_newValue) => {
      sendMeetingUserList();
    },
    {
      deep: true,
    }
  );

  //
  onMounted(() => {
    // 在页面关闭或刷新之前，保存数据
    window.addEventListener('beforeunload', () => {
      const meetingName = recorderData.meetingName;
      const obj = {};
      obj[meetingName] = { ...toRaw(recorderData) };
      storage.set('recorderData', JSON.stringify(obj));
    });
    if (!isCreateMinute.value) {
      getMeetingData();
    } else {
      try {
        let recorderDataObj = JSON.parse(storage.get('recorderData'));
        recorderDataObj &&
          recorderDataObj[recorderData.meetingName] &&
          (recorderData = recorderDataObj[recorderData.meetingName]);
      } catch (err) {
        console.error('获取会议缓存数据出错了', err);
      }
      canvasCtx = canvasRef.value.getContext('2d');
    }
  });

  onUnmounted(() => {
    try {
      // 停止录音并销毁实例
      recorder && recorder.stop() & recorder.destroy();
    } catch (err) {
      console.error(err);
    }
    // 取消绘制
    drawRecordId.value && cancelAnimationFrame(drawRecordId.value);
    // 关闭socket连接
    socketClose && socketClose();
    // workerTerminate('PENDING');
    // 关闭定时器
    timer && clearInterval(timer);
    window.removeEventListener('beforeunload', () => {
      console.log('清除事件监听');
    });
  });
</script>

<style lang="less" scoped>
  .MettingMinute {
    :deep(.audio__play-rate__dropdown) {
      word-break: normal;
    }
    :deep(.n-card__content) {
      // padding-bottom: 0px
    }
  }
</style>
