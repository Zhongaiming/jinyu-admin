<template>
  <n-card
    :segmented="{ content: true }"
    content-style="padding: 0;min-height:24rem"
    :bordered="false"
    size="small"
    :title="$t('xiaoXiShouQuanYingYongLieBiao')"
  >
    <template #header-extra
      ><div class="flex items-center">
        <n-button type="primary" @click="addTable" class="primary-button">
          {{ $t('xinJianShouQuanYingYong') }}
        </n-button>
        <!-- <span>{{ `共${msgAppList.length}个应用` }}</span> -->
      </div></template
    >
    <div class="flex flex-wrap project-card" v-if="msgAppList.length > 0">
      <n-card
        size="small"
        class="cursor-pointer app-card-item"
        hoverable
        v-for="(item, index) in msgAppList"
        :key="index"
        @click="handleEdit(item)"
      >
        <n-flex align="center" vertical>
          <n-image
            width="56"
            height="56"
            lazy
            :src="
              item.isInternalApp === 1
                ? item.internalApp.svg
                  ? fileUrl + item.internalApp.svg
                  : noImgUrl
                : item.svg
                ? fileUrl + item.svg
                : noImgUrl
            "
            preview-disabled
            :fallbackSrc="noImgUrl"
            :img-props="{ style: { maxHeight: '56px' } }"
          />
          {{ item.isInternalApp === 1 ? item.internalApp?.title : item.externalAppTitle }}
        </n-flex>
        <div class="delete-btn" @click.stop="handleDelete(item)">
          <n-image width="20" height="20" lazy :src="deleteUrl" preview-disabled />
        </div>
      </n-card>
    </div>
    <div class="h-96 flex items-center justify-center" v-else>
      <n-empty :description="$t('zanWuShuJu')" />
    </div>
  </n-card>
  <BasicModal ref="modalRef" :title="title" :width="I18n.global.locale.value === 'zh' ? 520 : 650">
    <div class="mt-5">
      <BasicForm @register="submitRegister" @submit="confirmForm" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useGlobSetting } from '@/hooks/setting';
  import {
    getMessageAppList,
    getMessageAppView,
    addMessageApp,
    updateMessageApp,
    deleteMessageApp,
  } from '@/api/System/component/messageApp';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { BasicModal } from '@/components/Modal/index';
  import { useDict } from '@/utils/dict';
  import { transformDataSource } from '@/utils';
  import I18n from '@/lang/index'; //引入i18n组件
  // 获取字典
  const { internal_app_dict, message_auth_type, message_param_conf } = useDict(
    'internal_app_dict',
    'message_auth_type',
    'message_param_conf'
  );
  const noImgUrl = new URL('@/assets/images/noImg.png', import.meta.url).href;
  const deleteUrl = new URL('@/assets/images/delete.png', import.meta.url).href;
  const { fileUrl } = useGlobSetting();

  const msgAppList: any = ref([]);
  // 消息应用id
  const messageAppId = ref(null);
  // 弹出层实例
  const modalRef: any = ref();
  // 弹出层标题
  const title: Ref<string> = ref('');
  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'appToken',
      component: 'Text',
      label: I18n.global.t('yingYongToken'),
      isShow: false,
      // componentProps:{
      //   style:{fontWeight: 'bold'}
      // }
    },
    {
      field: 'isInternalApp',
      component: 'NRadioGroup',
      label: I18n.global.t('yingYongLeiXing'),
      isShow: true,
      defaultValue: 1,
      componentProps: {
        options: [
          { label: I18n.global.t('neiBuYingYong'), value: 1 },
          { label: I18n.global.t('waiBuYingYong'), value: 2 },
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
          if (e === 1) {
            transformDataSource(submitSchemas, [
              {
                key: 'internalAppId',
                values: [{ changeKey: 'isShow', changeValue: true }],
              },
              {
                key: 'externalAppTitle',
                values: [{ changeKey: 'isShow', changeValue: false }],
              },
              { key: 'svg', values: [{ changeKey: 'isShow', changeValue: false }] },
            ]);
          } else {
            transformDataSource(submitSchemas, [
              {
                key: 'internalAppId',
                values: [{ changeKey: 'isShow', changeValue: false }],
              },
              {
                key: 'externalAppTitle',
                values: [{ changeKey: 'isShow', changeValue: true }],
              },
              { key: 'svg', values: [{ changeKey: 'isShow', changeValue: true }] },
            ]);
          }
        },
      },
    },
    {
      field: 'internalAppId',
      component: 'NSelect',
      label: I18n.global.t('guanLianNeiBuYingYong'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeGuanLianNeiBuYingYong'),
        options: internal_app_dict,
        filterable: true,
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('guanLianNeiBuYingYongBuNengWeiKong'),
          trigger: ['change'],
        },
      ],
    },
    {
      field: 'svg',
      label: I18n.global.t('waiBuYingYongTuBiao'),
      component: 'BasicUpload',
      isShow: false,
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
      field: 'externalAppTitle',
      component: 'NInput',
      label: I18n.global.t('waiBuYingYongMingCheng'),
      isShow: false,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuWaiBuYingYongMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('waiBuYingYongMingChengBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'authType',
      component: 'NSelect',
      label: I18n.global.t('shouQuanLeiXing'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeShouQuanLeiXing'),
        options: message_auth_type,
        filterable: true,
        multiple: true,
        clearable: true,
        onUpdateValue: (e: any) => {
          console.log('authType>>>>>>', e);
        },
      },
      rules: [
        {
          required: true,
          type: 'array',
          message: I18n.global.t('shouQuanLeiXingBuNengWeiKong'),
          trigger: ['blur', 'change'],
        },
      ],
    },
    {
      field: 'paramConf',
      component: 'NSelect',
      label: I18n.global.t('canShuPeiZhi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeCanShuPeiZhi'),
        options: message_param_conf,
        filterable: true,
        multiple: true,
        clearable: true,
        onUpdateValue: (e: any) => {
          console.log('paramConf>>>>>>', e);
        },
      },
    },
    {
      field: 'isCallBack',
      component: 'NSwitch',
      label: I18n.global.t('kaiQiHuiTiao'),
      isShow: true,
      defaultValue: 2,
      componentProps: {
        checkedValue: 1,
        uncheckedValue: 2,
        onUpdateValue: (e: any) => {
          if (e === 1) {
            transformDataSource(submitSchemas, [
              {
                key: 'callBackLink',
                values: [{ changeKey: 'isShow', changeValue: true }],
              },
            ]);
          } else {
            transformDataSource(submitSchemas, [
              {
                key: 'callBackLink',
                values: [{ changeKey: 'isShow', changeValue: false }],
              },
            ]);
          }
        },
      },
    },
    {
      field: 'callBackLink',
      component: 'NInput',
      label: I18n.global.t('huiTiaoDiZhi'),
      isShow: false,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuHuiTiaoDiZhi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 120 : 240,
    layout: 'horizontal',
    schemas: submitSchemas,
    showAdvancedButton: true,
    submitButtonText: I18n.global.t('queDing'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        modalRef.value.closeModal();
      });
    },
  });

  //新增弹框
  function addTable() {
    title.value = I18n.global.t('xinZengShouQuanYingYong');
    messageAppId.value = null;
    resetSubmitSchemas();
    modalRef.value.openModal();
  }

  // 编辑字典弹窗
  function handleEdit(record: Recordable) {
    resetSubmitSchemas();
    getMessageAppView({ messageAppId: record.messageAppId }).then((res) => {
      messageAppId.value = record.messageAppId;
      title.value = I18n.global.t('bianJiShouQuanYingYong');
      modalRef.value.openModal();
      if (res.isInternalApp === 1) {
        transformDataSource(submitSchemas, [
          {
            key: 'internalAppId',
            values: [{ changeKey: 'isShow', changeValue: true }],
          },
          {
            key: 'externalAppTitle',
            values: [{ changeKey: 'isShow', changeValue: false }],
          },
          { key: 'svg', values: [{ changeKey: 'isShow', changeValue: false }] },
        ]);
      } else {
        transformDataSource(submitSchemas, [
          {
            key: 'internalAppId',
            values: [{ changeKey: 'isShow', changeValue: false }],
          },
          {
            key: 'externalAppTitle',
            values: [{ changeKey: 'isShow', changeValue: true }],
          },
          { key: 'svg', values: [{ changeKey: 'isShow', changeValue: true }] },
        ]);
      }
      if (res.callBackLink === 1) {
        transformDataSource(submitSchemas, [
          {
            key: 'callBackLink',
            values: [{ changeKey: 'isShow', changeValue: true }],
          },
        ]);
      } else {
        transformDataSource(submitSchemas, [
          {
            key: 'callBackLink',
            values: [{ changeKey: 'isShow', changeValue: false }],
          },
        ]);
      }
      transformDataSource(submitSchemas, [
        {
          key: 'appToken',
          values: [{ changeKey: 'isShow', changeValue: true }],
        },
      ]);
      res.authType = res.authType ? JSON.parse(res.authType) : [];
      res.paramConf = res.paramConf ? JSON.parse(res.paramConf) : [];
      nextTick(() => {
        setSubmitFieldsValue(res);
      });
    });
  }

  // 删除消息授权应用
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('quXiaoYingYongShouQuan'),
      content: I18n.global.t('queDingQuXiaoGaiXiaoXiYingYongShouQuan'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteMessageApp({ messageAppId: record.messageAppId }).then(() => {
          window['$message'].success(I18n.global.t('quXiaoChengGong'));
          getMsgAppList();
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  // 弹窗From提交
  function confirmForm(form) {
    if (form) {
      form.authType = form.authType ? JSON.stringify(form.authType) : '[]';
      form.paramConf = form.paramConf ? JSON.stringify(form.paramConf) : '[]';
      if (messageAppId.value != null) {
        updateMessageApp({
          messageAppDto: { messageAppId: messageAppId.value, ...form },
        }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          getMsgAppList();
        });
      } else {
        addMessageApp({ messageAppDto: form }).then(() => {
          window['$message'].success(I18n.global.t('xinJianChengGong'));
          modalRef.value.closeModal();
          getMsgAppList();
        });
      }
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  // 重置submitSchemas
  function resetSubmitSchemas() {
    transformDataSource(submitSchemas, [
      {
        key: 'internalAppId',
        values: [{ changeKey: 'isShow', changeValue: true }],
      },
      {
        key: 'appToken',
        values: [{ changeKey: 'isShow', changeValue: false }],
      },
      { key: 'externalAppTitle', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'svg', values: [{ changeKey: 'isShow', changeValue: false }] },
      { key: 'callBackLink', values: [{ changeKey: 'isShow', changeValue: false }] },
    ]);
  }

  // 获取消息授权应用列表
  function getMsgAppList() {
    let data = {
      messageAppDtoFilter: {},
      orderParam: [],
      pageParam: {
        pageNum: 1,
        pageSize: 9999,
      },
    };
    getMessageAppList(data).then((res) => {
      msgAppList.value = res.dataList;
    });
  }

  onMounted(() => {
    getMsgAppList();
  });
</script>

<style lang="less" scoped>
  .app-card-item {
    width: 10%;
    position: relative;
  }
  .delete-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;
  }
</style>
