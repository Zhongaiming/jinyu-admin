<template>
  <n-card :bordered="false" class="pro-card">
    <n-grid y-gap="20" x-gap="20" cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
      <n-gi>
        <n-card :title="title" class="user-info">
          <BasicForm @register="submitRegister" @submit="confirmForm">
            <template #deptPostSlot="{ model, field }">
              <div class="flex flex-wrap tags-box items-center">
                <n-tag
                  closable
                  @close="deptPostClose(item)"
                  v-for="item in model[field] && JSON.parse(model[field])"
                  :key="item.value"
                  class="ml-3 mt-3"
                  type="primary"
                >
                  {{ item.label }}
                </n-tag>
                <n-button
                  @click="openSelectModal"
                  type="primary"
                  size="small"
                  dashed
                  class="ml-3 mt-3"
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
                :title="$t('xuanZeBuMenGangWei')"
                type="DeptPost"
                width="800px"
                @on-ok="selectModalOk"
              />
            </template>
          </BasicForm>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :title="$t('shouQuanYingYong')" class="power-info">
          <div class="app-info-item" v-for="(item, index) in appInfoList" :key="item.appId">
            <div class="flex items-center">
              <BasicImage
                width="40"
                height="40"
                round
                :src="item.svg"
                :other="{ previewDisabled: true }"
              />
              <span class="ml-2 font-medium">{{ item.title }}</span>
            </div>
            <n-divider title-placement="left"> {{ $t('shuJuQuanXian') }} </n-divider>
            <div class="flex flex-wrap tags-box items-center">
              <n-tag
                v-for="tag in item.dataPermList"
                :key="tag.id"
                type="primary"
                class="ml-3 mt-3"
              >
                <template #icon>
                  <n-icon size="16">
                    <TwoFactorAuthentication />
                  </n-icon>
                </template>
                {{ tag.dataPermName }}
              </n-tag>
            </div>
            <div class="mt-2 text-center" v-if="!item.dataPermList">
              {{ $t('zanWuQuanXian') }}
            </div>
            <n-divider v-if="index + 1 !== appInfoList.length" />
          </div>
        </n-card>
        <n-card :title="$t('moRenTiaoZhuanYingYong')" class="power-info" v-if="appInfoList?.length">
          <n-select
            v-model:value="defaultAppId"
            :options="appInfoList"
            filterable
            value-field="appId"
            label-field="title"
            :placeholder="$t('qingXuanZeMoRenTiaoZhuanDeYingYong')"
          />
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script lang="ts" setup>
  import { getSysUserView, addSysUser, updateSysUser } from '@/api/System/setting/user';
  import { getAppInfoByRoleId } from '@/api/System/setting/application';
  import { useDict } from '@/utils/dict';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { SelectModal } from '@/components/SelectModal/index';
  import { encrypt, selectModalOkStr, selectModalCloseStr, transformDataSource } from '@/utils';
  import { strTrim } from '@/utils/check';
  import { PlusOutlined } from '@vicons/antd';
  import { TwoFactorAuthentication } from '@vicons/carbon';
  import type { SelectRenderTag } from 'naive-ui';
  import { NTag } from 'naive-ui';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { user_status, user_type, sys_role_list } = useDict(
    'user_status',
    'user_type',
    'sys_role_list'
  );
  // 选择弹窗实例
  const selectModalRef: any = ref();
  const router = useRouter();
  const route = useRoute();
  //用户id(编辑需要)
  const userId: any = ref(null);
  const defaultAppId = ref('');
  const title = ref('');
  // 授权应用
  const appInfoList: any = ref([]);
  // Select多选tag样式
  const renderSelectTag: SelectRenderTag = ({ option, handleClose }) => {
    return h(
      NTag,
      {
        type: 'primary',
        closable: true,
        onClose: (e: MouseEvent) => {
          e.stopPropagation();
          handleClose();
        },
      },
      { default: () => option.label ?? '' }
    );
  };
  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'loginName',
      component: 'NInput',
      label: I18n.global.t('dengLuMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuDengLuMingCheng'),
        disabled: false,
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('yongHuDengLuMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'password',
      component: 'NInput',
      label: I18n.global.t('dengLuMiMa'),
      isShow: true,
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: I18n.global.t('qingShuRuDengLuMiMa'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'password-input'],
          message: I18n.global.t('yongHuDengLuMiMaBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'rePassword',
      component: 'NInput',
      label: I18n.global.t('zaiCiShuRuMiMa'),
      isShow: true,
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: I18n.global.t('qingZaiCiShuRuDengLuMiMa'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          validator: (rule: any, value: string) => {
            console.log(rule);
            if (getSubmitFieldsValue() && getSubmitFieldsValue().password) {
              return value === getSubmitFieldsValue().password;
            } else {
              return false;
            }
          },
          trigger: ['blur', 'password-input'],
          message: I18n.global.t('liangCiMiMaShuRuBuYiZhi'),
        },
      ],
    },
    {
      field: 'showName',
      component: 'NInput',
      label: I18n.global.t('yongHuNiCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYongHuNiCheng'),
        disabled: false,
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('yongHuNiChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'roleIdSet',
      component: 'NSelect',
      label: I18n.global.t('yongHuJiaoSe'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeYongHuJiaoSe'),
        options: sys_role_list,
        renderTag: renderSelectTag,
        filterable: true,
        multiple: true,
        clearable: true,
        onUpdateValue: (roleIds: any) => {
          getAppInfoList(roleIds);
        },
      },
      rules: [
        {
          required: true,
          type: 'array',
          trigger: 'change',
          message: I18n.global.t('yongHuJiaoSeBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'userType',
      component: 'NSelect',
      label: I18n.global.t('zhangHaoLeiXing'),
      isShow: true,
      defaultValue: '2',
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeZhangHaoLeiXing'),
        options: user_type,
        filterable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'deptPostJson',
      label: I18n.global.t('buMenGangWei'),
      isShow: true,
      slot: 'deptPostSlot',
    },
    {
      field: 'userStatus',
      component: 'NRadioGroup',
      label: I18n.global.t('yongHuZhuangTai'),
      isShow: false,
      defaultValue: '0',
      componentProps: {
        options: user_status,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
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
  ]);

  const [
    submitRegister,
    { getFieldsValue: getSubmitFieldsValue, setFieldsValue: setSubmitFieldsValue },
  ] = useForm({
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
      if (userId.value != null) {
        window['$dialog'].info({
          title: I18n.global.t('bianJiYongHu'),
          content: I18n.global.t('xiuGaiDeBuFenXinXiJiangDaoZhiShuJuZhongZhiQueRenBianJi'),
          positiveText: I18n.global.t('queDing'),
          negativeText: I18n.global.t('quXiao'),
          onPositiveClick: () => {
            updateSysUser({
              sysUserDto: { userId: userId.value, ...form },
              roleIdSet: form.roleIdSet,
              deptPostJson: form.deptPostJson,
              defaultAppId: defaultAppId.value,
            }).then(() => {
              window['$message'].success(I18n.global.t('bianJiChengGong'));
              router.go(-1);
            });
          },
          onNegativeClick: () => {
            console.log('取消');
          },
        });
      } else {
        let password = form.password;
        form.password = encrypt(strTrim(password)) as any;
        form.rePassword = encrypt(strTrim(password)) as any;
        addSysUser({
          sysUserDto: form,
          roleIdSet: form.roleIdSet,
          deptPostJson: form.deptPostJson,
        }).then(() => {
          window['$message'].success(I18n.global.t('tianJiaChengGong'));
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  // 获取用户信息方法
  function getUserInfo(userId) {
    getSysUserView({ userId }).then((res) => {
      setSubmitFieldsValue(res);
      getAppInfoList(res.roleIdSet);
    });
  }
  // 打开选岗位部门弹窗
  function openSelectModal() {
    selectModalRef.value.openModal();
  }
  //部门岗位弹窗确定
  function selectModalOk(selectList) {
    setSubmitFieldsValue({
      deptPostJson: selectModalOkStr(getSubmitFieldsValue().deptPostJson, selectList),
    });
  }
  //部门岗位删除
  function deptPostClose(data) {
    setSubmitFieldsValue({
      deptPostJson: selectModalCloseStr(getSubmitFieldsValue().deptPostJson, data),
    });
  }
  // 通过角色id获取应用信息
  function getAppInfoList(roleIds) {
    getAppInfoByRoleId({ roleIds }).then((res) => {
      appInfoList.value = res;
      if (!defaultAppId.value && appInfoList.value?.length > 0) {
        defaultAppId.value = appInfoList.value[0]?.appId;
      }
    });
  }
  onMounted(() => {
    userId.value = route.query.userId || null;
    title.value = userId.value ? I18n.global.t('bianJiYongHu') : I18n.global.t('xinZengYongHu');
    if (userId.value) {
      transformDataSource(submitSchemas, [
        {
          key: 'loginName',
          values: [{ changeKey: 'componentProps.disabled', changeValue: true }],
        },
        {
          key: 'password',
          values: [{ changeKey: 'isShow', changeValue: false }],
        },
        {
          key: 'rePassword',
          values: [{ changeKey: 'isShow', changeValue: false }],
        },
        {
          key: 'userStatus',
          values: [{ changeKey: 'isShow', changeValue: true }],
        },
      ]);
      getUserInfo(userId.value);
    } else {
      getAppInfoList([]);
    }
  });
</script>

<style lang="less" scoped>
  .user-info {
    min-width: 348px;
    margin-right: 1.25rem;
  }
  .power-info {
    min-width: 348px;
  }
  .tags-box {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
  }
  :deep(.n-divider) {
    font-size: 12px;
    font-weight: 400;
  }
  :deep(.n-divider .n-divider__title) {
    font-weight: 400;
  }
  :deep(.n-divider:not(.n-divider--vertical)) {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  // 小于965px的
  // @media (max-width: 965px) {
  //   .user-info {
  //     margin-right: 0px;
  //   }
  //   .power-info {
  //     margin-top: 1.5rem;
  //   }
  // }
</style>
