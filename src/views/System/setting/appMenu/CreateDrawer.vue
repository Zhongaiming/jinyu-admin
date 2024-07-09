<template>
  <n-drawer
    v-model:show="isDrawer"
    :width="width"
    :placement="placement"
    :on-after-leave="handleDrawerClose"
  >
    <n-drawer-content :title="title" closable>
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="i18n.locale.value === 'zh' ? 110 : 200"
      >
        <n-form-item>
          <n-divider title-placement="left"> {{ $t('jiBenSheZhi') }} </n-divider>
        </n-form-item>
        <n-form-item :label="$t('caiDan')" path="menuType">
          <n-radio-group
            v-model:value="formParams.menuType"
            name="menuType"
            :on-update:value="handleMenuTypeChange"
          >
            <n-radio-button :value="menuTypeEnum.DIRECTORY">{{ $t('muLu') }}</n-radio-button>
            <n-radio-button :value="menuTypeEnum.VIEW">{{ $t('jieMian') }}</n-radio-button>
            <n-radio-button :value="menuTypeEnum.BUTTON">{{ $t('anNiu') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item :label="$t('shangJiMuLu')" path="parentId">
          <n-tree-select :options="treeData" v-model:value="formParams.parentId" clearable />
        </n-form-item>
        <n-form-item :label="currentTypeName + $t('mingCheng')" path="meta.title">
          <n-input
            :placeholder="$t('qingShuRu') + currentTypeName + $t('mingCheng')"
            v-model:value="formParams.meta.title"
            clearable
          />
        </n-form-item>
        <n-form-item
          path="path"
          :label="$t('luYouLuJing')"
          v-if="formParams.menuType !== menuTypeEnum.BUTTON"
        >
          <n-input :placeholder="$t('luYouDeLuJing')" v-model:value="formParams.path" clearable />
        </n-form-item>
        <n-form-item v-if="formParams.menuType !== menuTypeEnum.BUTTON" path="name">
          <template #label>
            {{ $t('luYouMingCheng') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('quFenLuYouDeWeiYiBiaoShiWenJianJiaXingShiDeLuYouBiXuTianXieParentlayout') }}
            </n-tooltip>
          </template>
          <n-input :placeholder="$t('luYouMingCheng')" v-model:value="formParams.name" clearable />
        </n-form-item>
        <n-form-item path="redirect" v-if="formParams.menuType == menuTypeEnum.DIRECTORY">
          <template #label>
            {{ $t('zhongDingXiang') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('zhongDingXiangDeDiZhiMuLuCaiTianXie') }}
            </n-tooltip>
          </template>
          <n-input
            :placeholder="$t('zhongDingXiangDeDiZhi')"
            v-model:value="formParams.redirect"
            clearable
          />
        </n-form-item>
        <n-form-item path="component" v-if="formParams.menuType !== menuTypeEnum.BUTTON">
          <template #label>
            {{ $t('zuJian') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{
                $t(
                  'shiYongDeZuJianMoRenShiLayoutYeKeYiTianXieZuJianZaiViewsWenJianXiaDeLuJingRuGuoShiWaiLianXuYaoTianXieYouXiaoDeUrl'
                )
              }}
            </n-tooltip>
          </template>
          <n-input :placeholder="$t('zuJian')" v-model:value="formParams.component" clearable />
        </n-form-item>
        <n-form-item path="icon">
          <template #label>
            {{ currentTypeName }}{{ $t('tuBiao') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('xuYaoTianXieShiYongDeTuBiaoZuJianMingCheng') }}
            </n-tooltip>
          </template>
          <icon-select :icon="formParams.meta.icon" @update:icon="handleIconChange" />
          <!-- <n-input placeholder="请输入图标组件名" v-model:value="formParams.meta.icon" clearable /> -->
        </n-form-item>
        <n-form-item :label="$t('xianShiPaiXu')" path="sort">
          <n-input-number
            :placeholder="$t('qingShuRuPaiXu')"
            v-model:value="formParams.meta.sort"
            button-placement="both"
            :min="0"
            class="w-full"
          />
        </n-form-item>
        <n-form-item
          v-if="formParams.menuType !== menuTypeEnum.DIRECTORY"
          :label="$t('bangDingQuanXian')"
          path="perms"
        >
          <n-select
            v-model:value="formParams.perms"
            multiple
            :options="permCodeList"
            value-field="permCodeId"
            label-field="showName"
            clearable
            filterable
            max-tag-count="responsive"
            :render-tag="renderSelectTag"
            :on-update:value="handlePermUpdate"
          />
        </n-form-item>
        <n-form-item>
          <n-divider title-placement="left"> {{ $t('gongNengSheZhi') }} </n-divider>
        </n-form-item>
        <n-form-item
          :label="$t('shiFouHuanCun')"
          path="keepAlive"
          v-if="formParams.menuType !== menuTypeEnum.BUTTON"
        >
          <n-radio-group v-model:value="formParams.meta.keepAlive" name="keepAlive">
            <n-radio-button :value="true">{{ $t('huanCun') }}</n-radio-button>
            <n-radio-button :value="false">{{ $t('buHuanCun') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item :label="$t('shiFouJinYong')" path="disabled">
          <n-radio-group v-model:value="formParams.meta.disabled" name="disabled">
            <n-radio-button :value="false">{{ $t('zhengChang') }}</n-radio-button>
            <n-radio-button :value="true">{{ $t('jinYong') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          :label="$t('shiFouYinCang')"
          path="hidden"
          v-if="formParams.menuType !== menuTypeEnum.BUTTON"
        >
          <n-radio-group v-model:value="formParams.meta.hidden" name="hidden">
            <n-radio-button :value="false">{{ $t('xianShi') }}</n-radio-button>
            <n-radio-button :value="true">{{ $t('yinCang') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <!-- 高亮路由名 -->
        <n-form-item path="activeMenu" v-if="formParams.meta.hidden">
          <template #label>
            {{ $t('gaoLiangCaiDanMing') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('xuYaoZaiCeBianLanGaoLiangDeLuYouName') }}
            </n-tooltip>
          </template>
          <n-input
            :placeholder="$t('qingShuRuLuYouMingCheng')"
            v-model:value="formParams.meta.activeMenu"
            clearable
          />
        </n-form-item>
        <n-form-item path="checked">
          <template #label>
            {{ $t('moRenXuanZhong') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('zaiQuanXianPeiZhiYeMianShiFouMoRenXuanZhong') }}
            </n-tooltip>
          </template>
          <n-radio-group v-model:value="formParams.checked" name="checked">
            <n-radio-button :value="true">{{ $t('xuanZhong') }}</n-radio-button>
            <n-radio-button :value="false">{{ $t('buXuan') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item path="url" v-if="formParams.menuType !== menuTypeEnum.BUTTON">
          <template #label>
            {{ $t('shiFouWaiLian') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('ruGuoShiWaiLianXuYaoZaiZuJianZiDuanZhongTianRuZhengQueDeUrl') }}
            </n-tooltip>
          </template>
          <n-radio-group v-model:value="formParams.url" name="url">
            <n-radio-button :value="true">{{ $t('shi') }}</n-radio-button>
            <n-radio-button :value="false">{{ $t('fou') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <!-- 是否固定tab -->
        <n-form-item path="affix" v-if="formParams.menuType === menuTypeEnum.VIEW">
          <template #label>
            {{ $t('shiFouGuDing') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('shiFouGuDingDaoTab') }}
            </n-tooltip>
          </template>
          <n-radio-group v-model:value="formParams.meta.affix" name="affix">
            <n-radio-button :value="true">{{ $t('shi') }}</n-radio-button>
            <n-radio-button :value="false">{{ $t('fou') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <!-- 自动计算根路由 -->
        <n-form-item path="affix" v-if="formParams.menuType === menuTypeEnum.DIRECTORY">
          <template #label>
            {{ $t('jiSuanGenLuYou') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{
                $t(
                  'dangMuLuXiaZhiYouYiGeZiYuanSuShiHuiZiDongZhanKaiKaiQiHouJinYongGaiTeXingGaiWeiZiDongJiSuan'
                )
              }}
            </n-tooltip>
          </template>
          <n-radio-group v-model:value="formParams.meta.alwaysShow" name="alwaysShow">
            <n-radio-button :value="true">{{ $t('kaiQi') }}</n-radio-button>
            <n-radio-button :value="false">{{ $t('guanBi') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <!--  -->
        <n-form-item path="shortcut" v-if="formParams.menuType === menuTypeEnum.VIEW">
          <template #label>
            {{ $t('kuaiJieFangShi') }}
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ $t('shiFouKeYiTianJiaWeiKuaiJieFangShi') }}
            </n-tooltip>
          </template>
          <n-radio-group v-model:value="formParams.meta.shortcut" name="shortcut">
            <n-radio-button :value="true">{{ $t('kaiQi') }}</n-radio-button>
            <n-radio-button :value="false">{{ $t('guanBi') }}</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space>
          <n-button type="primary" :loading="subLoading" @click="formSubmit">{{
            $t('tiJiao')
          }}</n-button>
          <n-button @click="handleReset">{{ $t('zhongZhi') }}</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
  import { IconSelect } from '@/components/IconSelect';
  import { QuestionCircleOutlined } from '@vicons/antd';
  import { useMessage, NTag, NPopover } from 'naive-ui';
  import type { SelectRenderTag } from 'naive-ui';
  // import type { TreeSelectOption } from 'naive-ui';
  import { addMenu } from '@/api/System/setting/menu';
  import { getTreeItem } from '@/utils';
  import { menuTypeEnum } from '@/enums/menuEnum';
  import I18n from '@/lang/index'; //引入i18n组件
  export default defineComponent({
    name: 'CreateDrawer',
    components: { QuestionCircleOutlined },
    props: {
      title: {
        type: String,
        default: I18n.global.t('tianJiaDingJiCaiDan'),
      },
      width: {
        type: Number,
        default: I18n.global.locale.value === 'zh' ? 450 : 600,
      },
      drawerType: {
        type: Number,
        default: menuTypeEnum.DIRECTORY,
      },
      // 添加菜单的类型 0是顶层 1是子菜单
      addType: {
        type: Number,
        default: menuTypeEnum.DIRECTORY,
      },
      parentId: {
        type: String,
        default: '',
      },
      treeData: {
        type: Array,
        default: () => [],
      },
      permCodeList: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['updateSuccess'],
    setup(props, { emit }) {
      let menuType = menuTypeEnum.DIRECTORY;
      if (props.addType === menuTypeEnum.VIEW) {
        menuType = props.drawerType + 1 > 2 ? props.drawerType + 1 : props.drawerType;
      }
      const message = useMessage();
      const i18n = I18n.global;
      const renderSelectTag: SelectRenderTag = ({ option, handleClose }) => {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () =>
              h(
                NTag,
                {
                  type: 'info',
                  closable: true,
                  onClose: (e: MouseEvent) => {
                    e.stopPropagation();
                    handleClose();
                  },
                },
                { default: () => option.showName ?? '' }
              ),
            default: () => {
              return h(
                'span',
                {
                  onMousedown: () => {
                    const input = document.createElement('input');
                    input.value = option.permCode!.toLocaleString();
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand(`Copy`);
                    document.body.removeChild(input);
                    message.success(`${I18n.global.t('fuZhiChengGong')} ：${option.permCode}`);
                  },
                },
                { default: () => option.permCode }
              );
            },
          }
        );
      };
      const formRef: any = ref(null);
      let parentId = '';
      if (props.addType === menuTypeEnum.VIEW) {
        parentId = props.parentId;
      } else if (props.addType === 2) {
        const treeItem = getTreeItem(unref(props.treeData), props.parentId);
        parentId = treeItem.parentId;
      }
      const defaultValueRef = () => ({
        // 菜单类型
        menuType: menuType,
        checked: false,
        meta: {
          // 是否缓存
          keepAlive: false,
          // 是否隐藏
          hidden: false,
          // 是否禁用
          disabled: false,
          // 显示顺序
          sort: 0,
          // 图标 使用了默认图标
          icon: '',
          //  标题
          title: '',
          // 激活菜单名
          activeMenu: '',
          // 是否固定菜单到tab
          affix: false,
          // 自动计算根路由
          alwaysShow: false,
          // 是否根路由
          isRoot: false,
          // 是否可添加为快捷方式
          shortcut: false,
          // 内联url地址,可能用不到
          frameSrc: '',
        },
        // 组件路径
        path: '',
        // 父菜单id
        parentId: parentId,
        // 组件
        component: 'LAYOUT',
        // 子节点数组
        children: [],
        // 组件名
        name: '',
        // 重定向地址
        redirect: '',
        // 是否外链
        url: false,
        // 绑定权限数组
        perms: [],
      });

      const state = reactive({
        // 是否打开抽屉
        isDrawer: false,
        // 提交按钮加载中
        subLoading: false,
        // 表单数据
        formParams: defaultValueRef(),
        // 抽屉显示的位置
        placement: 'right' as const,
      });
      const { query } = useRoute();
      // 默认appId
      const appId = query?.appId ?? '1';

      // 标题显示
      let currentTypeName = computed(() =>
        state.formParams.menuType === menuTypeEnum.DIRECTORY
          ? I18n.global.t('muLu')
          : state.formParams.menuType === menuTypeEnum.VIEW
          ? I18n.global.t('jieMian')
          : I18n.global.t('anNiu')
      );
      // 表单规则
      const rules = {
        'meta.title': {
          required: true,
          message: I18n.global.t('qingShuRu') + currentTypeName.value + I18n.global.t('mingCheng'),
          trigger: 'blur',
        },
        path: {
          required: true,
          message: I18n.global.t('qingShuRuLuYouLuJing'),
          trigger: 'blur',
        },
        name: {
          required: true,
          message: I18n.global.t('qingShuRuLuYouMingCheng'),
          trigger: 'blur',
        },
      };
      // 打开侧边抽屉
      function openDrawer() {
        state.isDrawer = true;
      }
      // 关闭侧边抽屉
      function closeDrawer() {
        state.isDrawer = false;
      }

      // 提交form
      function formSubmit() {
        formRef.value.validate((errors) => {
          // 根据类型处理绑定权限字段
          let permCodeIdListString = '';
          if (!errors) {
            if (state.formParams.menuType !== menuTypeEnum.DIRECTORY) {
              permCodeIdListString = state.formParams.perms.join(',');
            } else {
              state.formParams.meta.isRoot = true;
            }
            addMenu({
              permCodeIdListString,
              sysMenuDto: { appId, ...state.formParams },
            }).then(() => {
              message.success(I18n.global.t('tianJiaChengGong'));
              emit('updateSuccess');
              handleReset();
              closeDrawer();
            });
          } else {
            message.error(I18n.global.t('qingTianXieWanZhengXinXi'));
          }
        });
      }
      // 重置form
      function handleReset() {
        formRef.value.restoreValidation();
        state.formParams = Object.assign(state.formParams, defaultValueRef());
      }
      // 关闭抽屉的回调
      function handleDrawerClose() {
        handleReset();
      }
      // 选择绑定权限的回调
      function handlePermUpdate(value) {
        if (state.formParams.menuType === menuTypeEnum.BUTTON && value.length > 1) {
          message.warning(I18n.global.t('anNiuJiBieZhiNengXuanZeYiGeQuanXianZi'));
          state.formParams.perms = value.slice(0, 1);
        } else {
          state.formParams.perms = value;
        }
      }
      // 切换菜单类型的回调
      function handleMenuTypeChange(value) {
        state.formParams.menuType = value;
        // 切换到按钮时，只取第一个值
        if (value === menuTypeEnum.BUTTON) {
          state.formParams.perms = state.formParams.perms.slice(0, 1);
        }
      }
      function handleIconChange(icon) {
        state.formParams.meta.icon = icon;
      }
      function updateMenuValue() {
        // 顶层菜单不要额外操作
        if (props.addType === menuTypeEnum.DIRECTORY) return;
        if (props.addType === menuTypeEnum.BUTTON) {
          state.formParams.menuType = props.drawerType;
          const treeItem = getTreeItem(unref(props.treeData), props.parentId);
          state.formParams.parentId = treeItem.parentId;
        } else {
          let menuType = props.drawerType + 1 > 2 ? props.drawerType : props.drawerType + 1;
          state.formParams.menuType = menuType;
          state.formParams.parentId = props.parentId;
        }
      }
      // 监听这两个值，并更新菜单默认值
      watch(() => props.addType, updateMenuValue);
      watch(() => props.parentId, updateMenuValue);
      return {
        ...toRefs(state),
        formRef,
        rules,
        i18n,
        formSubmit,
        handleReset,
        openDrawer,
        closeDrawer,
        currentTypeName,
        handleDrawerClose,
        renderSelectTag,
        handlePermUpdate,
        handleMenuTypeChange,
        menuTypeEnum,
        handleIconChange,
      };
    },
  });
</script>
