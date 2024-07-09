<template>
  <div>
    <!-- <div class="n-layout-page-header">
      <n-card :bordered="false" title="菜单权限管理">
        页面数据为 Mock 示例数据，非真实数据。
      </n-card>
    </div> -->
    <n-grid class="mt-4" cols="1 s:1 m:1 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12">
      <!-- 菜单树 -->
      <n-gi span="1">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-dropdown trigger="hover" @select="selectAddMenu" :options="addMenuOptions">
                <n-button type="primary" ghost icon-placement="right">
                  {{ $t('tianJiaCaiDan') }}
                  <template #icon>
                    <div class="flex items-center">
                      <n-icon size="14">
                        <DownOutlined />
                      </n-icon>
                    </div>
                  </template>
                </n-button>
              </n-dropdown>
              <n-button type="primary" ghost icon-placement="left" @click="packHandle">
                {{ $t('quanBu') }}
                {{ expandedKeys.length ? $t('shouQi') : $t('zhanKai') }}
                <template #icon>
                  <div class="flex items-center">
                    <n-icon size="14">
                      <AlignLeftOutlined />
                    </n-icon>
                  </div>
                </template>
              </n-button>
            </n-space>
          </template>
          <div class="w-full menu">
            <n-input
              type="input"
              v-model:value="pattern"
              :placeholder="$t('shuRuCaiDanMingChengSouSuo')"
            >
              <template #suffix>
                <n-icon size="18" class="cursor-pointer">
                  <SearchOutlined />
                </n-icon>
              </template>
            </n-input>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  ref="treeInstRef"
                  block-line
                  :virtual-scroll="true"
                  :pattern="pattern"
                  :data="treeData"
                  :expandedKeys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  :key-field="`menuId`"
                  @update:selected-keys="selectedTree"
                  @update:expanded-keys="onExpandedKeys"
                  :render-suffix="treeToolRender"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <!-- 编辑区域 -->
      <n-gi span="2">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-icon size="18">
                <FormOutlined />
              </n-icon>
              <span>
                {{ $t('bianJi') }}
                {{
                  formParams.menuType === menuTypeEnum.DIRECTORY
                    ? $t('muLu')
                    : formParams.menuType === menuTypeEnum.VIEW
                    ? $t('jieMian')
                    : $t('anNiu')
                }}{{ treeItemTitle ? `：${treeItemTitle}` : '' }}
              </span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon size="18">
                    <QuestionCircleOutlined />
                  </n-icon>
                </template>
                <span class="title-text">
                  {{ $t('congZuoCeLieBiaoXuanZeYiXiangHouJinHangBianJi') }}</span
                >
              </n-tooltip>
            </n-space>
          </template>

          <n-form
            :model="formParams"
            :rules="rules"
            ref="formRef"
            label-placement="left"
            :label-width="I18n.global.locale.value === 'zh' ? 110 : 200"
            v-if="isEditMenu"
            class="py-4 w-2/4 ml-4"
          >
            <n-divider title-placement="left"> {{ $t('jiBenSheZhi') }} </n-divider>
            <n-grid :cols="24" :x-gap="24">
              <n-form-item-gi :span="24" :label="$t('caiDan')" path="menuType">
                <n-radio-group
                  v-model:value="formParams.menuType"
                  name="menuType"
                  :on-update:value="handleMenuTypeChange"
                >
                  <n-radio-button :value="menuTypeEnum.DIRECTORY">{{ $t('muLu') }}</n-radio-button>
                  <n-radio-button :value="menuTypeEnum.VIEW">{{ $t('jieMian') }}</n-radio-button>
                  <n-radio-button :value="menuTypeEnum.BUTTON">{{ $t('anNiu') }}</n-radio-button>
                </n-radio-group>
              </n-form-item-gi>
              <n-form-item-gi :span="24" :label="$t('shangJiMuLu')" path="parentId">
                <n-tree-select :options="treeData" v-model:value="formParams.parentId" clearable />
              </n-form-item-gi>

              <n-form-item-gi
                :span="12"
                :label="currentTypeName + $t('mingCheng')"
                path="meta.title"
              >
                <n-input
                  :placeholder="$t('qingShuRu') + currentTypeName + $t('mingCheng')"
                  v-model:value="formParams.meta.title"
                  clearable
                />
              </n-form-item-gi>

              <n-form-item-gi
                :span="12"
                :label="$t('luYouLuJing')"
                path="path"
                v-if="formParams.menuType !== menuTypeEnum.BUTTON"
              >
                <n-input
                  :placeholder="$t('qingShuRuLuYouDiZhi')"
                  v-model:value="formParams.path"
                  clearable
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                path="name"
                v-if="formParams.menuType !== menuTypeEnum.BUTTON"
              >
                <template #label>
                  {{ $t('luYouMingCheng') }}
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-icon size="18" class="text-gray-400 cursor-pointer">
                        <QuestionCircleOutlined />
                      </n-icon>
                    </template>
                    {{
                      $t('quFenLuYouDeWeiYiBiaoShiWenJianJiaXingShiDeLuYouBiXuTianXieParentlayout')
                    }}
                  </n-tooltip>
                </template>
                <n-input
                  :placeholder="$t('qingShuRuLuYouMingCheng')"
                  v-model:value="formParams.name"
                  clearable
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                path="redirect"
                v-if="formParams.menuType == menuTypeEnum.DIRECTORY"
              >
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
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                path="component"
                v-if="formParams.menuType !== menuTypeEnum.BUTTON"
              >
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
                <n-input
                  :placeholder="$t('zuJian')"
                  v-model:value="formParams.component"
                  clearable
                />
              </n-form-item-gi>

              <n-form-item-gi :span="12" path="icon">
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
                <!-- <n-input
                  placeholder="请输入图标组件名"
                  v-model:value="formParams.meta.icon"
                  disabled
                  clearable
                /> -->
              </n-form-item-gi>
              <n-form-item-gi
                :span="formParams.menuType !== menuTypeEnum.VIEW ? 24 : 12"
                :label="$t('xianShiPaiXu')"
                path="sort"
              >
                <n-input-number
                  :placeholder="$t('qingShuRuPaiXu')"
                  v-model:value="formParams.meta.sort"
                  button-placement="both"
                  :min="0"
                  class="w-full"
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="24"
                :label="$t('bangDingQuanXian')"
                path="perms"
                v-if="formParams.menuType !== menuTypeEnum.DIRECTORY"
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
              </n-form-item-gi>
              <n-form-item-gi :span="24">
                <n-divider title-placement="left"> {{ $t('gongNengSheZhi') }} </n-divider>
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                :label="$t('shiFouHuanCun')"
                path="keepAlive"
                v-if="formParams.menuType !== menuTypeEnum.BUTTON"
              >
                <n-radio-group v-model:value="formParams.meta.keepAlive" name="keepAlive">
                  <n-radio-button :value="true">{{ $t('huanCun') }}</n-radio-button>
                  <n-radio-button :value="false">{{ $t('buHuanCun') }}</n-radio-button>
                </n-radio-group>
              </n-form-item-gi>
              <n-form-item-gi :span="12" :label="$t('shiFouJinYong')" path="disabled">
                <n-radio-group v-model:value="formParams.meta.disabled" name="disabled">
                  <n-radio-button :value="false">{{ $t('zhengChang') }}</n-radio-button>
                  <n-radio-button :value="true">{{ $t('jinYong') }}</n-radio-button>
                </n-radio-group>
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                :label="$t('shiFouYinCang')"
                path="hidden"
                v-if="formParams.menuType === menuTypeEnum.VIEW"
              >
                <n-radio-group v-model:value="formParams.meta.hidden" name="hidden">
                  <n-radio-button :value="false">{{ $t('xianShi') }}</n-radio-button>
                  <n-radio-button :value="true">{{ $t('yinCang') }}</n-radio-button>
                </n-radio-group>
              </n-form-item-gi>
              <n-form-item-gi :span="12" path="hidden" v-if="formParams.meta.hidden">
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
              </n-form-item-gi>
              <n-form-item-gi :span="12" path="checked">
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
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                path="url"
                v-if="formParams.menuType !== menuTypeEnum.BUTTON"
              >
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
              </n-form-item-gi>
              <!-- 是否固定tab -->
              <n-form-item-gi
                :span="12"
                path="affix"
                v-if="formParams.menuType === menuTypeEnum.VIEW"
              >
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
              </n-form-item-gi>
              <!-- 自动计算根路由 -->
              <n-form-item-gi
                :span="12"
                path="affix"
                v-if="formParams.menuType === menuTypeEnum.DIRECTORY"
              >
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
              </n-form-item-gi>
              <n-form-item-gi
                :span="12"
                path="shortcut"
                v-if="formParams.menuType === menuTypeEnum.VIEW"
              >
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
              </n-form-item-gi>

              <n-form-item-gi :span="24" path="auth" style="margin-left: 100px">
                <n-space>
                  <n-button
                    type="primary"
                    class="primary-button"
                    :loading="subLoading"
                    @click="formSubmit"
                    >{{ $t('baoCunXiuGai') }}</n-button
                  >
                  <n-button @click="handleReset">{{ $t('zhongZhi') }}</n-button>
                  <n-button @click="handleDel(formParams.menuId)">{{ $t('shanChu') }}</n-button>
                </n-space>
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
    <CreateDrawer
      ref="createDrawerRef"
      :title="drawerTitle"
      :treeData="treeData"
      @update-success="getTreeMenuList"
      :addType="addDrawerType"
      :drawerType="treeItemType"
      :parentId="treeItemId"
      :permCodeList="permCodeList"
    />
  </div>
</template>
<script lang="ts" setup>
  import { IconSelect } from '@/components/IconSelect';
  import { cloneDeep } from 'lodash-es';
  import { useMessage, NPopover, NTag, useDialog } from 'naive-ui';
  import type { SelectRenderTag, TreeInst, TreeOption } from 'naive-ui';
  // 图标
  import {
    DownOutlined,
    AlignLeftOutlined,
    SearchOutlined,
    FormOutlined,
    QuestionCircleOutlined,
  } from '@vicons/antd';
  import { getMenuList, deleteMenu, updateMenu } from '@/api/System/setting/menu';
  import { getPermCodeListDict } from '@/api/System/setting/perm';
  import { getTreeItem } from '@/utils';
  // 抽屉组件
  import CreateDrawer from './CreateDrawer.vue';
  // 菜单树按钮组
  import menuButton from './menuButton.vue';
  import I18n from '@/lang/index'; //引入i18n组件
  import { menuTypeEnum } from '@/enums/menuEnum';
  // 从参数中获取appId
  const { query } = useRoute();
  const appId = query?.appId ?? '1';
  //表单ref
  const formRef: any = ref(null);
  // 添加菜单抽屉ref
  const createDrawerRef = ref();
  // 消息提示
  const message = useMessage();
  // 弹框
  const dialog = useDialog();

  let treeItemKey = ref([]);

  let expandedKeys = ref([]);

  const treeData = ref([]);
  // 菜单列表加载
  const loading = ref(true);
  // 子面板加载
  const subLoading = ref(false);
  // 是否编辑菜单中
  const isEditMenu = ref(false);
  // 子面板中的标题
  const treeItemTitle = ref('');
  // 菜单树搜索字段
  const pattern = ref('');
  // 添加菜单标题
  const drawerTitle = ref('');
  // 当前点击节点的类型
  const treeItemType = ref(menuTypeEnum.DIRECTORY);
  // 添加菜单的类型
  const addDrawerType = ref(menuTypeEnum.DIRECTORY);
  // 当前菜单的id
  const treeItemId = ref('');
  // 滚动位置的目标节点id
  const scrollTreeItem = ref('');
  // 存储所有的节点id
  const allTreeIds = ref<string[]>([]);
  // 是否能添加子节点
  const isAddSon = computed(() => {
    return !treeItemKey.value.length;
  });
  const treeInstRef = ref<TreeInst | null>(null);
  const permCodeList = ref([]);
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
              type: 'primary',
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
                document.execCommand('Copy');
                document.body.removeChild(input);
                message.success(I18n.global.t('fuZhiChengGong') + '：' + option.permCode);
              },
            },
            { default: () => option.permCode }
          );
        },
      }
    );
  };
  //添加菜单下的下拉菜单
  const addMenuOptions = ref([
    {
      label: I18n.global.t('tianJiaDingJiCaiDan'),
      key: 'home',
      disabled: false,
    },
    {
      label: I18n.global.t('tianJiaZiCaiDan'),
      key: 'son',
      disabled: isAddSon,
    },
    {
      label: I18n.global.t('tianJiaTongJiCaiDan'),
      key: 'brother',
      disabled: isAddSon,
    },
  ]);
  // form属性定义
  const formParams = reactive({
    menuId: '',
    // 菜单类型
    menuType: menuTypeEnum.DIRECTORY,
    // 是否默认选中
    checked: false,
    meta: {
      // 图标
      icon: '',
      // 显示顺序
      sort: 0,
      // 是否隐藏
      hidden: false,
      // 是否禁用
      disabled: false,
      // 是否缓存
      keepAlive: false,
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
    parentId: '',
    // 组件或组件路径
    component: '',
    // 子节点数组
    children: [],
    // 组件名
    name: '',
    // 重定向地址
    redirect: '',
    // 是否外链
    url: false,
    // 菜单绑定的绑定权限数组
    perms: [],
  });
  // 标题显示
  let currentTypeName = computed(() =>
    formParams.menuType === menuTypeEnum.DIRECTORY
      ? I18n.global.t('muLu')
      : formParams.menuType === menuTypeEnum.VIEW
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
  // 点击添加菜单按钮
  function selectAddMenu(key: string) {
    switch (key) {
      case 'home':
        drawerTitle.value = I18n.global.t('tianJiaDingLanCaiDan');
        break;
      case 'son':
        drawerTitle.value = I18n.global.t('tianJiaZiCaiDan') + '：' + treeItemTitle.value;
        break;
      case 'brother':
        drawerTitle.value = I18n.global.t('tianJiaTongJiCaiDan') + '：' + treeItemTitle.value;
        break;
    }
    addDrawerType.value =
      key === 'home'
        ? menuTypeEnum.DIRECTORY
        : key === 'son'
        ? menuTypeEnum.VIEW
        : menuTypeEnum.BUTTON;
    // 打开侧边抽屉
    openCreateDrawer();
  }
  // 打开侧边抽屉，开始添加菜单
  function openCreateDrawer() {
    const { openDrawer } = createDrawerRef.value;
    openDrawer();
  }
  // 选中菜单树节点
  function selectedTree(keys) {
    if (keys.length) {
      const treeItem = getTreeItem(unref(treeData), keys[0]);
      treeItemKey.value = keys;
      // 当前菜单的label
      treeItemTitle.value = treeItem.label;
      // 当前菜单的类型
      treeItemType.value = treeItem.menuType;
      // 当前菜单的id
      treeItemId.value = treeItem.menuId;
      scrollTreeItem.value = treeItem.menuId;
      Object.assign(formParams, cloneDeep(treeItem));
      formParams.parentId = treeItem.parentId;
      // 回显绑定权限
      if (
        formParams.menuType === menuTypeEnum.VIEW ||
        formParams.menuType === menuTypeEnum.BUTTON
      ) {
        formParams.perms = treeItem.permCodeIdList ?? [];
      }
      isEditMenu.value = true;
    } else {
      // 清空数据
      isEditMenu.value = false;
      treeItemKey.value = [];
      treeItemTitle.value = '';
      treeItemType.value = menuTypeEnum.DIRECTORY;
      treeItemId.value = '';
      scrollTreeItem.value = '';
    }
  }

  // 点击删除时的回调
  function handleDel(menuId) {
    dialog.info({
      title: I18n.global.t('tiShi'),
      content: I18n.global.t('ninQueDingXiangShanChuCiCaiDanMaHuiLianZiCaiDanYiQiShanChuWuFaHuiFu'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        dialog.error({
          title: I18n.global.t('weiXianCaoZuo'),
          content: I18n.global.t('queDingYaoShanChuGaiCaiDanMaHuiYiQiShanChuCaiDanWuFaHuiFu'),
          positiveText: I18n.global.t('erCiQueRen'),
          negativeText: I18n.global.t('quXiao'),
          onPositiveClick: () => {
            deleteMenu({ menuId }).then(() => {
              message.success(I18n.global.t('shanChuChengGong'));
              getTreeMenuList();
            });
          },
          onNegativeClick: () => {
            message.error(I18n.global.t('yiQuXiao'));
          },
        });
      },
      onNegativeClick: () => {
        message.error(I18n.global.t('yiQuXiao'));
      },
    });
  }
  // 点击重置
  function handleReset() {
    const treeItem = getTreeItem(unref(treeData), treeItemKey.value[0]);
    Object.assign(formParams, cloneDeep(treeItem));
  }
  // 表单提交
  function formSubmit() {
    formRef.value.validate((errors: boolean) => {
      const {
        meta,
        component,
        url,
        redirect,
        path,
        name,
        menuId,
        menuType,
        parentId,
        perms,
        checked,
      } = formParams;
      let params = {
        appId,
        meta,
        component,
        checked,
        url,
        redirect,
        path,
        name,
        menuId,
        menuType,
        parentId,
      };
      // 绑定权限
      let permCodeIdListString = '';
      if (!errors) {
        // 通过类型处理绑定权限字段
        if (menuType === menuTypeEnum.VIEW || menuType === menuTypeEnum.BUTTON) {
          permCodeIdListString = perms.join(',');
        } else {
          meta.isRoot = true;
        }
        updateMenu({ permCodeIdListString, sysMenuDto: params }).then(() => {
          message.success(I18n.global.t('baoCunChengGong'));
          getTreeMenuList();
        });
      } else {
        message.error(I18n.global.t('qingTianXieWanZhengXinXi'));
      }
    });
  }
  // 全部展开或收起
  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = unref(allTreeIds) as [];
    }
  }
  enum ButtonActionEnum {
    son,
    brother,
    delete,
  }
  function menuButtonAction(type, treeItem) {
    switch (type) {
      case ButtonActionEnum.son:
        treeItemTitle.value = treeItem.label;
        drawerTitle.value = I18n.global.t('tianJiaZiCaiDan') + '：' + treeItemTitle.value;
        addDrawerType.value = menuTypeEnum.VIEW;
        treeItemType.value = treeItem.menuType;
        treeItemId.value = treeItem.menuId;
        openCreateDrawer();
        break;
      case ButtonActionEnum.brother:
        treeItemTitle.value = treeItem.label;
        drawerTitle.value = I18n.global.t('tianJiaTongJiCaiDan') + '：' + treeItemTitle.value;
        addDrawerType.value = menuTypeEnum.BUTTON;
        treeItemType.value = treeItem.menuType;
        treeItemId.value = treeItem.menuId;
        openCreateDrawer();
        break;
      case ButtonActionEnum.delete:
        handleDel(treeItem.menuId);
        return;
    }
  }
  // 菜单树的后缀工具栏渲染
  function treeToolRender({ option }: { option: TreeOption }) {
    return h(menuButton, {
      onAddSibling: () => menuButtonAction(ButtonActionEnum.brother, option),
      onAddChildren: () => menuButtonAction(ButtonActionEnum.son, option),
      onDeleteSelf: () => menuButtonAction(ButtonActionEnum.delete, option),
    });
  }
  function treeDataAddAttr(tree) {
    return tree.map((item) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        item.children = treeDataAddAttr(item.children);
      }
      item.key = item.menuId;
      item.label = item.meta.title;
      // 顺便存储所有节点id数组
      if (typeof item.menuId === 'string') {
        allTreeIds.value.push(item.menuId);
      }
      return item;
    });
  }
  // 获取菜单树列表
  async function getTreeMenuList() {
    // 显示加载动画
    loading.value = true;
    // 隐藏编辑菜单页面
    isEditMenu.value = false;
    // 获取权限列表
    const treeMenuList = await getMenuList({ appId });
    // 添加树列表数据
    treeData.value = treeDataAddAttr(treeMenuList.dataList);
    //将所有节点添加到展开数组中
    expandedKeys.value = unref(allTreeIds) as [];
    // 如果选择过节点，滚动到节点位置
    if (scrollTreeItem.value) {
      // TODO 数据太少，无法测试 可能有bug
      treeInstRef.value?.scrollTo({ key: scrollTreeItem.value });
    }
    // 获取keys
    const keys = treeMenuList.dataList.map((item) => item.menuId);
    Object.assign(formParams, keys);
    // 加载结束
    loading.value = false;
  }
  // 获取绑定权限列表
  async function getPermCodeLists() {
    try {
      // 使用了虚拟列表，直接加载大量数据
      let res = await getPermCodeListDict();
      permCodeList.value = res;
    } catch (err) {
      console.error(err);
    }
  }
  // 切换菜单类型的回调
  function handleMenuTypeChange(value) {
    formParams.menuType = value;
    // 切换到按钮时，只取第一个值
    if (value === menuTypeEnum.BUTTON) {
      formParams.perms = formParams.perms.slice(0, 1);
    } else if (value === menuTypeEnum.DIRECTORY) {
      formParams.meta.isRoot = true;
    }
  }
  // 选择绑定权限的回调
  function handlePermUpdate(value) {
    if (formParams.menuType === menuTypeEnum.BUTTON && value.length > 1) {
      message.warning(I18n.global.t('anNiuJiBieZhiNengXuanZeYiGeQuanXianZi'));
      formParams.perms = value.slice(0, 1);
    } else {
      formParams.perms = value;
    }
  }
  function handleIconChange(icon) {
    formParams.meta.icon = icon;
  }
  onMounted(async () => {
    // 获取菜单树
    getTreeMenuList();
    // 获取权限列表
    getPermCodeLists();
  });

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }
</script>
