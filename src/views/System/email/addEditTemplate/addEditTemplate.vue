<template>
  <n-card :bordered="false" class="pro-card">
    <n-grid y-gap="20" x-gap="20" cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen">
      <n-gi>
        <n-card :title="title">
          <BasicForm @register="submitRegister" @submit="confirmForm">
            <template #emailGroupSlot="{ model, field }">
              <n-dynamic-input
                v-model:value="model[field]"
                :default-value="['']"
                :placeholder="$t('qingShuRuYouXiang')"
                :min="1"
              />
            </template>
          </BasicForm>
        </n-card>
      </n-gi>
      <n-gi />
    </n-grid>
  </n-card>
</template>
<script lang="ts" setup>
  import {
    getEmailTemplateView,
    addEmailTemplate,
    updateEmailTemplate,
  } from '@/api/System/email/template';
  import { getEmailBehaviorList } from '@/api/System/email/behavior';
  import { transformDataSource } from '@/utils';
  import { FormSchema, useForm } from '@/components/Form/index';
  import type { SelectRenderTag, FormItemRule } from 'naive-ui';
  import { NTag, NPopover } from 'naive-ui';
  import I18n from '@/lang/index'; //引入i18n组件
  const router = useRouter();
  const route = useRoute();
  //邮件模板id(编辑需要)
  const emailTemplateId: any = ref(null);
  const title = ref('');
  // Select多选tag样式
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
            { default: () => option.title ?? '' }
          ),
        default: () => {
          if (
            option.keyword &&
            Object.keys(JSON.parse(option.keyword as unknown as string)).length > 0
          ) {
            return h(
              'span',
              {},
              Object.keys(JSON.parse(option.keyword as unknown as string)).map((key: string) => {
                return h(
                  'div',
                  {},
                  {
                    default: () =>
                      key + ': ' + JSON.parse(option.keyword as unknown as string)[key],
                  }
                );
              })
            );
          } else {
            return I18n.global.t('zanWu');
          }
        },
      }
    );
  };
  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'templateKey',
      component: 'NInput',
      label: I18n.global.t('youJianMoBanKey'),
      isShow: true,
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'title',
      component: 'NInput',
      label: I18n.global.t('youJianMoBanMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYouJianMoBanMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('moBanMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'emailTitle',
      component: 'NInput',
      label: I18n.global.t('youJianBiaoTi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuYouJianBiaoTi'),
        disabled: false,
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('youJianBiaoTiBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'behaviorKey',
      component: 'NSelect',
      label: I18n.global.t('bangDingHangWei'),
      labelMessage: I18n.global.t(
        'zaiTianXieWenJianMoBanNeiRongShiShiYongGuanJianZiXuYaoZaiGuanJianZiQianHouZengJia_3GeLiRuTitle'
      ),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeBangDingHangWei'),
        options: [],
        labelField: 'title',
        valueField: 'behaviorKey',
        renderTag: renderSelectTag,
        filterable: true,
        multiple: true,
        clearable: true,
      },
      rules: [
        {
          required: true,
          type: 'array',
          trigger: 'change',
          message: I18n.global.t('bangDingHangWeiBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'receiveEmail',
      label: I18n.global.t('jieShouYouXiangZu'),
      isShow: true,
      slot: 'emailGroupSlot',
      defaultValue: [''],
      rules: [
        {
          required: true,
          validator(rule: FormItemRule, value: Array<any>) {
            console.log('rule>>>>', rule);
            if (
              value.every((item) => {
                return !item;
              })
            ) {
              return new Error(I18n.global.t('jieShouYouXiangZuBuNengWeiKong'));
            }
          },
          trigger: ['blur', 'input'],
          message: I18n.global.t('bangDingHangWeiBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'emailContent',
      component: 'TinymceEditor',
      label: I18n.global.t('youJianMoBanNeiRong'),
      isShow: true,
      componentProps: {},
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('youJianMoBanNeiRongBuNengWeiKong'),
        },
      ],
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
      if (form.receiveEmail) {
        form.receiveEmail = JSON.stringify(form.receiveEmail);
      }
      if (form.behaviorKey) {
        form.behaviorKey = JSON.stringify(form.behaviorKey);
      }
      if (emailTemplateId.value != null) {
        updateEmailTemplate({
          emailTemplateDto: { emailTemplateId: emailTemplateId.value, ...form },
        }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          router.go(-1);
        });
      } else {
        addEmailTemplate({
          emailTemplateDto: form,
        }).then(() => {
          window['$message'].success(I18n.global.t('tianJiaChengGong'));
          router.go(-1);
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  // 获取邮件模板详情
  function getEmailTemplateInfo(emailTemplateId) {
    getEmailTemplateView({ emailTemplateId }).then((res) => {
      res.receiveEmail =
        res.receiveEmail && JSON.parse(res.receiveEmail).length
          ? JSON.parse(res.receiveEmail)
          : [''];
      res.behaviorKey =
        res.behaviorKey && JSON.parse(res.behaviorKey).length ? JSON.parse(res.behaviorKey) : [];
      setSubmitFieldsValue(res);
    });
  }

  // 获取规则行为字典
  function getEmailBehaviorDict() {
    getEmailBehaviorList({ page: 1, pageSize: 9999 }).then((res) => {
      transformDataSource(submitSchemas, [
        {
          key: 'behaviorKey',
          values: [
            {
              changeKey: 'componentProps.options',
              changeValue: res.dataList,
            },
          ],
        },
      ]);
    });
  }

  onMounted(() => {
    emailTemplateId.value = route.query.emailTemplateId || null;
    title.value = emailTemplateId.value
      ? I18n.global.t('bianJiYouJianMoBan')
      : I18n.global.t('xinZengYouJianMoBan');
    getEmailBehaviorDict();
    if (emailTemplateId.value) {
      getEmailTemplateInfo(emailTemplateId.value);
      transformDataSource(submitSchemas, [
        {
          key: 'templateKey',
          values: [
            {
              changeKey: 'isShow',
              changeValue: true,
            },
          ],
        },
      ]);
    } else {
      transformDataSource(submitSchemas, [
        {
          key: 'templateKey',
          values: [
            {
              changeKey: 'isShow',
              changeValue: false,
            },
          ],
        },
      ]);
    }
  });
</script>

<style lang="less" scoped></style>
