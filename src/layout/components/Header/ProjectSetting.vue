<template>
  <n-drawer v-model:show="isDrawer" :width="width" :placement="placement">
    <n-drawer-content :title="title" :native-scrollbar="false">
      <div class="drawer">
        <n-divider title-placement="center">{{ $t('xiTongZhuTi') }}</n-divider>

        <div class="drawer-setting-item align-items-top">
          <span
            class="theme-item"
            v-for="(item, index) in appThemeList"
            :key="index"
            :style="{ 'background-color': item }"
            @click="togTheme(item)"
          >
            <n-icon size="12" v-if="item === designStore.appTheme">
              <CheckOutlined />
            </n-icon>
          </span>
        </div>

        <n-divider title-placement="center">{{ $t('daoHangLanMoShi') }}</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-theme-dark.svg"
                  @click="togNavMode('vertical')"
                  :alt="$t('zuoCeCaiDanMoShi')"
                />
              </template>
              <span>{{ $t('zuoCeCaiDanMoShi') }}</span>
            </n-tooltip>
            <n-badge
              dot
              :color="designStore.appTheme"
              v-show="settingStore.navMode === 'vertical'"
            />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-horizontal.svg"
                  :alt="$t('dingBuCaiDanMoShi')"
                  @click="togNavMode('horizontal')"
                />
              </template>
              <span>{{ $t('dingBuCaiDanMoShi') }}</span>
            </n-tooltip>
            <n-badge
              dot
              :color="designStore.appTheme"
              v-show="settingStore.navMode === 'horizontal'"
            />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-horizontal-mix.svg"
                  @click="togNavMode('horizontal-mix')"
                  :alt="$t('dingBuCaiDanHunHeMoShi')"
                />
              </template>
              <span>{{ $t('dingBuCaiDanHunHeMoShi') }}</span>
            </n-tooltip>
            <n-badge
              dot
              :color="designStore.appTheme"
              v-show="settingStore.navMode === 'horizontal-mix'"
            />
          </div>
        </div>

        <n-divider title-placement="center">{{ $t('daoHangLanFengGe') }}</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-theme-dark.svg"
                  :alt="$t('anSeCeBianLan')"
                  @click="togNavTheme('dark')"
                />
              </template>
              <span>{{ $t('anSeCeBianLan') }}</span>
            </n-tooltip>
            <n-badge dot :color="designStore.appTheme" v-if="settingStore.navTheme === 'dark'" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-theme-light.svg"
                  :alt="$t('baiSeCeBianLan')"
                  @click="togNavTheme('light')"
                />
              </template>
              <span>{{ $t('baiSeCeBianLan') }}</span>
            </n-tooltip>
            <n-badge dot :color="designStore.appTheme" v-if="settingStore.navTheme === 'light'" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/header-theme-dark.svg"
                  @click="togNavTheme('header-dark')"
                  :alt="$t('anSeDingLan')"
                />
              </template>
              <span>{{ $t('anSeDingLan') }}</span>
            </n-tooltip>
            <n-badge
              dot
              :color="designStore.appTheme"
              v-if="settingStore.navTheme === 'header-dark'"
            />
          </div>
        </div>
        <n-divider title-placement="center">{{ $t('jieMianGongNeng') }}</n-divider>

        <!-- <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">分割菜单</div>
          <div class="drawer-setting-item-action">
            <n-switch
              :disabled="settingStore.navMode !== 'horizontal-mix'"
              v-model:value="settingStore.menuSetting.mixMenu"
            />
          </div>
        </div> -->

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">{{ $t('guDingDingLan') }}</div>
          <div class="drawer-setting-item-action">
            <n-switch
              v-model:value="settingStore.headerSetting.fixed"
              @update:value="headerFixChange"
            />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">{{ $t('guDingCeBianLan') }}</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.menuSetting.fixed" />
          </div>
        </div>

        <!-- <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定多页签</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.multiTabsSetting.fixed" />
          </div>
        </div> -->

        <n-divider title-placement="center">{{ $t('jieMianXianShi') }}</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            {{ $t('xianShiZhongZaiYeMianAnNiu') }}
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.headerSetting.isReload" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            {{ $t('xianShiMianBaoXieDaoHang') }}
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.crumbsSetting.show" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            {{ $t('xianShiMianBaoXieXianShiTuBiao') }}
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.crumbsSetting.showIcon" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">{{ $t('xianShiDuoYeQian') }}</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.multiTabsSetting.show" />
          </div>
        </div>
        <!--1.15废弃，没啥用，占用操作空间-->
        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title"> 显示页脚 </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.showFooter" />-->
        <!--          </div>-->
        <!--        </div>-->

        <n-divider title-placement="center">{{ $t('dongHua') }}</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">{{ $t('jinYongDongHua') }}</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.isPageAnimate" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">{{ $t('dongHuaLeiXing') }}</div>
          <div class="drawer-setting-item-select">
            <n-select v-model:value="settingStore.pageAnimateType" :options="animateOptions" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <n-alert type="warning" :showIcon="false">
            <p>{{ alertText }}</p>
          </n-alert>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
  import { useProjectSettingStore } from '@/store/modules/projectSetting';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { CheckOutlined } from '@vicons/antd';
  import { animates as animateOptions } from '@/settings/animateSetting';
  import I18n from '@/lang/index'; //引入i18n组件
  export default defineComponent({
    name: 'ProjectSetting',
    components: { CheckOutlined },
    props: {
      title: {
        type: String,
        default: '',
      },
      width: {
        type: Number,
        default: I18n.global.locale.value === 'zh' ? 280 : 320,
      },
    },
    setup(props) {
      const settingStore = useProjectSettingStore();
      const designStore = useDesignSettingStore();
      const state = reactive({
        width: props.width,
        title: props.title || I18n.global.t('xiangMuPeiZhi'),
        isDrawer: false,
        placement: 'right',
        alertText: I18n.global.t(
          'gaiGongNengZhuYaoShiShiYuLanGeZhongBuJuXiaoGuoGengDuoWanZhengPeiZhiZaiProjectsettingtsZhongSheZhi'
        ),
        appThemeList: designStore.appThemeList,
      });

      // watch(
      //   () => designStore.darkTheme,
      //   (to) => {
      //     window['$loading'].start();
      //     window['$message'].loading('设置中...', { duration: 100 });
      //     reloadPage();
      //     settingStore.navTheme = to ? 'header-dark' : 'dark';
      //     let html: any = document.querySelector('html');
      //     html.setAttribute('theme', to ? 'dark' : 'light');
      //   }
      // );

      const directionsOptions = computed(() => {
        return animateOptions.find((item) => item.value == unref(settingStore.pageAnimateType));
      });

      function openDrawer() {
        state.isDrawer = true;
      }

      function closeDrawer() {
        state.isDrawer = false;
      }

      const router = useRouter();
      const route = useRoute();
      // 刷新页面
      const reloadPage = () => {
        router.push({
          path: '/redirect' + unref(route).path,
          query: unref(route).query,
        });
        window['$loading'].finish();
        window['$message'].destroyAll();
      };

      function togNavTheme(theme) {
        settingStore.navTheme = theme;
        if (settingStore.navMode === 'horizontal' && ['light'].includes(theme)) {
          settingStore.navTheme = 'dark';
        }
      }

      function togTheme(color) {
        window['$loading'].start();
        window['$message'].loading(I18n.global.t('sheZhiZhong'), { duration: 100 });
        reloadPage();
        designStore.appTheme = color;
      }

      function togNavMode(mode) {
        settingStore.navMode = mode;
        settingStore.menuSetting.mixMenu = mode === 'horizontal-mix' ? true : false;
      }

      function headerFixChange(val) {
        settingStore.multiTabsSetting.fixed = val;
      }

      return {
        ...toRefs(state),
        settingStore,
        designStore,
        togNavTheme,
        togNavMode,
        togTheme,
        openDrawer,
        closeDrawer,
        animateOptions,
        directionsOptions,
        headerFixChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  .drawer {
    .n-divider:not(.n-divider--vertical) {
      margin: 10px 0;
    }

    &-setting-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      flex-wrap: wrap;

      &-style {
        display: inline-block;
        position: relative;
        margin-right: 16px;
        cursor: pointer;
        text-align: center;
      }

      &-title {
        flex: 1 1;
        font-size: 14px;
      }

      &-action {
        flex: 0 0 auto;
      }

      &-select {
        flex: 1;
      }

      .theme-item {
        width: 20px;
        min-width: 20px;
        height: 20px;
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 2px;
        margin: 0 5px 5px 0;
        text-align: center;
        line-height: 14px;

        .n-icon {
          color: #fff;
        }
      }
    }

    .align-items-top {
      align-items: flex-start;
      padding: 2px 0;
    }

    .justify-center {
      justify-content: center;
    }

    .dark-switch .n-switch {
      ::v-deep(.n-switch__rail) {
        background-color: #000e1c;
      }
    }
  }
</style>
