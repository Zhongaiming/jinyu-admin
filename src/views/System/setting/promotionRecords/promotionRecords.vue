<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card class="pro-card" hoverable>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :title="$t('gangWeiShengQianJiLu')"
      :row-key="(row:ListData) => row.userPostJson"
      ref="actionRef"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <!-- <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable"> 添加用户 </n-button>
      </template> -->
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { sysUserPostList } from '@/api/System/setting/user';
  import { NTag } from 'naive-ui';
  import I18n from '@/lang/index'; //引入i18n组件
  const route = useRoute();
  // Table实例
  const actionRef = ref();
  // 用户id
  const userId = ref();
  // 变更前部门岗位选项
  // const userPostOption: any = ref([]);
  // 变更后部门岗位选项
  const deptPostOption: any = ref([]);
  // Table表格字段接口
  interface ListData {
    userPostJson: string;
    deptPostJson: string;
  }
  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('bianGengQianBuMenGangWei'),
      key: 'deptPostJson',
      render(row) {
        if (row.userPostJson && JSON.parse(row.userPostJson).length > 0) {
          return h(
            'div',
            { class: 'tags-box' },
            JSON.parse(row.userPostJson).map((item: any) => {
              return h(
                NTag,
                {
                  class: 'ml-3 mt-3',
                  type: 'primary',
                },
                {
                  default: () => item.label,
                }
              );
            })
          );
        } else {
          return I18n.global.t('zanWu');
        }
      },
    },
    {
      title: I18n.global.t('bianGengHouBuMenGangWei'),
      key: 'deptPostJson',
      render(row) {
        if (row.deptPostJson && JSON.parse(row.deptPostJson).length > 0) {
          return h(
            'div',
            { class: 'tags-box' },
            JSON.parse(row.deptPostJson).map((item: any) => {
              return h(
                NTag,
                {
                  class: 'ml-3 mt-3',
                  type: 'primary',
                },
                {
                  default: () => item.label,
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

  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    // {
    //   field: "userPostId",
    //   // labelMessage: '应用类型',
    //   component: "NSelect",
    //   label: "变更前部门岗位",
    //   isShow: true,
    //   componentProps: {
    //     placeholder: "请选择变更前部门岗位",
    //     options: userPostOption.value,
    //     onUpdateValue: (e: any) => {
    //       console.log(e);
    //     },
    //   },
    // },
    {
      field: 'deptPostId',
      // labelMessage: '应用类型',
      component: 'NSelect',
      label: I18n.global.t('bianGengHouBuMenGangWei'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeBianGengHouBuMenGangWei'),
        options: deptPostOption.value,
        filterable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps:
      I18n.global.locale.value === 'zh'
        ? { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' }
        : { cols: '1 s:1 m:2 l:3 xl:3 xxl:3' },
    labelWidth: I18n.global.locale.value === 'zh' ? 120 : 240,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await sysUserPostList({
      sysUserPostDtoFilter: { userId: userId.value, ...getSearchFieldsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  // Table搜索方法
  function onTableSearch() {
    // 搜索重置页码
    actionRef.value.updatePage(1);
    // actionRef.value.reload();
  }

  // 获取变更前后岗位筛选项
  function getDeptPostOption() {
    sysUserPostList({
      sysUserPostDtoFilter: { userId: userId.value },
      pageParam: { pageNum: 1, pageSize: 9999 },
      orderParam: [],
    }).then((res) => {
      for (let i = 0; i < res.dataList.length; i++) {
        // if (res.dataList[i].userPostJson) {
        //   userPostOption.value.push(JSON.parse(res.dataList[i].userPostJson)[0]);
        // }
        if (res.dataList[i].deptPostJson) {
          deptPostOption.value.push(JSON.parse(res.dataList[i].deptPostJson)[0]);
        }
      }
    });
  }

  onMounted(() => {
    userId.value = route.query && route.query.userId;
    getDeptPostOption();
  });
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
