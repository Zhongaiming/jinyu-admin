<template>
  <div>
    <n-grid :x-gap="24" :y-gap="24" cols="1 s:1 m:1 l:5 xl:5 2xl:5" responsive="screen">
      <n-gi span="1">
        <n-card :bordered="false" size="small" class="pro-card">
          <n-thing
            class="thing-cell"
            v-for="item in typeTabList"
            :key="item.key"
            :class="{ 'thing-cell-on': type === item.key }"
            @click="switchType(item)"
          >
            <template #header>{{ item.name }}</template>
            <template #description>{{ item.desc }}</template>
          </n-thing>
        </n-card>
      </n-gi>
      <n-gi span="4">
        <n-card :bordered="false" size="small" :title="typeTitle" class="pro-card">
          <template v-if="type === 1">
            <BasicForm @register="baseSubmitRegister" @submit="baseConfirmForm" />
          </template>
          <template v-else>
            <n-list>
              <n-list-item>
                <template #suffix>
                  <n-button type="primary" text @click="pasModalRef.openModal()">{{
                    $t('xiuGai')
                  }}</n-button>
                </template>
                <n-thing :title="$t('zhangHuMiMa')">
                  <template #description
                    ><span class="text-gray-400">{{
                      $t('bangDingShouJiHeYouXiangBingSheZhiMiMaZhangHaoGengAnQuan')
                    }}</span></template
                  >
                </n-thing>
                <BasicModal ref="pasModalRef" :title="$t('xiuGaiMiMa')">
                  <div class="mt-5">
                    <BasicForm @register="pawSubmitRegister" @submit="pawConfirmForm" />
                  </div>
                </BasicModal>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button type="primary" text @click="showPhoneDig">{{
                    phone ? $t('xiuGai') : $t('bangDing')
                  }}</n-button>
                </template>
                <n-thing :title="$t('bangDingShouJi')">
                  <template #description
                    ><span class="text-gray-400">
                      {{ $t('yiBangDingShouJiHao') }}：{{
                        phone ? geTel(phone) : $t('zanWuBangDing')
                      }}
                    </span></template
                  >
                  <BasicModal ref="phoneModalRef" :title="$t('xiuGaiShouJiHao')">
                    <div class="mt-5">
                      <BasicForm @register="phoneSubmitRegister" @submit="phoneConfirmForm" />
                    </div>
                  </BasicModal>
                </n-thing>
              </n-list-item>
            </n-list>
          </template>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form/index';
  import { BasicModal } from '@/components/Modal/index';
  import {
    getSysUserView,
    updateBasicInformation,
    updateUserPhone,
  } from '@/api/System/setting/user';
  import { changePassword } from '@/api/Public/login';
  import { useUserStore } from '@/store/modules/user';
  import { encrypt, geTel } from '@/utils';
  import { strTrim } from '@/utils/check';
  import { cssConvert } from '@/hooks/useThemeVars';
  import I18n from '@/lang/index'; //引入i18n组件
  const cssHoverColor = ref(cssConvert('hoverColor', 1));
  const cssPrimaryBgColor = cssConvert('primaryColor', 0.05);
  const cssPrimaryColor = cssConvert('primaryColor', 1);
  const typeTabList = [
    {
      name: I18n.global.t('jiBenSheZhi'),
      desc: I18n.global.t('touXiangYongHuMingYouXiangDengSheZhi'),
      key: 1,
    },
    {
      name: I18n.global.t('anQuanSheZhi'),
      desc: I18n.global.t('miMaShouJiHaoMaDengSheZhi'),
      key: 2,
    },
  ];
  const type = ref(1);
  const typeTitle = ref(I18n.global.t('jiBenSheZhi'));
  const userStore = useUserStore();
  // 手机号码
  const phone = computed(() => userStore.info?.phone ?? '');
  // 修改密码弹窗实例
  const pasModalRef: any = ref();
  // 修改手机号码弹窗实例
  const phoneModalRef: any = ref();
  // 提交基本信息Form配置
  const baseSubmitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'headImageUrl',
      component: 'BasicUpload',
      label: I18n.global.t('yongHuTouXiang'),
      isShow: true,
      componentProps: {
        action: '/common/upload/upload',
        data: { asImage: true },
        name: 'uploadFile',
        width: 100,
        height: 100,
        max: 1,
        helpText: '',
      },
    },
    {
      field: 'showName',
      component: 'NInput',
      label: I18n.global.t('yongHuXianShiMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYongHuXianShiMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur'],
          message: I18n.global.t('yongHuXianShiMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'email',
      component: 'NInput',
      label: I18n.global.t('youXiangDiZhi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYouXiangDiZhi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          validator: (rule, value: string) => {
            console.log(rule);
            if (!value) {
              return new Error(I18n.global.t('youXiangDiZhiBuNengWeiKong'));
            }
            let rulesTest =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                value
              );
            if (!rulesTest) {
              return new Error(I18n.global.t('youXiangDiZhiGeShiBuZhengQue'));
            }
          },
        },
      ],
    },
  ]);

  const [baseSubmitRegister, { setFieldsValue: setBaseSubmitFieldsValue }] = useForm({
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

  // 修改密码
  const pawSubmitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'oldPass',
      component: 'NInput',
      label: I18n.global.t('jiuMiMa'),
      isShow: true,
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: I18n.global.t('qingShuRuJiuMiMa'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'password-input'],
          message: I18n.global.t('jiuMiMaBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'newPass',
      component: 'NInput',
      label: I18n.global.t('xinMiMa'),
      isShow: true,
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: I18n.global.t('qingShuRuXinMiMa'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'password-input'],
          message: I18n.global.t('xinMiMaBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'rePassword',
      component: 'NInput',
      label: I18n.global.t('zaiCiShuRuXinMiMa'),
      isShow: true,
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: I18n.global.t('qingZaiCiShuRuXinMiMa'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          validator: (rule: any, value: string) => {
            console.log(rule);
            if (getPawSubmitFieldsValue() && getPawSubmitFieldsValue().newPass) {
              return value === getPawSubmitFieldsValue().newPass;
            } else {
              return false;
            }
          },
          trigger: ['blur', 'password-input'],
          message: I18n.global.t('xinMiMaShuRuBuYiZhi'),
        },
      ],
    },
  ]);

  const [pawSubmitRegister, { getFieldsValue: getPawSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 150,
    labelPlacement: 'top',
    layout: 'horizontal',
    schemas: pawSubmitSchemas,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        pasModalRef.value.closeModal();
      });
    },
  });

  function showPhoneDig() {
    phoneModalRef.value.openModal();
  }

  // 修改手机号
  const phoneSubmitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'phone',
      component: 'NInput',
      label: I18n.global.t('shouJiHaoMa'),
      isShow: true,
      defaultValue: phone.value,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuShouJiHaoMa'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          validator: (rule, value: string) => {
            console.log(rule);
            if (!value) {
              return new Error(I18n.global.t('shouJiHaoMaBuNengWeiKong'));
            }
            let rulesTest = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value);
            if (!rulesTest) {
              return new Error(I18n.global.t('shouJiHaoMaGeShiBuZhengQue'));
            }
          },
        },
      ],
    },
  ]);

  const [phoneSubmitRegister] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 90,
    labelPlacement: 'top',
    layout: 'horizontal',
    schemas: phoneSubmitSchemas,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        phoneModalRef.value.closeModal();
      });
    },
  });

  // 修改个人信息提交
  function baseConfirmForm(form) {
    if (form) {
      console.log(form, phone);
      updateBasicInformation({
        sysUserBasicInformationDto: {
          userId: userStore.info.userId,
          ...form,
        },
      }).then(() => {
        window['$message'].success(I18n.global.t('gengXinChengGong'));
        getUserInfo(true);
      });
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
  // 修改密码提交
  function pawConfirmForm(form) {
    if (form) {
      changePassword({
        oldPass: encrypt(strTrim(form.oldPass)) as any,
        newPass: encrypt(strTrim(form.newPass)) as any,
      }).then(() => {
        window['$message'].success(I18n.global.t('xiuGaiChengGong'));
        pasModalRef.value.closeModal();
        getUserInfo(true);
      });
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
  // 修改手机号提交
  function phoneConfirmForm(form) {
    if (form) {
      updateUserPhone({
        userId: userStore.info.userId,
        ...form,
      }).then(() => {
        window['$message'].success(I18n.global.t('gengXinChengGong'));
        getUserInfo(true);
        phoneModalRef.value.closeModal();
      });
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
  // 获取用户信息方法
  function getUserInfo(isUpdate = false) {
    getSysUserView({ userId: userStore.info.userId }).then((res) => {
      setBaseSubmitFieldsValue({
        headImageUrl: res.headImageUrl,
        showName: res.showName,
        email: res.email,
      });
      if (isUpdate) {
        userStore.setUserInfo(res);
      }
    });
  }
  // 却换侧边栏
  function switchType(e) {
    type.value = e.key;
    typeTitle.value = e.name;
    if (type.value === 1) {
      getUserInfo();
    }
  }

  onMounted(() => {
    getUserInfo();
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
