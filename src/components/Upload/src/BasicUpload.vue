<template>
  <div class="w-full">
    <div class="upload">
      <div class="upload-card">
        <n-upload
          v-bind="$props"
          :list-type="$props.listType"
          v-model:file-list="fileList"
          @before-upload="beforeUpload"
          @remove="remove"
          @finish="finish"
        >
          <div class="flex flex-col justify-center mb-2" v-if="fileList.length < maxNumber">
            <template v-if="$props.listType == 'text' || $props.listType == 'image'">
              <n-button dashed>
                <n-icon size="20" class="m-auto">
                  <PlusOutlined />
                </n-icon>
              </n-button>
            </template>
            <template v-else>
              <n-icon size="20" class="m-auto">
                <PlusOutlined />
              </n-icon>
            </template>
          </div>
        </n-upload>
      </div>
    </div>

    <!--上传文件-->
    <n-space>
      <n-alert title="提示" type="info" v-if="helpText" class="flex w-full">
        {{ helpText }}
      </n-alert>
    </n-space>
  </div>
</template>

<script lang="ts">
  import { PlusOutlined } from '@vicons/antd';
  import { basicProps } from './props';
  import { useMessage } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import componentSetting from '@/settings/componentSetting';
  import { useGlobSetting } from '@/hooks/setting';
  import { cssConvert } from '@/hooks/useThemeVars';
  export default defineComponent({
    name: 'BasicUpload',

    components: { PlusOutlined },
    props: {
      ...basicProps,
    },
    emits: ['uploadChange', 'delete'],
    setup(props, { emit }) {
      const getCSSPropertiesWidth = computed(() => {
        return `${props.width}px`;
      });

      const getCSSPropertiesHeight = computed(() => {
        return `${props.height}px`;
      });

      const maxNumber = computed(() => {
        return props.max || props.maxNumber;
      });

      const isShowTrigger = computed(() => {
        return maxNumber.value > state.fileList.length ? 'inline-block' : 'none';
      });

      const cssBorderColor = ref(cssConvert('borderColor', 1));
      const message = useMessage();

      const state = reactive({
        // 弹出层实例
        modalRef: null as any,
        previewUrl: '',
        originalFileList: [] as string[],
        fileList: [] as any[],
      });

      //赋值默认图片显示
      watch(
        () => props.value,
        (val) => {
          if (val) {
            const list = Array.isArray(val) ? val : val.split(',');
            state.originalFileList = list.map((item: string) => {
              return getFileUrl(item);
            });
            state.fileList = list.map((item: string) => {
              const fileUrlArr: string[] = item.split('/');
              return {
                id: fileUrlArr[fileUrlArr.length - 2],
                url: getFileUrl(item),
                name: fileUrlArr[fileUrlArr.length - 1],
                status: 'finished',
              };
            });
          } else {
            state.fileList = [];
            state.originalFileList = [];
          }
        },
        { immediate: true }
      );

      //删除
      function remove(e: any) {
        console.log(e.index);
        state.fileList.splice(e.index, 1);
        state.originalFileList.splice(e.index, 1);
        emit('uploadChange', state.originalFileList);
        emit('delete', state.originalFileList);
      }

      //组装完整文件地址
      function getFileUrl(url: string): string {
        const { fileUrl } = useGlobSetting();
        return /(^http|https:\/\/)/g.test(url) ? url : `${fileUrl}${url}`;
      }

      //上传之前
      function beforeUpload({ file }) {
        const fileInfo = file.file;
        const { maxSize } = props;
        // 设置最大值，则判断
        if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
          message.error(`上传文件最大值不能超过${maxSize}M`);
          return false;
        }
        return true;
      }

      //上传结束
      function finish({ event: Event }) {
        const res = eval('(' + Event.target.response + ')');
        const infoField = componentSetting.upload.apiSetting.infoField;
        const { code } = res;
        const message = res.msg || res.message || '上传失败';
        const result = res[infoField];
        //成功
        if (code === ResultEnum.SUCCESS) {
          state.originalFileList.push(result.downloadUri);
          emit('uploadChange', state.originalFileList);
        } else message.error(message);
      }
      return {
        ...toRefs(state),
        cssBorderColor,
        finish,
        remove,
        beforeUpload,
        getCSSPropertiesWidth,
        getCSSPropertiesHeight,
        isShowTrigger,
        maxNumber,
      };
    },
  });
</script>

<style lang="less" scoped>
  .upload {
    width: 100%;
    overflow: hidden;

    &-card {
      width: auto;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }

  :deep(.n-upload-file-info__thumbnail) {
    line-height: 18px !important;
  }

  :deep(.n-upload-trigger.n-upload-trigger--disabled) {
    display: v-bind(isShowTrigger);
  }

  :deep(.n-upload-trigger + .n-upload-file-list) {
    margin-top: 0px !important;
  }

  :deep(.n-upload-file-list .n-upload-file.n-upload-file--image-card-type) {
    width: v-bind(getCSSPropertiesWidth);
    height: v-bind(getCSSPropertiesHeight);
  }

  :deep(.n-upload-trigger.n-upload-trigger--image-card) {
    width: v-bind(getCSSPropertiesWidth);
    height: v-bind(getCSSPropertiesHeight);
  }
  :deep(.n-upload-file-list.n-upload-file-list--grid) {
    grid-template-columns: repeat(auto-fill, v-bind(getCSSPropertiesWidth));
  }
  :deep(.n-image) {
    img[data-error='true'] {
      height: 0;
    }
    img[data-error='true']::before {
      opacity: 1 !important;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: v-bind(getCSSPropertiesWidth);
      height: v-bind(getCSSPropertiesHeight);
      background-image: url('@/assets/images/fallImg.png');
      background-position: center center; /* 水平垂直居中 */
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
</style>
