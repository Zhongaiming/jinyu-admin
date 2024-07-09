<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :title="$t('gangWeiShengQian')"
      :row-key="(row:ListData) => row.userId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <!-- <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable"> 添加用户 </n-button>
      </template> -->
    </BasicTable>
    <SelectModal
      ref="selectModalRef"
      :title="$t('xuanZeBuMenGangWei')"
      type="DeptPost"
      :width="I18n.global.locale.value === 'zh' ? 800 : 840"
      :multiple="false"
      @on-ok="selectModalOk"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { getSysUserList, updateSysUserPost } from '@/api/System/setting/user';
  import { NTag, NIcon } from 'naive-ui';
  import { Edit } from '@vicons/tabler';
  import { SelectModal } from '@/components/SelectModal/index';
  import I18n from '@/lang/index'; //引入i18n组件
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'loginName',
      // labelMessage: '应用名称',
      component: 'NInput',
      label: I18n.global.t('dengLuMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuDengLuMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: 100,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });
  const router = useRouter();
  // Table实例
  const actionRef = ref();
  // 选择弹窗实例
  const selectModalRef: any = ref();
  // 用户id
  const userId: Ref<string> = ref('');
  // 岗位部门id
  const userPostId: Ref<string> = ref('');
  // 用户岗位JSON
  const userPostJson: Ref<string> = ref('');
  // Table表格字段接口
  interface ListData {
    userId: string;
    loginName: string;
    showName: string;
    sysUserPostList: Array<object>;
  }

  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('yongHuId'),
      key: 'userId',
    },
    {
      title: I18n.global.t('yongHuMing'),
      key: 'loginName',
    },
    {
      title: I18n.global.t('niCheng'),
      key: 'showName',
    },
    {
      title: I18n.global.t('buMenGangWeiKeBianJi'),
      key: 'sysUserPostList',
      render(row) {
        if (row.sysUserPostList && row.sysUserPostList.length > 0) {
          return h(
            'div',
            { class: 'tags-box' },
            row.sysUserPostList.map((item: any) => {
              return h(
                NTag,
                {
                  class: 'ml-3 mt-3',
                  type: 'primary',
                  onClick: () => {
                    userId.value = row.userId;
                    userPostId.value = item.userPostId;
                    userPostJson.value = item.deptPostJson;
                    selectModalRef.value.openModal();
                  },
                },
                {
                  default: () =>
                    h('div', { class: 'flex items-center' }, [
                      h(NIcon, { size: 16, component: Edit }),
                      h(
                        'span',
                        { class: 'ml-1' },
                        { default: () => JSON.parse(item.deptPostJson)[0].label }
                      ),
                    ]),
                }
              );
            })
          );
        } else {
          return I18n.global.t('zanWu');
        }
      },
    },
  ];

  // Table表格操作配置
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
            label: I18n.global.t('shengQianJiLu'),
            type: 'primary',
            text: true,
            onClick: handleRecord.bind(null, record),
          },
        ],
      });
    },
  });

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getSysUserList({
      sysUserDtoFilter: { ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  // 跳转至岗位升迁记录
  function handleRecord(record) {
    router.push({
      name: 'promotionRecords',
      query: { userId: record.userId },
    });
  }

  // Table搜索方法
  function onTableSearch() {
    // 搜索重置页码
    actionRef.value.updatePage(1);
    // actionRef.value.reload();
  }

  //部门岗位弹窗确定
  function selectModalOk(selectList) {
    let data = {
      deptPostId: selectList[0].value,
      deptPostJson: JSON.stringify(selectList),
      userId: userId.value,
      userPostId: userPostId.value,
      userPostJson: userPostJson.value,
    };
    updateSysUserPost({ sysUserPostDto: data }).then(() => {
      window['$message'].success(I18n.global.t('gengXinChengGong'));
      actionRef.value.reload();
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
  :deep(.tags-box) {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
</style>
