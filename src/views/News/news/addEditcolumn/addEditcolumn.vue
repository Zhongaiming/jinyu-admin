<template>
  <n-card :bordered="false" class="pro-card">
    <div class="page-close-box" @click="router.go(-1)">
      <div>
        <n-icon size="20">
          <Close />
        </n-icon>
      </div>
    </div>
    <n-grid y-gap="20" x-gap="20" cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen">
      <n-gi>
        <n-card :title="title" class="user-info">
          <BasicForm @register="submitRegister" @submit="confirmForm" />
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script lang="ts" setup>
  import {
    getCmsSectionView,
    addCmsSection,
    updateCmsSection,
    cmsSectionDictList,
  } from '@/api/News/news/columnManage';
  import { transformDataSource, treeDataTranslate } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { useDict } from '@/utils/dict';
  import { Close } from '@vicons/carbon';
  import I18n from '@/lang/index'; //引入i18n组件
  const cssPrimaryColor = ref(cssConvert('primaryColor', 1));
  const router = useRouter();
  const route = useRoute();
  // 获取字典
  const { section_type } = useDict('section_type');
  //栏目id(编辑需要)
  const sectionId: any = ref(null);
  const parentId: any = ref(null);
  const title = ref('');
  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'title',
      component: 'NInput',
      label: I18n.global.t('lanMuMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuLanMuMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('lanMuMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'parentId',
      component: 'NCascader',
      label: I18n.global.t('suoShuLanMu'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeSuoShuLanMu'),
        options: [],
        labelField: 'name',
        valueField: 'id',
        clearable: true,
        showPath: true,
        filterable: true,
        onUpdateValue: (value: any) => {
          console.log(value);
        },
      },
    },
    {
      field: 'type',
      component: 'NRadioGroup',
      label: I18n.global.t('leiXing'),
      isShow: true,
      defaultValue: '1',
      componentProps: {
        options: section_type,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'isShow',
      component: 'NRadioGroup',
      label: I18n.global.t('shiFouXianShi'),
      isShow: true,
      defaultValue: 1,
      componentProps: {
        options: [
          {
            label: I18n.global.t('shi'),
            value: 1,
          },
          {
            label: I18n.global.t('fou'),
            value: 2,
          },
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'showOrder',
      component: 'NInputNumber',
      label: I18n.global.t('paiXu'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuPaiXu'),
        min: 1,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 150,
    labelPlacement: 'top',
    layout: 'horizontal',
    schemas: submitSchemas,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('zhongZhi'),
    submitClassName: 'primary-button',
  });

  // From提交
  function confirmForm(form) {
    if (form) {
      if (sectionId.value != null) {
        updateCmsSection({
          cmsSectionDto: { sectionId: sectionId.value, ...form },
        }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          router.go(-1);
        });
      } else {
        addCmsSection({
          cmsSectionDto: form,
        }).then(() => {
          window['$message'].success(I18n.global.t('tianJiaChengGong'));
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  // 获取栏目信息方法
  function getColumnInfo(sectionId) {
    getCmsSectionView({ sectionId }).then((res) => {
      setSubmitFieldsValue(res);
    });
  }
  // 获取所属栏目字典值
  const getColumnDictData = async () => {
    transformDataSource(submitSchemas, [
      {
        key: 'parentId',
        values: [
          {
            changeKey: 'componentProps.options',
            changeValue: treeDataTranslate(await cmsSectionDictList({}), 'id', 'parentId'),
          },
        ],
      },
    ]);
    if (parentId.value) {
      setSubmitFieldsValue({ parentId: parentId.value, type: '1' });
    }
  };
  onMounted(() => {
    sectionId.value = route.query.sectionId || null;
    parentId.value = route.query.parentId || null;
    title.value = sectionId.value ? I18n.global.t('bianJiLanMu') : I18n.global.t('xinZengLanMu');
    getColumnDictData();
    if (sectionId.value) {
      getColumnInfo(sectionId.value);
    }
  });
</script>

<style lang="less" scoped>
  .pro-card {
    position: relative;
    :deep(.n-card__content) {
      padding: 30px 20px !important;
    }
  }
  .user-info {
    :deep(.n-card__content) {
      padding-top: 0px !important;
    }
  }

  .page-close-box {
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
    border-width: 22px;
    border-style: dashed;
    border-color: v-bind(cssPrimaryColor) v-bind(cssPrimaryColor) transparent transparent; // 上 右 下 左
    text-align: center;
    color: #ffffff;
    div {
      position: relative;
      top: -17px;
      left: -2px;
    }
  }
</style>
