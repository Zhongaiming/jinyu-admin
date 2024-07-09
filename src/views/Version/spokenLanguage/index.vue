<template>
  <n-card class="version" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadVersionTable"
      :row-key="(row) => row.messageId"
      ref="versionTableRef"
      :actionColumn="actionColumn"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="handleUpdateVersion">
          {{ I18n.global.t('gengXinBanBen') }}
        </n-button>
      </template>
    </BasicTable>

    <BasicModal @register="modalRegister" ref="addEditUserModalRef" :width="500">
      <template #default>
        <version-form @submit="updateSubmit" ref="versionRef" :is-edit="isEdit" :id="id" />
      </template>
    </BasicModal>
  </n-card>
</template>

<script setup lang="ts">
  import VersionForm from '../component/versionForm.vue';
  import { useModal } from '@/components/Modal';
  import I18n from '@/lang/index'; //引入i18n组件
  import { TableAction, BasicColumn } from '@/components/Table';
  import { addVersion, getVersionList, deleteVersion, updateVersion } from '@/api/Version/index';

  const versionRef = ref();
  const versionTableRef = ref();
  const isEdit = ref<boolean>(true);
  const id = ref();

  // Table表格字段接口
  interface ListData {
    versionCode: string;
    versionName: string;
    updateType: string;
    nowVersion: number;
    versionInfo: string;
    createTime: string;
  }

  // 表格字段
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('banBenHao'),
      key: 'versionCode',
    },
    {
      title: I18n.global.t('banBenMingCheng'),
      key: 'versionName',
    },
    {
      title: I18n.global.t('gengXinLeiXing'),
      key: 'updateType',
      render(row) {
        return row.updateType == 'solicit'
          ? I18n.global.t('tanKuangQueRenGengXin')
          : I18n.global.t('qiangZhiGengXin');
      },
    },
    {
      title: I18n.global.t('shiFouShiZuiXinBanBen'),
      key: 'nowVersion',
      render(row) {
        return row.nowVersion === 1 ? I18n.global.t('shi') : I18n.global.t('fou');
      },
    },
    {
      title: I18n.global.t('banBenMiaoShu'),
      key: 'versionInfo',
    },
    {
      title: I18n.global.t('chuangJianShiJian'),
      key: 'createTime',
    },
  ];

  // 表格操作
  const actionColumn = reactive({
    width: 150,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('chaKan'),
            type: 'info',
            text: true,
            onClick: handleOperate.bind(null, record, 'view'),
          },
          {
            label: I18n.global.t('bianJi'),
            type: 'info',
            text: true,
            onClick: handleOperate.bind(null, record, 'edit'),
          },
          {
            label: I18n.global.t('shanChu'),
            type: 'info',
            text: true,
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  const [modalRegister, { openModal, setProps: setModalProps, closeModal }] = useModal({
    title: I18n.global.t('gengXinBanBen'),
    // showDefaultAction: true,
  });

  // 查看/修改版本信息
  const handleOperate = (messageData, type) => {
    id.value = messageData.id;
    isEdit.value = type === 'view' ? false : true;
    setModalProps({
      title:
        type === 'view'
          ? I18n.global.t('chaKanBanBenXiangQing')
          : I18n.global.t('xiuGaiBanBenXinXi'),
    });
    openModal();
  };

  // 删除版本信息记录
  const handleDelete = (messageData) => {
    window['$dialog'].info({
      title: I18n.global.t('shanChuBanBenJiLu'),
      content: I18n.global.t('queDingShanChu') + '?',
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteVersion({ id: messageData.id }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          versionTableRef.value.reload();
        });
      },
    });
  };

  const handleUpdateVersion = () => {
    id.value = '';
    isEdit.value = true;
    setModalProps({ title: I18n.global.t('gengXinBanBen') });
    openModal();
  };

  // 加载表格数据
  const loadVersionTable = async (page, sort) => {
    return await getVersionList({
      appId: '__UNI__11F587D',
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  const updateSubmit = async (value) => {
    let params = {
      appVersionDto: {
        appId: '__UNI__11F587D',
        ...value,
      },
    };
    window['$dialog'].info({
      title: I18n.global.t('gengXinBanBen'),
      content: I18n.global.t('queDingGengXin') + '?',
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        if (value.id) {
          updateVersion(params).then(() => {
            window['$message'].success(I18n.global.t('xiuGaiBanBenXinXiChengGong'));
            closeModal();
            versionTableRef.value.reload();
            versionRef.value.resetForm();
          });
        } else {
          addVersion(params).then(() => {
            window['$message'].success(I18n.global.t('gengXinBanBenChengGong'));
            closeModal();
            versionTableRef.value.reload();
            versionRef.value.resetForm();
          });
        }
      },
    });
  };
</script>

<style scoped lang="less">
  .version {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
