<template>
  <div>
    <n-grid :x-gap="24" :y-gap="24" cols="1 s:1 m:1 l:5 xl:5 2xl:5" responsive="screen">
      <n-gi span="1">
        <div class="group-box">
          <n-card :bordered="false" size="small" class="pro-card">
            <n-thing
              class="thing-cell"
              v-for="item in groupList"
              :key="item.configGroupId"
              :class="{ 'thing-cell-on': configGroupId === item.configGroupId }"
              @click="switchType(item)"
            >
              <template #header>{{ item.title }}</template>
              <!-- <template #description>{{ item.desc }}</template> -->
            </n-thing>
          </n-card>
        </div>
      </n-gi>
      <n-gi span="4">
        <n-card :bordered="false" size="small" :title="typeTitle" class="config-box">
          <BasicForm
            @register="baseSubmitRegister"
            @submit="baseConfirmForm"
            v-if="baseSubmitSchemas.length > 0"
          />
          <div class="h-40 flex justify-center items-center" v-if="baseSubmitSchemas.length == 0">
            <n-empty description="暂无内容" />
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import {
    getSysConfigGroupList,
    getListSysConfigById,
    updateSysConfig,
  } from '@/api/System/setting/config';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { cssConvert } from '@/hooks/useThemeVars';
  import I18n from '@/lang/index'; //引入i18n组件
  const cssHoverColor = ref(cssConvert('hoverColor', 1));
  const cssPrimaryBgColor = cssConvert('primaryColor', 0.05);
  const cssPrimaryColor = cssConvert('primaryColor', 1);
  // 分组列表
  const groupList: any = ref([]);
  const configGroupId = ref('');
  const typeTitle = ref('');

  // 提交基本信息Form配置（分组配置列表）
  const baseSubmitSchemas: Ref<FormSchema[]> = ref([]);

  const baseSubmitFormConfig = ref({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 150,
    labelPlacement: 'top',
    layout: 'horizontal',
    schemas: baseSubmitSchemas,
    submitButtonText: I18n.global.t('gengXin'),
    resetButtonText: I18n.global.t('zhongZhi'),
    submitClassName: 'primary-button',
  });
  const [baseSubmitRegister] = useForm(baseSubmitFormConfig.value);

  // 却换系统配置分组
  function switchType(e) {
    configGroupId.value = e.configGroupId;
    typeTitle.value = e.title;
    getGroupListConfig(configGroupId.value);
  }

  // 获取分组列表
  function getConfigGroup() {
    getSysConfigGroupList({ pageParam: { pageNum: 1, pageSize: 9999 } }).then((res) => {
      groupList.value = res.dataList;
      configGroupId.value = groupList.value[0].configGroupId;
      typeTitle.value = groupList.value[0].title;
      getGroupListConfig(configGroupId.value);
    });
  }

  //获取分组配置列表
  function getGroupListConfig(configGroupId) {
    getListSysConfigById({ configGroupId }).then((res) => {
      baseSubmitSchemas.value = JSON.parse(res.component_json);
    });
  }

  // 更新配置项
  function baseConfirmForm(form) {
    if (form) {
      updateSysConfig({
        configGroupId: configGroupId.value,
        configData: { ...form },
      }).then(() => {
        window['$message'].success(I18n.global.t('gengXinChengGong'));
        getGroupListConfig(configGroupId.value);
      });
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
  onMounted(() => {
    getConfigGroup();
  });
</script>
<style lang="less" scoped>
  .thing-cell {
    margin: 0 -16px 10px;
    padding: 5px 16px;
    &:hover {
      background: v-bind(cssHoverColor);
      cursor: pointer;
    }
  }
  .group-box {
    max-height: calc(100vh - 120px);
    overflow: auto;
  }
  .group-box::-webkit-scrollbar {
    width: 5px;
  }
  .group-box::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .group-box::-webkit-scrollbar-thumb {
    background: #ffffff;
  }
  .config-box {
    min-height: 200px;
  }
  :deep(.thing-cell:last-child) {
    margin-bottom: 0;
  }
  .thing-cell-on {
    background: v-bind(cssPrimaryBgColor);
    color: v-bind(cssPrimaryColor);

    ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
      color: v-bind(cssPrimaryColor);
    }

    &:hover {
      background: v-bind(cssHoverColor);
    }
  }
</style>
