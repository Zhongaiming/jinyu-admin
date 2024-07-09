<template>
  <div class="flex justify-center align-center" :style="getCSSProperties">
    <n-image
      :width="data.width"
      :height="data.height"
      :src="data.src ? (srcfull ? data.src : fileUrl + data.src) : data.nosrc"
      :fallback-src="data.fallsrc"
      :on-error="imgError"
      :style="{
        maxHeight: data.height + 'px',
        BorderRadius: data.round && data.src && !isError ? '50%' : '',
      }"
      v-bind="data.other"
      :preview-disabled="data.other?.previewDisabled || !data.src || isError"
    >
      <template #placeholder>
        <div class="loading-box" :style="getCSSProperties">
          <div class="loading-wrap" :style="{ '--primary-color': cssPrimaryColor }">
            <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
          </div>
        </div>
      </template>
    </n-image>
  </div>
</template>

<script lang="ts">
  import { basicProps } from './props';
  import { useGlobSetting } from '@/hooks/setting';
  import { cssConvert } from '@/hooks/useThemeVars';
  export default defineComponent({
    name: 'BasicImage',
    props: {
      ...basicProps,
    },
    setup(props) {
      const data = ref(props);
      const cssPrimaryColor = ref(cssConvert('primaryColor', 1));
      const getCSSProperties = computed(() => {
        return {
          width: `${props.width}px`,
          height: `${props.height}px`,
        };
      });
      const objectFit = computed(() => {
        return !data.value.src || isError.value ? 'contain' : 'fill';
      });
      const isError = ref(false);
      const { fileUrl } = useGlobSetting();
      function imgError() {
        isError.value = true;
      }
      return {
        data,
        cssPrimaryColor,
        getCSSProperties,
        fileUrl,
        isError,
        imgError,
        objectFit,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.n-image img) {
    object-fit: v-bind(objectFit) !important;
  }

  .loading-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading-wrap {
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dot {
    animation: antRotate 1.2s infinite linear;
    transform: rotate(45deg);
    position: relative;
    display: inline-block;
    font-size: 32px;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
  }

  .dot i {
    width: 14px;
    height: 14px;
    position: absolute;
    display: block;
    background-color: var(--primary-color);
    border-radius: 100%;
    transform: scale(0.75);
    transform-origin: 50% 50%;
    opacity: 0.3;
    animation: antSpinMove 1s infinite linear alternate;
  }

  .dot i:nth-child(1) {
    top: 0;
    left: 0;
  }

  .dot i:nth-child(2) {
    top: 0;
    right: 0;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .dot i:nth-child(3) {
    right: 0;
    bottom: 0;
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }

  .dot i:nth-child(4) {
    bottom: 0;
    left: 0;
    -webkit-animation-delay: 1.2s;
    animation-delay: 1.2s;
  }

  @keyframes antRotate {
    to {
      -webkit-transform: rotate(405deg);
      transform: rotate(405deg);
    }
  }

  @-webkit-keyframes antRotate {
    to {
      -webkit-transform: rotate(405deg);
      transform: rotate(405deg);
    }
  }

  @keyframes antSpinMove {
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes antSpinMove {
    to {
      opacity: 1;
    }
  }
</style>
