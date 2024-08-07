<template>
  <div class="container">
    <div class="number">{{ battery.level }}%</div>
    <div class="contrast">
      <div class="circle"></div>
      <ul class="bubbles">
        <li v-for="i in 15" :key="i"></li>
      </ul>
    </div>
    <div class="charging">
      <div>{{ batteryStatus }}</div>
      <div v-show="Number.isFinite(battery.dischargingTime) && battery.dischargingTime != 0">
        {{ $t('shengYuKeShiYongShiJian') }}： {{ calcDischargingTime }}
      </div>
      <span v-show="Number.isFinite(battery.chargingTime) && battery.chargingTime != 0">
        {{ $t('juLiDianChiChongManXuYao') }}：{{ calcChargingTime }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import I18n from '@/lang/index'; //引入i18n组件
  export default defineComponent({
    name: 'HuaweiCharge',
    // props: ['batteryStatus', 'battery', 'calcDischargingTime'],
    props: {
      battery: {
        // 电池对象
        type: Object,
        default: () => ({}),
      },
      calcDischargingTime: {
        // 电池剩余时间可用时间
        type: String,
        default: '',
      },
      calcChargingTime: {
        type: String,
        default: '',
      },
      batteryStatus: {
        // 电池状态
        type: String,
        validator: (val: string) =>
          [
            I18n.global.t('chongDianZhong'),
            I18n.global.t('yiChongMan'),
            I18n.global.t('yiDuanKaiDianYuan'),
          ].includes(val),
      },
    },
  });
</script>

<style lang="less" scoped>
  .container {
    position: absolute;
    bottom: 20vh;
    left: 50vw;
    width: 300px;
    height: 500px;
    transform: translateX(-50%);

    .number {
      position: absolute;
      top: 20%;
      z-index: 10;
      width: 300px;
      font-size: 32px;
      color: #fff;
      text-align: center;
    }

    .contrast {
      width: 300px;
      height: 400px;
      overflow: hidden;
      background-color: #000;
      filter: contrast(15) hue-rotate(0);
      animation: hueRotate 10s infinite linear;

      .circle {
        position: relative;
        width: 300px;
        height: 300px;
        filter: blur(8px);
        box-sizing: border-box;

        &::after {
          position: absolute;
          top: 40%;
          left: 50%;
          width: 200px;
          height: 200px;
          background-color: #00ff6f;
          border-radius: 42% 38% 62% 49% / 45%;
          content: '';
          transform: translate(-50%, -50%) rotate(0);
          animation: rotate 10s infinite linear;
        }

        &::before {
          position: absolute;
          top: 40%;
          left: 50%;
          z-index: 10;
          width: 176px;
          height: 176px;
          background-color: #000;
          border-radius: 50%;
          content: '';
          transform: translate(-50%, -50%);
        }
      }

      .bubbles {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 100px;
        height: 40px;
        background-color: #00ff6f;
        border-radius: 100px 100px 0 0;
        filter: blur(5px);
        transform: translate(-50%, 0);

        li {
          position: absolute;
          background: #00ff6f;
          border-radius: 50%;
        }
      }
    }

    .charging {
      font-size: 20px;
      text-align: center;
    }
  }

  @keyframes rotate {
    50% {
      border-radius: 45% / 42% 38% 58% 49%;
    }

    100% {
      transform: translate(-50%, -50%) rotate(720deg);
    }
  }

  @keyframes moveToTop {
    90% {
      opacity: 1;
    }

    100% {
      opacity: 0.1;
      transform: translate(-50%, -180px);
    }
  }

  @keyframes hueRotate {
    100% {
      filter: contrast(15) hue-rotate(360deg);
    }
  }
</style>
