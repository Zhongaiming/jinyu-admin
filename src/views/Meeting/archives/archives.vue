<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="register" @submit="onMeetingArchivesTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :title="$t('huiYiDangAnLieBiao')"
      :request="loadArchivesTableData"
      :actionColumn="actionColumn"
      :row-key="(row) => row.meetingId"
      ref="archivesTableRef"
    />
  </n-card>
</template>

<script setup lang="ts">
  defineOptions({ name: 'MeetingArchives' });
  import { getMeetingArchivesList } from '@/api/Meeting/meeting/meeting';
  import { FormSchema, useForm, BasicForm } from '@/components/Form';
  import { TableAction } from '@/components/Table';
  import { dictTagView } from '@/utils/dict';
  import I18n from '@/lang/index'; //引入i18n组件
  const archivesTableRef = ref();
  const router = useRouter();
  /**
   * 搜索字段
   */
  const searchSchema: FormSchema[] = [
    {
      field: 'meetingName',
      label: I18n.global.t('huiYiMingCheng'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuHuiYiMingCheng'),
      },
    },
    {
      field: 'meetingStartTime',
      label: I18n.global.t('kaiShiShiJian'),
      isShow: true,
      component: 'NDatePicker',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuHuiYiKaiShiShiJian'),
        type: 'datetime',
      },
    },
    {
      field: 'meetingEndTime',
      label: I18n.global.t('jieShuShiJian'),
      isShow: true,
      component: 'NDatePicker',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuHuiYiJieShuShiJian'),
        type: 'datetime',
      },
    },
  ];
  /**
   * 搜索表单
   */
  const [register, { getFieldsValue: getSearchsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 80 : 140,
    submitOnReset: true,
    schemas: searchSchema,
    submitClassName: 'primary-button',
  });
  /**
   * 点击搜索
   */
  const onMeetingArchivesTableSearch = () => {
    // 搜索重置页码
    if (archivesTableRef.value) {
      archivesTableRef.value.updatePage(1);
    }
  };

  /**
   * Function to load data for the archives table.
   *
   * @param {type} pageParam - description of pageParam
   * @return {type} return value description
   */
  const loadArchivesTableData = async (pageParam) => {
    return await getMeetingArchivesList({
      meetingDtoFilter: { ...getSearchsValue() },
      pageParam,
    });
  };
  /**
   * 会议表格字段
   */
  const columns = [
    {
      title: I18n.global.t('huiYiMingCheng'),
      key: 'meetingName',
    },
    {
      title: I18n.global.t('canHuiRenYuan'),
      key: 'personList',
      render: (row) => {
        if (!row.personList) return I18n.global.t('zanWu');
        try {
          if (JSON.parse(row.personList).length) {
            return JSON.parse(row.personList).map((item) => {
              return dictTagView(item.label, {
                class: 'ml-2',
              });
            });
          } else {
            return I18n.global.t('zanWu');
          }
        } catch (err) {
          console.error(err);
        }
      },
    },
    {
      title: I18n.global.t('jiLuYuan'),
      key: 'recorder',
      render: (row) => dictTagView(row.recorder && JSON.parse(row.recorder).label),
    },
    {
      title: I18n.global.t('huiYiKaiShiShiJian'),
      key: 'meetingStartTime',
    },
    {
      title: I18n.global.t('huiYiJieShuShiJian'),
      key: 'meetingEndTime',
    },
  ];
  /**
   * 会议表格操作列
   */
  const actionColumn = reactive({
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('chaKan'),
            type: 'primary',
            text: true,
            disabled: record.userType === '0',
            onClick: handleView.bind(null, record),
          },
          // {
          //   label: '下载录音',
          //   type: 'success',
          //   text: true,
          //   disabled: record.userType === '0',
          //   onClick: handleDownloadRecording.bind(null, record),
          // },
          // {
          //   label: '下载文档',
          //   type: 'primary',
          //   text: true,
          //   disabled: record.userType === '0',
          //   onClick: handleDownloadDocument.bind(null, record),
          // },
          // {
          //   label: '纪要下载:导出PDf',
          //   type: 'warning',
          //   text: true,
          //   disabled: record.userType === '0',
          //   onClick: handleExportPDF.bind(null, record),
          // },
        ],
      });
    },
  });
  const handleView = (record) => {
    router.push({ name: 'MeetingMinute', query: { meetingId: record.meetingId } });
  };
  // const handleDownloadRecording = (record) => {};
  // const handleDownloadDocument = (record) => {};
  // const handleExportPDF = (record) => {};
</script>

<style lang="less" scoped>
  .pro-card {
    :deep(.n-card__content) {
      padding: 20px 16px 16px;
    }
  }
  :deep(.table-toolbar) {
    padding: 0 0 16px;
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
</style>
