<template>
  <div class="layout-header">
    <!--顶部菜单-->
    <div
      class="layout-header-left"
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)"
    >
      <div class="logo" v-if="navMode === 'horizontal'">
        <BasicImage
          width="32"
          height="32"
          :src="appLogo"
          :nosrc="noLogoUrl"
          :fallsrc="noLogoUrl"
          class="mr-2"
          :other="{ previewDisabled: true }"
        />
        <div v-show="!isCollapsed" class="title">{{ currentApp.title }}</div>
      </div>
      <AsideMenu
        v-model:collapsed="isCollapsed"
        v-model:location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal"
      />
    </div>
    <!--左侧菜单-->
    <div class="layout-header-left" v-else>
      <!-- 菜单收起 -->
      <div class="ml-3.5 layout-header-item" @click="() => $emit('update:collapsed', !isCollapsed)">
        <n-icon size="18" v-if="isCollapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
      </div>
      <!-- 刷新 -->
      <div class="ml-3 mr-3 layout-header-item" v-if="headerSetting.isReload" @click="reloadPage">
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb v-if="crumbsSetting.show">
        <template
          v-for="routeItem in breadcrumbList"
          :key="routeItem.name === 'Redirect' ? void 0 : routeItem.name"
        >
          <n-breadcrumb-item v-if="routeItem.meta.title">
            <n-dropdown
              v-if="routeItem.children && routeItem.children.length"
              :options="routeItem.children.filter((item) => item.meta.hidden !== true)"
              @select="dropdownSelect"
            >
              <span
                class="link-text"
                :style="{ color: getInverted ? 'rgba(255, 255, 255, 0.52)' : '' }"
              >
                <component
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                  :is="routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </n-dropdown>
            <span
              class="link-text"
              :style="{ color: getInverted ? 'rgba(255, 255, 255, 0.82)' : '' }"
              v-else
            >
              <component
                v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                :is="routeItem.meta.icon"
              />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <!-- 应用中心 -->
      <!-- <div class="layout-header-trigger layout-header-trigger-min"> -->
      <div class="layout-header-item" v-if="permissionMode === 'BACK' && appList.length > 1">
        <n-tooltip placement="bottom" trigger="click" :show-arrow="false" raw>
          <template #trigger>
            <n-icon size="18">
              <AppstoreTwotone />
            </n-icon>
          </template>
          <n-layout>
            <n-grid x-gap="12" :cols="4" class="app-list-warp">
              <n-gi
                v-for="item in appList"
                :key="item.appId"
                @click="changeApp(item)"
                style="margin: 12px"
              >
                <n-flex align="center" vertical>
                  <BasicImage
                    width="56"
                    height="56"
                    :src="item.svg"
                    :other="{ previewDisabled: true }"
                  />
                  <n-tag :type="appId === item.appId ? 'primary' : ''">
                    {{ item.title }}
                  </n-tag>
                </n-flex>
              </n-gi>
            </n-grid>
          </n-layout>
        </n-tooltip>
      </div>
      <!--搜索-->
      <div class="layout-header-item ml-3.5" v-for="item in iconList" :key="item.icon">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!--语言-->
      <div class="layout-header-item ml-3.5">
        <n-dropdown trigger="click" @select="localeSelect" :options="localeOptions">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-icon size="18">
                <LanguageOutline />
              </n-icon>
            </template>
            <span>{{ $t('yuYan') }}</span>
          </n-tooltip>
        </n-dropdown>
      </div>
      <!--主题-->
      <div class="layout-header-item ml-3.5">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18" @click="changeDarkTheme($event)">
              <Light />
            </n-icon>
          </template>
          <span>{{ $t('zhuTi') }}</span>
        </n-tooltip>
      </div>
      <!--通知-->
      <div class="layout-header-item ml-3.5">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-badge :value="99" :max="99" :offset="['0.3rem', '-0.55rem']">
              <n-icon size="18">
                <Bell />
              </n-icon>
            </n-badge>
          </template>
          <span>{{ $t('tongZhi') }}</span>
        </n-tooltip>
      </div>
      <!--设置-->
      <div class="layout-header-item ml-3.5" @click="openSetting">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>{{ $t('xiangMuPeiZhi') }}</span>
        </n-tooltip>
      </div>
      <!--切换全屏-->
      <!-- <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div> -->
      <!-- 部门岗位 -->
      <div class="ml-6" v-if="!isAdmin && nowDeptPostId">
        <n-popselect
          v-model:value="nowDeptPostId"
          :options="JSON.parse(deptPostJson)"
          trigger="click"
          @update:value="deptPostChange"
        >
          <div class="flex items-center h-full">
            {{ postShowName }}
            <n-icon size="12" color="#515a6e" class="ml-1 flex items-center">
              <DownOutlined />
            </n-icon>
          </div>
        </n-popselect>
      </div>
      <!-- 个人中心 -->
      <div
        class="layout-header-trigger layout-header-trigger-min"
        :class="isAdmin ? 'ml-5' : 'ml-2'"
      >
        <n-dropdown trigger="hover" @select="avatarSelect" :options="avatarOptions">
          <div class="flex items-center">
            <div class="avatar">
              <BasicImage
                width="32"
                height="32"
                :src="headImageUrl"
                :nosrc="noHeadImageUrl"
                :fallsrc="noHeadImageUrl"
                round
                :other="{ previewDisabled: true }"
              />
            </div>
            <div class="username ml-2">
              {{ showName }}
            </div>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
  <!--项目配置-->
  <ProjectSetting ref="drawerSetting" />
</template>

<script lang="ts">
  import components from './components';
  import { NDialogProvider, useDialog, useMessage } from 'naive-ui';
  import { useUserStore } from '@/store/modules/user';
  import { useScreenLockStore } from '@/store/modules/screenLock';
  import ProjectSetting from './ProjectSetting.vue';
  import { AsideMenu } from '@/layout/components/Menu';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { websiteConfig } from '@/config/website.config';
  import { useGlobSetting } from '@/hooks/setting';
  import { appTypeEnum } from '@/enums/appEnum';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { getChildrenRouter } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  import { changeDeptIdentity } from '@/api/System/setting/user';
  import I18n from '@/lang/index'; //引入i18n组件
  // 引入方法
  import { change_dark } from '@travel_wsy/change_dark';
  // 引入样式
  import '@travel_wsy/change_dark/index.css';
  export default defineComponent({
    name: 'PageHeader',
    components: { ...components, NDialogProvider, ProjectSetting, AsideMenu },
    props: {
      collapsed: {
        type: Boolean,
      },
      inverted: {
        type: Boolean,
      },
    },
    emits: ['update:collapsed'],
    setup(props, { emit }) {
      // 公共上传接口
      const { fileUrl } = useGlobSetting();
      const userStore = useUserStore();
      const useLockscreen = useScreenLockStore();
      const projectStore = useProjectSettingStore();
      const designStore = useDesignSettingStore();
      const permissionMode = computed(() => projectStore.permissionMode);
      // 标签页
      const message = useMessage();
      const dialog = useDialog();
      const { navMode, navTheme, headerSetting, menuSetting, crumbsSetting } = useProjectSetting();

      const cssButtonColor2 = ref(cssConvert('buttonColor2'));
      const buttonColor2Hover = ref(cssConvert('buttonColor2Hover'));
      const { showName, headImageUrl, userId, deptPostJson, postShowName, nowDeptPostId, isAdmin } =
        userStore?.info || {};
      const appId = computed(() => toRaw(userStore.appId));
      const currentApp = computed(() => toRaw(userStore.currentApp));
      const appList = computed(() => userStore.appList);
      const drawerSetting = ref();
      const state = reactive({
        username: showName ?? '',
        headImageUrl: headImageUrl ?? '',
        fullscreenIcon: 'FullscreenOutlined',
        navMode,
        navTheme,
        headerSetting,
        crumbsSetting,
        userId,
        // appConfig: websiteConfig,
      });
      const appLogo = computed(() => {
        return fileUrl + currentApp.value?.svg;
      });
      const getInverted = computed(() => {
        return ['light', 'header-dark'].includes(unref(navTheme))
          ? props.inverted
          : !props.inverted;
      });

      const mixMenu = computed(() => {
        return unref(menuSetting).mixMenu;
      });

      const getChangeStyle = computed(() => {
        const { collapsed } = props;
        const { minMenuWidth, menuWidth } = unref(menuSetting);
        return {
          left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
          width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`,
        };
      });
      const isCollapsed = computed({
        get: () => props.collapsed,
        set: (value) => {
          emit('update:collapsed', value);
        },
      });
      const getMenuLocation = computed(() => {
        return 'header';
      });

      const router = useRouter();
      const route = useRoute();
      const noHeadImageUrl = new URL('@/assets/images/profile.png', import.meta.url).href;
      const noLogoUrl = new URL('@/assets/images/noLogo.png', import.meta.url).href;
      const generator: any = (routerMap) => {
        return routerMap.map((item) => {
          const currentMenu = {
            ...item,
            label: item.meta.title,
            key: item.name,
            disabled: item.path === '/',
          };
          // 是否有子菜单，并递归处理
          if (item.children && item.children.length > 0) {
            // Recursion
            currentMenu.children = generator(item.children, currentMenu);
          }
          return currentMenu;
        });
      };

      const breadcrumbList = computed(() => {
        let menuList = getChildrenRouter(route.matched);
        return generator(removeDuplicates(menuList));
      });

      const dropdownSelect = (key) => {
        router.push({ name: key });
      };

      // 刷新页面
      const reloadPage = () => {
        router.push({
          path: '/redirect' + unref(route).path,
          query: unref(route).query,
        });
      };

      // 退出登录
      const doLogout = () => {
        dialog.info({
          title: I18n.global.t('tiShi'),
          content: I18n.global.t('ninQueDingYaoTuiChuDengLuMa'),
          positiveText: I18n.global.t('queDing'),
          negativeText: I18n.global.t('quXiao'),
          onPositiveClick: () => {
            userStore.logout().then(() => {
              message.success(I18n.global.t('chengGongTuiChuDengLu'));
              router
                .replace({
                  name: 'Login',
                  // query: {
                  //   redirect: route.fullPath,
                  // },
                })
                .finally(() => location.reload());
            });
          },
          onNegativeClick: () => {},
        });
      };

      // 切换全屏图标
      const toggleFullscreenIcon = () =>
        (state.fullscreenIcon =
          document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined');

      // 监听全屏切换事件
      document.addEventListener('fullscreenchange', toggleFullscreenIcon);

      // 全屏切换
      const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      };
      //  切换主题
      const changeDarkTheme = (event) => {
        change_dark(event, false, () => {
          designStore.setDarkTheme(!designStore.darkTheme);
          projectStore.navTheme = designStore.darkTheme ? 'header-dark' : 'dark';
          let html: any = document.querySelector('html');
          html.setAttribute('theme', designStore.darkTheme ? 'dark' : 'light');
        });
      };

      // 图标列表
      const iconList = [
        {
          icon: 'SearchOutlined',
          tips: I18n.global.t('souSuo'),
        },
        {
          icon: 'LockOutlined',
          tips: I18n.global.t('suoPing'),
          eventObject: {
            click: () => useLockscreen.setLock(true),
          },
        },
      ];
      const avatarOptions = [
        {
          label: I18n.global.t('geRenSheZhi'),
          key: 1,
        },
        {
          label: I18n.global.t('tuiChuDengLu'),
          key: 2,
        },
      ];

      const localeOptions = [
        {
          label: I18n.global.t('jianTiZhongWen'),
          key: 'zh',
        },
        {
          label: 'English',
          key: 'en',
        },
      ];

      // 部门岗位切换
      const deptPostChange = (deptPostId: string) => {
        changeDeptIdentity({ deptPostId }).then(() => {
          message.success(I18n.global.t('qieHuanChengGong'));
          window.location.reload();
        });
      };

      //头像下拉菜单
      const avatarSelect = (key: number) => {
        switch (key) {
          case 1:
            router.push({ name: 'settingAccount' });
            break;
          case 2:
            doLogout();
            break;
        }
      };

      // 语言下拉菜单
      const localeSelect = (key: string) => {
        projectStore.setLocale(key);
        window.location.reload();
      };

      // 打开设置
      function openSetting() {
        const { openDrawer } = drawerSetting.value;
        openDrawer();
      }
      async function changeApp(app) {
        if (app.type === appTypeEnum.URL_APP) {
          window.open(app.url);
          return;
        }
        userStore.changeApp(router, app);
      }

      // 数组对象去重
      function removeDuplicates(arr) {
        const map = new Map();

        arr.forEach((item) => {
          if (!map.has(item.name)) {
            map.set(item.name, item);
          }
        });

        return Array.from(map.values());
      }

      return {
        ...toRefs(state),
        noHeadImageUrl,
        noLogoUrl,
        showName,
        deptPostJson,
        postShowName,
        nowDeptPostId,
        isAdmin,
        iconList,
        toggleFullScreen,
        doLogout,
        route,
        dropdownSelect,
        avatarOptions,
        localeOptions,
        getChangeStyle,
        avatarSelect,
        localeSelect,
        deptPostChange,
        breadcrumbList,
        reloadPage,
        drawerSetting,
        openSetting,
        getInverted,
        getMenuLocation,
        mixMenu,
        websiteConfig,
        fileUrl,
        isCollapsed,
        changeApp,
        changeDarkTheme,
        appLogo,
        appList,
        appId,
        currentApp,
        permissionMode,
        cssButtonColor2,
        buttonColor2Hover,
      };
    },
  });
</script>

<style lang="less" scoped>
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 64px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;

    &-left {
      display: flex;
      align-items: center;
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        line-height: 64px;
        padding: 0px 20px;
        // margin: 0px 20px;
        min-width: 140px;
        img {
          width: 32px;
          height: 32px;
        }
        .title {
          margin-bottom: 0;
          // font-size: 16px;
        }
      }

      ::v-deep(.ant-breadcrumb span:last-child .link-text) {
        color: #515a6e;
      }

      // .n-breadcrumb {
      //   display: inline-block;
      // }

      &-menu {
        color: var(--text-color);
      }
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .avatar {
        display: flex;
        align-items: center;
        height: 64px;
      }

      > * {
        cursor: pointer;
      }
    }

    &-trigger {
      display: inline-block;
      width: 64px;
      height: 64px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      .n-icon {
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
      }

      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }

      .anticon {
        font-size: 16px;
        color: #515a6e;
      }
    }

    &-trigger-min {
      width: auto;
      padding: 0 12px;
    }
  }

  .layout-header-light {
    background: #fff;
    color: #515a6e;

    .n-icon {
      color: #515a6e;
    }

    .layout-header-left {
      ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
        color: #515a6e;
      }
    }

    .layout-header-trigger {
      &:hover {
        background: #f8f8f9;
      }
    }
  }

  .layout-header-item {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: v-bind(cssButtonColor2);
    &:hover {
      background: v-bind(buttonColor2Hover);
    }
  }

  .layout-header-fix {
    position: fixed;
    top: 0;
    right: 0;
    left: 200px;
    z-index: 11;
  }
  :deep(.n-menu .n-menu-item-content) {
    line-height: normal;
  }
  :deep(.n-menu-item-content-header) {
    width: max-content;
  }
  //::v-deep(.menu-router-link) {
  //  color: #515a6e;
  //
  //  &:hover {
  //    color: #1890ff;
  //  }
  //}
  // .app-list-warp {
  //   background-color: #fff;
  // }
</style>
