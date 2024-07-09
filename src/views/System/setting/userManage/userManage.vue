<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
  </n-card>
  <n-card :bordered="false" class="pro-card">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.userId"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1440"
    >
      <template #tableTitle>
        <n-button type="primary" class="primary-button" @click="addTable">
          {{ $t('tianJiaYongHu') }}
        </n-button>
      </template>
    </BasicTable>
  </n-card>
  <!-- 2024/0703 -->
  <BasicModal ref="modalBuyRef" title="积分充值">
    <div class="mt-5">
      <n-form>
        <n-form-item label="充值积分">
          <n-input v-model:value="operaItem.integral" type="text" placeholder="请输入" />
        </n-form-item>
        <n-form-item class="form-botton-wrapper">
          <n-button @click="closeBuyModel">取消</n-button>
          <n-button class="marginLeft" type="info" @click="handleBuyClick"> 确认购买 </n-button>
        </n-form-item>
      </n-form>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
import { TableAction, BasicColumn } from '@/components/Table';
import { FormSchema, useForm } from '@/components/Form/index';
import { BasicImage } from '@/components/Image/index';
import { getSysUserList, deleteSysUser, resetPasswordSysUser } from '@/api/System/setting/user';
import { useDict, getDictLabel } from '@/utils/dict';
import { getCurrentPage } from '@/utils/index';
import I18n from '@/lang/index'; //引入i18n组件
/**
 * @description:
 * @return {*}
 * @Date: 2024-07-03 19:25:17
 */
import INTEGRAL from '@/api/atmosphere/atmosphereUserIntegral';
const modalBuyRef: any = ref();
const operaItem = ref<Recordable>({})
// 获取字典
const { user_status, user_type } = useDict('user_status', 'user_type');
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
  {
    field: 'userStatus',
    // labelMessage: '应用类型',
    component: 'NSelect',
    label: I18n.global.t('yongHuZhuangTai'),
    isShow: true,
    componentProps: {
      placeholder: I18n.global.t('qingXuanZeYongHuZhuangTai'),
      options: user_status,
      filterable: true,
      onUpdateValue: (e: any) => {
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
// Table表格字段接口
interface ListData {
  userId: string;
  loginName: string;
  showName: string;
  userType: string;
  userStatus: string;
  headImageUrl: string;
  createTime: string;
  userIntegral: number;
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
    title: I18n.global.t('yonHuJiFen'),
    key: 'userIntegral',
  },
  {
    title: I18n.global.t('niCheng'),
    key: 'showName',
  },
  {
    title: I18n.global.t('zhangHaoLeiXing'),
    key: 'userType',
    render(row) {
      return getDictLabel(user_type.value, row.userType);
    },
  },
  {
    title: I18n.global.t('zhuangTai'),
    key: 'userStatus',
    render(row) {
      return getDictLabel(user_status.value, row.userStatus);
    },
  },
  {
    title: I18n.global.t('yongHuTouXiang'),
    key: 'headImageUrl',
    render(row) {
      return h(BasicImage, {
        width: 56,
        height: 56,
        src: row.headImageUrl,
      });
    },
  },
  {
    title: I18n.global.t('chuangJianShiJian'),
    key: 'createTime',
  },
];

// Table表格操作配置
const actionColumn = reactive({
  width: 260,
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
          disabled: record.userType === '0',
          onClick: handleEdit.bind(null, record),
        },
        {
          label: I18n.global.t('shanChu'),
          type: 'error',
          text: true,
          class: 'ml-3',
          disabled: record.userType === '0',
          onClick: handleDelete.bind(null, record),
        },
        {
          label: I18n.global.t('zhongZhiMiMa'),
          type: 'success',
          text: true,
          class: 'ml-3',
          onClick: handleResetPassword.bind(null, record),
        },
        {
          label: I18n.global.t('JiFenChongZhi'),
          type: 'warning',
          text: true,
          class: 'ml-3',
          onClick: handlePointsUp.bind(null, record),
        },
      ],
    });
  },
});

// 新增用户弹窗
function addTable() {
  router.push({ name: 'addEditUser' });
}

// 编辑用户弹窗
function handleEdit(record: Recordable) {
  router.push({ name: 'addEditUser', query: { userId: record.userId } });
}

// 删除用户
function handleDelete(record: Recordable) {
  window['$dialog'].info({
    title: I18n.global.t('shanChuYongHu'),
    content: I18n.global.t('queDingShanChuGaiYongHu'),
    positiveText: I18n.global.t('queDing'),
    negativeText: I18n.global.t('quXiao'),
    onPositiveClick: () => {
      deleteSysUser({ userId: record.userId }).then(() => {
        window['$message'].success(I18n.global.t('shanChuChengGong'));
        getCurrentPage(actionRef, 1);
      });
    },
    onNegativeClick: () => {
      console.log(I18n.global.t('quXiao'));
    },
  });
}
// 重置密码
function handleResetPassword(record: Recordable) {
  window['$dialog'].info({
    title: I18n.global.t('zhongZhiMiMa'),
    content: I18n.global.t('shiFouZhongZhiGaiYongHuMiMa'),
    positiveText: I18n.global.t('queDing'),
    negativeText: I18n.global.t('quXiao'),
    onPositiveClick: () => {
      resetPasswordSysUser({ userId: record.userId }).then(() => {
        window['$message'].success(I18n.global.t('zhongZhiChengGong'));
        reloadTable();
      });
    },
    onNegativeClick: () => {
      console.log('取消');
    },
  });
}

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

// Table表格刷新
function reloadTable() {
  actionRef.value.reload();
}

// Table搜索方法
function onTableSearch() {
  // 搜索重置页码
  actionRef.value.updatePage(1);
}

/**
 * @description: 积分充值
 * @return {*}
 * @Date: 2024-07-03 19:28:08
 */
// 积分充值
function handlePointsUp(record: Recordable) {
  operaItem.value = record;
  operaItem.value['integral'] = null;
  modalBuyRef.value.openModal();
}
function closeBuyModel() {
  modalBuyRef.value.closeModal();
}
function handleBuyClick() {
  if (!operaItem.value.integral) {
    return window['$message'].error(I18n.global.t('QingBuQuanXinXi'));
  }
  window['$dialog'].info({
    title: I18n.global.t('JiFenChongZhi'),
    content: '确定给该用户充值积分吗？',
    positiveText: I18n.global.t('queDing'),
    negativeText: I18n.global.t('quXiao'),
    onPositiveClick: () => {
      INTEGRAL.add({ atmosphereUserIntegralDto: { integral: operaItem.value.integral, userId: operaItem.value.userId } }).then(() => {
        window['$message'].success('购买成功');
        getCurrentPage(actionRef, 1);
        closeBuyModel()
      });
    },
    onNegativeClick: () => {
      console.log(I18n.global.t('quXiao'));
    },
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

.form-botton-wrapper {
  display: flex;
  justify-content: flex-end;

  .marginLeft {
    margin-left: 12px;
  }
}
</style>
