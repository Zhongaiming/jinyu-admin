<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.sendingRuleId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('xinJianFaSongGuiZe') }}
        </n-button>
      </template>
    </BasicTable>
    <BasicModal
      ref="modalRef"
      :width="I18n.global.locale.value === 'zh' ? 575 : 600"
      :title="title"
    >
      <div class="mt-5">
        <BasicForm @register="submitRegister" @submit="confirmForm">
          <template #rultSolt="{}">
            <!-- <div class="flex items-center"> -->
            <n-form
              ref="ruleFormRef"
              inline
              :label-width="80"
              label-placement="left"
              :model="ruleForm"
              :rules="ruleFormRules"
              class="rule-form"
            >
              <template v-if="submitType === '2' || submitType === '3'">
                <n-form-item label="" path="cycleType" v-if="submitType === '3'">
                  <n-select
                    v-model:value="ruleForm.cycleType"
                    class="w-28"
                    :options="email_cycle_type"
                    filterabl
                    :placeholder="$t('zhouQiLeiXing')"
                    @update:value="resetRuleForm"
                  />
                </n-form-item>
                <n-form-item label="" path="year" v-if="submitType === '2'">
                  <n-input-group>
                    <n-input-number
                      :show-button="false"
                      v-model:value="ruleForm.year"
                      :min="2000"
                      :class="I18n.global.locale.value === 'zh' ? 'w-20' : 'w-28'"
                    />
                    <n-input-group-label>{{ $t('nian') }}</n-input-group-label>
                  </n-input-group>
                </n-form-item>
                <n-form-item label="" path="month" v-if="submitType === '2'">
                  <n-input-group>
                    <n-input-number
                      :show-button="false"
                      v-model:value="ruleForm.month"
                      :min="1"
                      :max="12"
                      :class="I18n.global.locale.value === 'zh' ? 'w-20' : 'w-28'"
                    />
                    <n-input-group-label>{{ $t('yue') }}</n-input-group-label>
                  </n-input-group>
                </n-form-item>
                <n-form-item
                  label=""
                  path="week"
                  v-if="submitType == '3' && ruleForm.cycleType === '6'"
                >
                  <n-select
                    v-model:value="ruleForm.week"
                    class="w-28"
                    :options="weekDict"
                    :placeholder="$t('zhou')"
                    filterabl
                  />
                </n-form-item>
                <n-form-item
                  label=""
                  path="day"
                  v-if="
                    submitType === '2' || ruleForm.cycleType === '2' || ruleForm.cycleType === '7'
                  "
                >
                  <n-input-group>
                    <n-input-number
                      :show-button="false"
                      v-model:value="ruleForm.day"
                      :min="0"
                      :max="31"
                      :class="I18n.global.locale.value === 'zh' ? 'w-20' : 'w-28'"
                    />
                    <n-input-group-label>{{ $t('ri') }}</n-input-group-label>
                  </n-input-group>
                </n-form-item>
                <n-form-item
                  label=""
                  path="hour"
                  v-if="
                    submitType === '2' ||
                    ruleForm.cycleType === '1' ||
                    ruleForm.cycleType === '2' ||
                    ruleForm.cycleType === '3' ||
                    ruleForm.cycleType === '4' ||
                    ruleForm.cycleType === '6' ||
                    ruleForm.cycleType === '7'
                  "
                >
                  <n-input-group>
                    <n-input-number
                      :show-button="false"
                      v-model:value="ruleForm.hour"
                      :min="0"
                      :max="23"
                      :class="I18n.global.locale.value === 'zh' ? 'w-20' : 'w-28'"
                    />
                    <n-input-group-label>{{ $t('Shi') }}</n-input-group-label>
                  </n-input-group>
                </n-form-item>
                <n-form-item
                  label=""
                  path="minute"
                  v-if="
                    submitType === '2' ||
                    ruleForm.cycleType === '1' ||
                    ruleForm.cycleType === '2' ||
                    ruleForm.cycleType === '4' ||
                    ruleForm.cycleType === '5' ||
                    ruleForm.cycleType === '6' ||
                    ruleForm.cycleType === '7'
                  "
                >
                  <n-input-group>
                    <n-input-number
                      :show-button="false"
                      v-model:value="ruleForm.minute"
                      :min="0"
                      :max="59"
                      :class="I18n.global.locale.value === 'zh' ? 'w-20' : 'w-28'"
                    />
                    <n-input-group-label>{{ $t('fen') }}</n-input-group-label>
                  </n-input-group>
                </n-form-item>
                <n-form-item label="" path="second" v-if="submitType === '2'">
                  <n-input-group>
                    <n-input-number
                      :show-button="false"
                      v-model:value="ruleForm.second"
                      :min="0"
                      :max="59"
                      :class="I18n.global.locale.value === 'zh' ? 'w-20' : 'w-28'"
                    />
                    <n-input-group-label>{{ $t('miao') }}</n-input-group-label>
                  </n-input-group>
                </n-form-item>
              </template>
              <template v-else>
                <n-form-item label="" path="monitorRule">
                  <n-input
                    class="monitorRule"
                    v-model:value="ruleForm.monitorRule"
                    type="textarea"
                    :placeholder="$t('qingShuRuJianKongGuiZe')"
                  />
                </n-form-item>
              </template>
            </n-form>
            <!-- </div> -->
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import {
    getEmailSendingRuleList,
    getEmailSendingRuleView,
    addEmailSendingRule,
    updateEmailSendingRule,
    delEmailSendingRule,
  } from '@/api/System/email/sendingRule';
  import { getCurrentPage, transformDataSource } from '@/utils/index';
  import { useDict } from '@/utils/dict';
  import type { FormItemRule } from 'naive-ui';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { email_rule_type, email_cycle_type, email_behavior, email_template } = useDict(
    'email_rule_type',
    'email_cycle_type',
    'email_behavior',
    'email_template'
  );
  // 发送规则ID
  const sendingRuleId = ref(null);
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('guiZeMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuGuiZeMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: I18n.global.locale.value === 'zh' ? 70 : 120,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });
  const ruleFormRef = ref();
  const submitType = ref('');
  const ruleForm = ref({
    cycleType: '1',
    year: null,
    month: null,
    week: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
    monitorRule: null,
  });
  const weekDict = ref([
    { label: I18n.global.t('xingQiRi'), value: '1' },
    { label: I18n.global.t('xingQiYi'), value: '2' },
    { label: I18n.global.t('xingQiEr'), value: '3' },
    { label: I18n.global.t('xingQiSan'), value: '4' },
    { label: I18n.global.t('xingQiSi'), value: '5' },
    { label: I18n.global.t('xingQiWu'), value: '6' },
    { label: I18n.global.t('xingQiLiu'), value: '7' },
  ]);

  const ruleFormRules = ref();
  watch(
    () => ruleForm.value.cycleType,
    (val) => {
      if (val === '1' || val === '4') {
        ruleFormRules.value = {
          hour: {
            required: true,
            type: 'number',
            message: I18n.global.t('shiBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          minute: {
            required: true,
            type: 'number',
            message: I18n.global.t('fenBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
        ruleFormRef.value?.restoreValidation();
      } else if (val === '2' || val === '7') {
        ruleFormRules.value = {
          day: {
            required: true,
            type: 'number',
            message: I18n.global.t('riBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          hour: {
            required: true,
            type: 'number',
            message: I18n.global.t('shiBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          minute: {
            required: true,
            type: 'number',
            message: I18n.global.t('fenBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
        ruleFormRef.value?.restoreValidation();
      } else if (val === '3') {
        ruleFormRules.value = {
          hour: {
            required: true,
            type: 'number',
            message: I18n.global.t('shiBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
        ruleFormRef.value?.restoreValidation();
      } else if (val === '5') {
        ruleFormRules.value = {
          minute: {
            required: true,
            type: 'number',
            message: I18n.global.t('fenBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
        ruleFormRef.value?.restoreValidation();
      } else if (val === '6') {
        ruleFormRules.value = {
          week: {
            required: true,
            message: I18n.global.t('zhouBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          hour: {
            required: true,
            type: 'number',
            message: I18n.global.t('shiBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          minute: {
            required: true,
            type: 'number',
            message: I18n.global.t('fenBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
        ruleFormRef.value?.restoreValidation();
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    () => submitType.value,
    (val) => {
      if (val === '2') {
        ruleFormRules.value = {
          year: {
            required: true,
            type: 'number',
            message: I18n.global.t('nianBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          month: {
            required: true,
            type: 'number',
            message: I18n.global.t('yueBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          day: {
            required: true,
            type: 'number',
            message: I18n.global.t('riBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          hour: {
            required: true,
            type: 'number',
            message: I18n.global.t('shiBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          minute: {
            required: true,
            type: 'number',
            message: I18n.global.t('fenBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
          second: {
            required: true,
            type: 'number',
            message: I18n.global.t('miaoBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
      } else if (val === '4') {
        ruleFormRules.value = {
          monitorRule: {
            required: true,
            message: I18n.global.t('jianKongGuiZeBuNengWeiKong'),
            trigger: ['blur', 'input'],
          },
        };
      } else {
        ruleFormRules.value = {};
      }
    }
  );

  // 弹出层实例
  const modalRef: any = ref();
  // 弹出层标题
  const title = ref('');
  // Table实例
  const actionRef = ref();
  // Table表格字段接口
  interface ListData {
    sendingRuleId: string;
    title: string;
    behaviorKey: string;
    templateKey: string;
    description: string;
    createTime: string;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('faSongGuiZeId'),
      key: 'sendingRuleId',
    },
    {
      title: I18n.global.t('guiZeMingCheng'),
      key: 'title',
    },
    {
      title: I18n.global.t('hangWeiKey'),
      key: 'behaviorKey',
    },
    {
      title: I18n.global.t('moBanKey'),
      key: 'templateKey',
    },
    {
      title: I18n.global.t('miaoShu'),
      key: 'description',
    },
    {
      title: I18n.global.t('chuangJianShiJian'),
      key: 'createTime',
    },
  ];

  // Table表格操作配置
  const actionColumn = reactive({
    width: 180,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('bianJi'),
            type: 'info',
            text: true,
            class: 'ml-3',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: I18n.global.t('shanChu'),
            type: 'error',
            text: true,
            class: 'ml-3',
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'title',
      component: 'NInput',
      label: I18n.global.t('guiZeMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuGuiZeMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('guiZeMingChengBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'behaviorKey',
      component: 'NSelect',
      label: I18n.global.t('youJianHangWei'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeYouJianHangWei'),
        options: email_behavior,
        filterable: true,
      },
      rules: [
        {
          required: true,
          trigger: ['change'],
          message: I18n.global.t('youJianHangWeiBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'templateKey',
      component: 'NSelect',
      label: I18n.global.t('youJianMoBan'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeYouJianMoBan'),
        options: email_template,
        filterable: true,
      },
      rules: [
        {
          required: true,
          trigger: ['change'],
          message: I18n.global.t('youJianMoBanBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'type',
      component: 'NSelect',
      label: I18n.global.t('faSongLeiXing'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeFaSongLeiXing'),
        options: email_rule_type,
        filterable: true,
        onChange: (e: any) => {
          submitType.value = e;
          resetRuleForm();
          if (e === '1') {
            transformDataSource(submitSchemas, [
              { key: 'rule', values: [{ changeKey: 'isShow', changeValue: false }] },
            ]);
          } else {
            transformDataSource(submitSchemas, [
              { key: 'rule', values: [{ changeKey: 'isShow', changeValue: true }] },
            ]);
          }
        },
      },
      rules: [
        {
          required: true,
          trigger: ['change'],
          message: I18n.global.t('faSongLeiXingBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'rule',
      component: 'NSelect',
      label: I18n.global.t('faSongGuiZe'),
      isShow: false,
      slot: 'rultSolt',
      rules: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            console.log(rule, value);
          },
          trigger: ['change'],
        },
      ],
    },
    {
      field: 'description',
      component: 'NInput',
      label: I18n.global.t('miaoShu'),
      isShow: true,
      componentProps: {
        type: 'textarea',
        placeholder: I18n.global.t('qingShuRuMiaoShu'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 100 : 140,
    layout: 'horizontal',
    schemas: submitSchemas,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        modalRef.value.closeModal();
      });
    },
  });

  // 新增应用弹窗
  function addTable() {
    title.value = I18n.global.t('xinJianFaSongGuiZe');
    sendingRuleId.value = null;
    modalRef.value.openModal();
    transformDataSource(submitSchemas, [
      { key: 'rule', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
  }

  // 编辑应用弹窗
  function handleEdit(record: Recordable) {
    getEmailSendingRuleView({ sendingRuleId: record.sendingRuleId }).then((res) => {
      sendingRuleId.value = record.sendingRuleId;
      title.value = I18n.global.t('bianJiFaSongGuiZe');
      modalRef.value.openModal();
      submitType.value = res.type;
      if (submitType.value === '1') {
        transformDataSource(submitSchemas, [
          { key: 'rule', values: [{ changeKey: 'isShow', changeValue: false }] },
        ]);
      } else {
        transformDataSource(submitSchemas, [
          { key: 'rule', values: [{ changeKey: 'isShow', changeValue: true }] },
        ]);
      }
      if (res.rule) {
        ruleForm.value.cycleType = JSON.parse(res.rule).cycleType || '1';
        ruleForm.value.year = JSON.parse(res.rule).year || null;
        ruleForm.value.month = JSON.parse(res.rule).month || null;
        ruleForm.value.week = JSON.parse(res.rule).week || null;
        ruleForm.value.day = JSON.parse(res.rule).day || null;
        ruleForm.value.hour = JSON.parse(res.rule).hour || null;
        ruleForm.value.minute = JSON.parse(res.rule).minute || null;
        ruleForm.value.second = JSON.parse(res.rule).second || null;
        ruleForm.value.monitorRule = JSON.parse(res.rule).monitorRule || null;
      }
      nextTick(() => {
        setSubmitFieldsValue({ ...res });
      });
    });
  }

  // 删除邮件行为
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuYouJianFaSongGuiZe'),
      content: I18n.global.t('shiFouQueRenShanChuYouJianFaSongGuiZe'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        delEmailSendingRule({ roleId: record.roleId }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          getCurrentPage(actionRef, 1);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getEmailSendingRuleList({
      sysRoleDtoFilter: { ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  function resetRuleForm() {
    ruleForm.value.year = null;
    ruleForm.value.month = null;
    ruleForm.value.week = null;
    ruleForm.value.day = null;
    ruleForm.value.hour = null;
    ruleForm.value.minute = null;
    ruleForm.value.second = null;
    ruleForm.value.monitorRule = null;
  }

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  // Table表格刷新
  function reloadTable() {
    actionRef.value.reload();
  }

  // Table搜索方法
  function onTableSearch() {
    // 搜索重置页码
    actionRef.value.updatePage(1);
  }

  // 弹窗From提交
  function confirmForm(form) {
    ruleFormRef.value?.validate((errors) => {
      if (!errors) {
        if (submitType.value === '2') {
          form.rule = JSON.stringify({
            year: ruleForm.value.year,
            month: ruleForm.value.month,
            day: ruleForm.value.day,
            hour: ruleForm.value.hour,
            minute: ruleForm.value.minute,
            second: ruleForm.value.second,
          });
        } else if (submitType.value === '3') {
          if (ruleForm.value.cycleType === '1' || ruleForm.value.cycleType === '4') {
            form.rule = JSON.stringify({
              cycleType: ruleForm.value.cycleType,
              hour: ruleForm.value.hour,
              minute: ruleForm.value.minute,
            });
          } else if (ruleForm.value.cycleType === '2' || ruleForm.value.cycleType === '7') {
            form.rule = JSON.stringify({
              cycleType: ruleForm.value.cycleType,
              day: ruleForm.value.day,
              hour: ruleForm.value.hour,
              minute: ruleForm.value.minute,
            });
          } else if (ruleForm.value.cycleType === '3') {
            form.rule = JSON.stringify({
              cycleType: ruleForm.value.cycleType,
              hour: ruleForm.value.hour,
            });
          } else if (ruleForm.value.cycleType === '5') {
            form.rule = JSON.stringify({
              cycleType: ruleForm.value.cycleType,
              minute: ruleForm.value.minute,
            });
          } else if (ruleForm.value.cycleType === '6') {
            form.rule = JSON.stringify({
              cycleType: ruleForm.value.cycleType,
              week: ruleForm.value.week,
              hour: ruleForm.value.hour,
              minute: ruleForm.value.minute,
            });
          }
        } else if (submitType.value === '5') {
          form.rule = JSON.stringify({
            monitorRule: ruleForm.value.monitorRule,
          });
        }
        if (form) {
          if (sendingRuleId.value != null) {
            updateEmailSendingRule({
              emailSendingRuleDto: { sendingRuleId: sendingRuleId.value, ...form },
            }).then(() => {
              window['$message'].success(I18n.global.t('bianJiChengGong'));
              modalRef.value.closeModal();
              reloadTable();
            });
          } else {
            addEmailSendingRule({ emailSendingRuleDto: form }).then(() => {
              window['$message'].success(I18n.global.t('xinJianChengGong'));
              modalRef.value.closeModal();
              reloadTable();
            });
          }
        } else {
          window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
        }
      } else {
        window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
      }
    });
  }
</script>

<style lang="less" scoped>
  .pro-card {
    :deep(.n-card__content) {
      padding: 20px 16px 16px;
    }
  }
  .search-card {
    :deep(.n-card__content) {
      padding: 20px 16px !important;
    }
    :deep(.n-grid) {
      gap: 24px 0px !important;
    }
    :deep(.n-form-item .n-form-item-feedback-wrapper) {
      min-height: auto;
    }
  }
  :deep(.table-toolbar) {
    padding: 0 0 16px;
  }
  .rule-form {
    display: flex;
    flex-wrap: wrap !important;
    position: relative;
  }
  .monitorRule {
    width: 419px !important;
  }
</style>
