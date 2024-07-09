<template>
  <n-card :bordered="false" class="pro-card">
    <n-form :model="form" ref="formRef" label-placement="top" :label-width="150" class="my-5">
      <n-form-item :label="$t('jiaoSeMingCheng')" path="roleName">
        <n-input :placeholder="$t('qingShuRuJiaoSeMingCheng')" v-model:value="form.roleName" />
      </n-form-item>
      <n-form-item :label="$t('yingYongCaiDanQuanXian')">
        <n-grid y-gap="18" x-gap="18" cols="1 s:1 m:2 l:2 xl:4 2xl:4" responsive="screen">
          <n-gi>
            <!-- <div class="flex flex-wrap w-full"> -->
            <n-card class="app-box flex-1" :title="$t('yingYong')">
              <template v-if="totalAppList?.length">
                <n-checkbox-group v-model:value="appIdSelectList" @update:value="appIdSelectChange">
                  <n-space vertical>
                    <div
                      class="app-item"
                      :style="{
                        backgroundColor:
                          appIndex === index
                            ? cssConvert('primaryColor', designStore.darkTheme ? 0.15 : 0.1) as any
                            : '',
                      }"
                      v-for="(app, index) in totalAppList"
                      :key="index"
                      @click="getMenuTreeList(index, app.appId)"
                    >
                      <n-checkbox
                        :value="app.appId"
                        :indeterminate="
                          Boolean(app.menuCheck.length && app.menuCheck.length != app.menuNum)
                        "
                      />
                      <span class="ml-2">{{ app?.title }}</span>
                    </div>
                  </n-space>
                </n-checkbox-group>
              </template>
              <template v-else>
                <n-empty :description="$t('zanWuShuJu')" />
              </template>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card class="menu-box flex-1" :title="$t('caiDan')">
              <n-tree
                block-line
                :data="menuTreeList"
                expand-on-click
                checkable
                :cancelable="false"
                label-field="title"
                key-field="menuId"
                :checked-keys="totalAppList[appIndex]?.menuCheck"
                :selected-keys="selectmenuKey"
                :default-expanded-keys="defaultExpandedmenuKey"
                @update:selected-keys="getPermCodeList"
                @update:checked-keys="menuCheckedChange"
                :render-suffix="renderSuffix"
              />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card class="permCode-box flex-1" :title="$t('jieKouQuanXian')">
              <template v-if="permCodeObj.permCodeList?.length">
                <n-checkbox-group
                  v-model:value="permCodeObj.permCodeCheck"
                  @update:value="permCodeIdSelectChange"
                >
                  <n-space vertical>
                    <div
                      class="permCode-item"
                      v-for="(permCode, index) in permCodeObj.permCodeList"
                      :style="{
                        backgroundColor:
                          appIndex === index
                            ? cssConvert('primaryColor', designStore.darkTheme ? 0.15 : 0.1) as any
                            : '',
                      }"
                      :key="index"
                      @click="getDataPermList(index)"
                    >
                      <n-checkbox :value="permCode.permCodeId" />
                      <span class="ml-2">{{ permCode?.showName }}</span>
                    </div>
                  </n-space>
                </n-checkbox-group>
              </template>
              <template v-else>
                <n-empty :description="$t('zanWuShuJu')" />
              </template>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card class="dataPerm-box flex-1" :title="$t('shuJuQuanXian')">
              <template v-if="dataPermList?.length">
                <n-radio-group
                  v-model:value="permCodeObj.permCodeList[permCodeIndex].dataPermCheck"
                  @update:value="dataPermIdSelectChange"
                >
                  <n-space vertical>
                    <div
                      class="dataPerm-item"
                      v-for="(dataPerm, index) in dataPermList"
                      :key="index"
                    >
                      <n-radio :value="dataPerm.dataPermId">{{ dataPerm?.dataPermName }}</n-radio>
                    </div>
                  </n-space>
                </n-radio-group>
                <div v-if="selectDataPerm.selectModal">
                  <n-divider title-placement="left">
                    {{ selectDataPerm.dataPermName }}
                  </n-divider>
                  <div class="flex flex-wrap tags-box items-center">
                    <n-tag
                      closable
                      @close="deptPostClose(item)"
                      v-for="item in permCodeObj.permCodeList[permCodeIndex].deptIdJSON &&
                      JSON.parse(permCodeObj.permCodeList[permCodeIndex].deptIdJSON)"
                      :key="item.value"
                      class="ml-3 mt-3"
                      type="primary"
                    >
                      {{ item.label }}
                    </n-tag>
                    <n-button
                      @click="openSelectModal"
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
                    ref="selectModalRef"
                    :title="
                      selectDataPerm.ruleType == 4 || selectDataPerm.ruleType == 5
                        ? $t('xuanZeBuMen')
                        : $t('xuanZeYongHu')
                    "
                    :type="
                      selectDataPerm.ruleType == 4 || selectDataPerm.ruleType == 5 ? 'Dept' : 'Man'
                    "
                    :width="I18n.global.locale.value === 'zh' ? 800 : 840"
                    @on-ok="selectModalOk"
                  />
                </div>
              </template>
              <template v-else>
                <n-empty :description="$t('zanWuShuJu')" />
              </template>
            </n-card>
            <!-- </div> -->
          </n-gi>
        </n-grid>
      </n-form-item>

      <div class="flex justify-end mt-10">
        <n-button type="primary" class="primary-button" @click="addEditRole">{{
          roleId ? $t('bianJiJiaoSe') : $t('xinZengJiaoSe')
        }}</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { appAllList, addSysRole, updateSysRole } from '@/api/System/setting/role';
  import { LinkOutlined, PlusOutlined } from '@vicons/antd';
  import { NIcon } from 'naive-ui';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { selectModalOkStr, selectModalCloseStr } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  import I18n from '@/lang/index'; //引入i18n组件
  const form = ref({
    roleName: null,
  });
  const designStore = useDesignSettingStore();
  const cssHoverColor = ref(cssConvert('hoverColor', 1));
  const route = useRoute();
  const router = useRouter();
  const roleId: any = ref(null);
  const totalAppList: any = ref([]); // 全部应用菜单列表
  const appIndex = ref(0); // 应用选中Index
  const appIdSelectList: any = ref([]); // 应用勾选中列表
  const defaultExpandedmenuKey: any = ref([]); // 默认展开的菜单
  const selectmenuKey: any = ref([]); // 选中的菜单
  const permCodeIndex: any = ref(0); // 权限字选中Index
  const defaultDataPermId = ref(null); // 默认数据权限id
  const isAppCheckChange = ref(false); // 应用勾选是否改变
  const selectModalRef: any = ref(); // 选择弹窗实例
  // 获取全部应用菜单列表
  function getAppAllList() {
    appAllList({ roleId: roleId.value }).then((res) => {
      appIdSelectList.value = res.appCheckList;
      totalAppList.value = res.dataList;
      defaultDataPermId.value = res.dataPermId;
      form.value.roleName = res.roleName || null;
      // 展开key
      defaultExpandedmenuKey.value = [res.dataList[appIndex.value].menu[0].menuId];
      selectmenuKey.value = [res.dataList[appIndex.value].menu[0].children[0].menuId];
    });
  }

  // 菜单树列表
  const menuTreeList: any = computed(() => {
    if (totalAppList.value.length > 0) {
      return totalAppList.value[appIndex.value].menu;
    }
  });

  // 权限对象
  const permCodeObj: any = computed(() => {
    if (totalAppList.value.length > 0) {
      if (menuTreeList.value.length > 0 && selectmenuKey.value.length > 0) {
        return getTreeItemByKey(menuTreeList.value, 'menuId', selectmenuKey.value[0]);
      } else {
        return {};
      }
    } else {
      return {};
    }
  });

  // 数据权限列表
  const dataPermList: any = computed(() => {
    if (totalAppList.value.length > 0) {
      if (permCodeObj && permCodeObj.value.permCodeList && permCodeIndex.value !== null) {
        return permCodeObj.value.permCodeList[permCodeIndex.value].dataPermList;
      } else {
        return [];
      }
    }
  });

  //选中的数据权限
  const selectDataPerm: any = computed(() => {
    if (permCodeObj.value.permCodeList[permCodeIndex.value].dataPermCheck) {
      return dataPermList.value.filter(
        (item: any) =>
          item.dataPermId === permCodeObj.value.permCodeList[permCodeIndex.value].dataPermCheck
      )[0];
    }
  });
  /**
   *  按照key找到对应的节点
   **/
  let result = null;
  function getTreeItemByKey(data: any[], keyName: string, value?: string | number): any {
    data.map((item) => {
      if (item[keyName] === value) {
        result = item;
      } else {
        if (item.children && item.children.length) {
          getTreeItemByKey(item.children, keyName, value);
        }
      }
    });
    return result;
  }

  /**
   *  应用-按照key把所有加入数组里面
   **/
  let result1: any = [];
  function getTreeItemByKeyAll(data: any[], key1Name: string, key2Name: string) {
    data.forEach((item) => {
      if (item.permCodeList && item.permCodeList.length) {
        item.permCodeList.forEach((item1) => {
          item.permCodeCheck.push(item1[key2Name]);
          item.permCodeCheck = Array.from(new Set(item.permCodeCheck));
          if (!item1.dataPermCheck) {
            item1.dataPermCheck = defaultDataPermId.value;
          }
        });
      }
      result1.push(item[key1Name]);
      if (item.children && item.children.length) {
        getTreeItemByKeyAll(item.children, key1Name, key2Name);
      }
    });
    return Array.from(new Set(result1));
  }

  /**
   *  菜单-按照key把所有加入数组里面
   **/
  function getTreeItemByKeyAll1(
    data: any[],
    key1Name: string,
    key2Name: string,
    key1Value: string
  ) {
    data.forEach((item) => {
      if (item[key1Name] === key1Value) {
        if (item.permCodeList && item.permCodeList.length) {
          item.permCodeList.forEach((item1) => {
            item.permCodeCheck.push(item1[key2Name]);
            item.permCodeCheck = Array.from(new Set(item.permCodeCheck));
            if (!item1.dataPermCheck) {
              item1.dataPermCheck = defaultDataPermId.value;
            }
          });
        }
      }
      if (item.children && item.children.length) {
        getTreeItemByKeyAll1(item.children, key1Name, key2Name, key1Value);
      }
    });
  }

  /**
   *  权限字-按照key把所有加入数组里面
   **/
  function getTreeItemByKeyAll2(data: any[], key1Name: string, key1Value: string) {
    data.forEach((item) => {
      if (item.permCodeList && item.permCodeList.length) {
        item.permCodeList.forEach((item1) => {
          if (item1[key1Name] === key1Value) {
            console.log('dataPermCheck>>>>>>', item1);
            // if (!item1.dataPermCheck) {
            //   item1.dataPermCheck = defaultDataPermId.value;
            // }
          }
        });
      }
      if (item.children && item.children.length) {
        getTreeItemByKeyAll2(item.children, key1Name, key1Value);
      }
    });
  }

  /**
   *  数据权限-按照key把所有加入数组里面
   **/
  function getTreeItemByKeyAll3(
    data: any[],
    key1Name: string,
    key1Value: string,
    key2Name: string,
    key2Value: string,
    key3Name: string,
    key3Value: string
  ) {
    data.forEach((item) => {
      if (item[key1Name] === key1Value) {
        if (item.permCodeList && item.permCodeList.length) {
          item.permCodeList.forEach((item1) => {
            if (item1[key2Name] === key2Value) {
              item1.dataPermList.forEach((item2) => {
                if (item2[key3Name] === key3Value) {
                  item.permCodeCheck.push(item1[key2Name]);
                  item.permCodeCheck = Array.from(new Set(item.permCodeCheck));
                }
              });
            }
          });
        }
      }
      if (item.children && item.children.length) {
        getTreeItemByKeyAll3(
          item.children,
          key1Name,
          key1Value,
          key2Name,
          key2Value,
          key3Name,
          key3Value
        );
      }
    });
  }

  // 应用选中方法
  function appIdSelectChange() {
    isAppCheckChange.value = true;
  }
  // 获取菜单树列表
  function getMenuTreeList(index, appId) {
    appIndex.value = index;
    selectmenuKey.value = [];
    permCodeIndex.value = null;

    // 应用复选框选择
    if (isAppCheckChange.value) {
      // 应用选中置空
      totalAppList.value[appIndex.value].menuCheck = [];
      checkboxBlank(totalAppList.value[appIndex.value].menu);
      if (appIdSelectList.value.includes(appId)) {
        // 全选
        totalAppList.value[appIndex.value].menuCheck = getTreeItemByKeyAll(
          totalAppList.value[appIndex.value].menu,
          'menuId',
          'permCodeId'
        );
        result1 = [];
      }

      isAppCheckChange.value = false;
    }
  }
  // 获取树菜单选中
  function getPermCodeList(key) {
    selectmenuKey.value = key;
    permCodeIndex.value = null;
  }

  // 菜单树复选框选中
  function menuCheckedChange(key, option, meta) {
    console.log(key, option);
    if (meta.action === 'check') {
      totalAppList.value[appIndex.value].menuCheck = totalAppList.value[
        appIndex.value
      ].menuCheck.concat([...getAllMenuIds(meta.node), ...meta.node.parentMenuIds]);
      totalAppList.value[appIndex.value].menuCheck = Array.from(
        new Set(totalAppList.value[appIndex.value].menuCheck)
      );
      for (let i = 0; i < getAllMenuIds(meta.node).length; i++) {
        getTreeItemByKeyAll1(
          totalAppList.value[appIndex.value].menu,
          'menuId',
          'permCodeId',
          getAllMenuIds(meta.node)[i]
        );
      }
    } else {
      totalAppList.value[appIndex.value].menuCheck = totalAppList.value[
        appIndex.value
      ].menuCheck.filter((item) => !getAllMenuIds(meta.node).includes(item));
      for (let i = 0; i < getAllMenuIds(meta.node).length; i++) {
        checkboxBlank1(
          totalAppList.value[appIndex.value].menu,
          'menuId',
          getAllMenuIds(meta.node)[i]
        );
      }
    }
    // 判断应用是否全选
    isAppAllCheked();
  }

  // 获取menuId
  function getAllMenuIds(obj) {
    let menuIds: string[] = [];
    // 处理当前节点的id
    menuIds.push(obj.menuId);
    // 递归处理子节点的id
    if (obj.children && obj.children.length > 0) {
      for (const child of obj.children) {
        menuIds = menuIds.concat(getAllMenuIds(child));
      }
    }

    return menuIds;
  }

  //权限字选中方法
  function permCodeIdSelectChange() {}
  // 获取数据权限列表
  function getDataPermList(index) {
    permCodeIndex.value = index;
    for (let i = 0; i < permCodeObj.value.permCodeCheck.length; i++) {
      getTreeItemByKeyAll2(
        totalAppList.value[appIndex.value].menu,
        'permCodeId',
        permCodeObj.value.permCodeCheck[i]
      );
    }
  }
  // 数据权限选中方法
  function dataPermIdSelectChange(dataPermId) {
    permCodeObj.value.permCodeList[permCodeIndex.value].deptIdJSON = '';
    permCodeObj.value.permCodeList[permCodeIndex.value].userIdJSON = '';
    getTreeItemByKeyAll3(
      totalAppList.value[appIndex.value].menu,
      'menuId',
      selectmenuKey.value[0],
      'permCodeId',
      permCodeObj.value.permCodeList[permCodeIndex.value].permCodeId,
      'dataPermId',
      dataPermId
    );
  }

  // 应用复选框置空
  function checkboxBlank(data: any[]) {
    data.forEach((item) => {
      item.permCodeCheck = [];
      if (item.children && item.children.length) {
        checkboxBlank(item.children);
      }
    });
  }

  // 菜单复选框置空
  function checkboxBlank1(data: any[], key1Name: string, key1Value: string) {
    data.forEach((item) => {
      if (item[key1Name] === key1Value) {
        item.permCodeCheck = [];
      }
      if (item.children && item.children.length) {
        checkboxBlank1(item.children, key1Name, key1Value);
      }
    });
  }

  // 判断应用是否全选
  function isAppAllCheked() {
    if (
      totalAppList.value[appIndex.value].menuCheck.length ===
      totalAppList.value[appIndex.value].menuNum
    ) {
      appIdSelectList.value.push(totalAppList.value[appIndex.value].appId);
    } else {
      if (
        appIdSelectList.value.length > 0 &&
        appIdSelectList.value.includes(totalAppList.value[appIndex.value].appId)
      ) {
        appIdSelectList.value = appIdSelectList.value.filter(
          (item) => item !== totalAppList.value[appIndex.value].appId
        );
      }
    }
  }
  // 节点后缀
  function renderSuffix(item) {
    if (item.option.menuType === 1 || item.option.menuType === 2) {
      if (item.option.permCodeCheck.length) {
        return h('div', { class: 'flex flex-row items-end' }, [
          h(NIcon, { component: LinkOutlined, size: 20, color: '#2d8cf0' }),
          h(
            'span',
            { style: { color: '#2d8cf0', fontSize: '12px', lineHeight: '12px' } },
            { default: () => `${item.option.permCodeCheck.length}` }
          ),
        ]);
      }
    }
  }
  // 打开选岗位部门弹窗
  function openSelectModal() {
    selectModalRef.value.openModal();
  }
  //部门岗位弹窗确定
  function selectModalOk(selectList) {
    permCodeObj.value.permCodeList[permCodeIndex.value].deptIdJSON = selectModalOkStr(
      permCodeObj.value.permCodeList[permCodeIndex.value].deptIdJSON,
      selectList
    );
    permCodeObj.value.permCodeList[permCodeIndex.value].userIdJSON = selectModalOkStr(
      permCodeObj.value.permCodeList[permCodeIndex.value].userIdJSON,
      selectList
    );
  }
  //部门岗位删除
  function deptPostClose(data) {
    permCodeObj.value.permCodeList[permCodeIndex.value].deptIdJSON = selectModalCloseStr(
      permCodeObj.value.permCodeList[permCodeIndex.value].deptIdJSON,
      data
    );
    permCodeObj.value.permCodeList[permCodeIndex.value].userIdJSON = selectModalCloseStr(
      permCodeObj.value.permCodeList[permCodeIndex.value].userIdJSON,
      data
    );
  }

  // 新增编辑角色
  function addEditRole() {
    let checkMenuList: any = [];
    let checkPermList: any = [];
    //获取菜单列表
    totalAppList.value.map((item) => {
      item.menuCheck.map((item2) => {
        checkMenuList.push(getTreeItemByKey(item.menu, 'menuId', item2));
      });
    });
    console.log('checkMenuList>>>>>>', checkMenuList);
    if (!form.value.roleName)
      return window['$message'].error(I18n.global.t('qingTianXieJiaoSeMingCheng'));
    if (!checkMenuList.length) return window['$message'].error(I18n.global.t('qingXuanZeCaiDan'));
    checkMenuList.map((item) => {
      if (item.permCodeCheck.length) {
        item.permCodeCheck.map((item1) => {
          item.permCodeList.map((item2) => {
            if (item1 === item2.permCodeId) {
              checkPermList.push({
                appId: item.appId,
                menuId: item.menuId,
                permCodeId: item1,
                dataPermId: item2.dataPermCheck,
                deptIdJSON: item2.deptIdJSON,
                userIdJSON: item2.userIdJSON,
              });
            }
          });
        });
      } else {
        checkPermList.push({
          appId: item.appId,
          menuId: item.menuId,
        });
      }
    });
    console.log('checkPermList>>>>>', checkPermList);
    if (roleId.value) {
      updateSysRole({
        sysRoleDto: {
          roleId: roleId.value,
          roleName: form.value.roleName,
          rolePermDtoList: checkPermList,
        },
      }).then(() => {
        window['$message'].success(I18n.global.t('xiuGaiChengGong'));
        router.go(-1);
      });
    } else {
      addSysRole({
        sysRoleDto: {
          roleName: form.value.roleName,
          rolePermDtoList: checkPermList,
        },
      }).then(() => {
        window['$message'].success(I18n.global.t('xinZengChengGong'));
        router.go(-1);
      });
    }
  }

  //

  onMounted(() => {
    roleId.value = route.query.roleId || null;
    getAppAllList();
  });
</script>
<style lang="less" scoped>
  .app-box {
    min-width: 360px;
    min-height: 180px;
  }
  .app-item {
    padding-left: 10px;
    &:hover {
      background-color: v-bind(cssHoverColor);
    }
  }
  .menu-box {
    min-width: 360px;
    min-height: 180px;
  }
  .permCode-box {
    min-width: 360px;
    min-height: 180px;
  }
  .permCode-item {
    padding-left: 10px;
  }
  .permCode-item {
    padding-left: 10px;
    &:hover {
      background-color: v-bind(cssHoverColor);
    }
  }
  .dataPerm-box {
    min-width: 360px;
    min-height: 180px;
  }
  .dataPerm-item {
    padding-left: 10px;
  }

  :deep(.n-divider) {
    font-size: 14px;
    font-weight: 400;
  }
  :deep(.n-divider .n-divider__title) {
    font-weight: 500;
  }
  :deep(.n-divider:not(.n-divider--vertical)) {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .tags-box {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
  }
  // 大于1707px
  // @media (min-width: 1717px) {
  //   .app-box,
  //   .menu-box,
  //   .permCode-box {
  //     margin-right: 1.25rem;
  //   }
  // }
  // 小于1707px 大于1368px
  // @media (max-width: 1717px) and (min-width: 1368px) {
  //   .app-box,
  //   .menu-box {
  //     margin-right: 1.25rem;
  //   }
  //   .permCode-box {
  //     margin-right: 0;
  //   }
  //   .dataPerm-box {
  //     margin-top: 1.5rem;
  //   }
  // }

  // 小于1368px 大于968px
  // @media (max-width: 1368px) and (min-width: 968px) {
  //   .app-box,
  //   .permCode-box {
  //     margin-right: 1.25rem;
  //   }
  //   .menu-box .dataPerm-box {
  //     margin-right: 0;
  //   }
  //   .permCode-box,
  //   .dataPerm-box {
  //     margin-top: 1.5rem;
  //   }
  // }

  // 小于968px
  // @media (max-width: 968px) {
  //   .menu-box,
  //   .permCode-box,
  //   .dataPerm-box {
  //     margin-right: 1.25rem;
  //     margin-top: 1.5rem;
  //   }
  //   .app-box,
  //   .menu-box,
  //   .permCode-box,
  //   .dataPerm-box {
  //     margin-right: 0;
  //   }
  // }
</style>
