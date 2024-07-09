<template>
  <n-card class="search-card mb-1.5" hoverable>
    <BasicForm @register="register" @submit="onNewsTableSearch" />
  </n-card>
  <n-card :bordered="false" class="pro-card">
    <BasicTable
      :columns="columns"
      :request="loadNewsTable"
      :title="$t('xinWenLieBiao')"
      :row-key="(row) => row.newsId"
      ref="newsTableRef"
      :actionColumn="actionColumn"
      :scroll-x="1440"
    />
  </n-card>
</template>

<script setup lang="ts">
  import { getUserNewsList, readNews } from '@/api/Default/dashboard/news';
  import type { FormSchema } from '@/components/Form';
  import { useForm } from '@/components/Form';
  import { TableAction, BasicColumn } from '@/components/Table';
  import { useDict, getDictLabel, dictTagView } from '@/utils/dict';
  import { useUserStore } from '@/store/modules/user';
  import { NTag } from 'naive-ui';
  import I18n from '@/lang/index'; //引入i18n组件
  const userStore = useUserStore();
  // 初始化ref
  const newsTableRef = ref();
  const router = useRouter();
  // 设置name
  defineOptions({ name: 'NewsManage' });
  // 获取字典
  const { news_type, sys_dept_dict, sys_user_dict, internal_app_dict } = useDict(
    'news_type',
    'sys_dept_dict',
    'sys_user_dict',
    'internal_app_dict'
  );
  // 搜索框字段
  const searchSchema: FormSchema[] = [
    {
      field: 'title',
      label: I18n.global.t('biaoTi'),
      isShow: true,
      component: 'NInput',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuBiaoTi'),
      },
    },
    {
      field: 'newsType',
      label: I18n.global.t('xinWenLeiXing'),
      isShow: true,
      component: 'NSelect',
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeXinWenLeiXing'),
        options: news_type,
        filterable: true,
        clearable: true,
      },
    },
  ];

  // Table表格字段接口
  interface ListData {
    newsId: string;
    notifyType: string;
    notifyObjectId: string | undefined;
    newsType: number;
    deptId: string;
    title: string;
    type: string;
    internalAppId: string;
    createUserId: string;
    createTime: string;
  }
  // 表格字段
  const columns: BasicColumn<ListData>[] = [
    {
      title: I18n.global.t('tuiSongBuMen'),
      key: 'notifyType',
      render: (row) => {
        if (row.notifyType === '1') {
          return I18n.global.t('gongKai');
        } else {
          if (row.notifyObjectId && JSON.parse(row.notifyObjectId).length > 0) {
            return h(
              'div',
              { class: 'tags-box' },
              JSON.parse(row.notifyObjectId).map((item: any) => {
                return h(
                  NTag,
                  {
                    class: 'ml-3 mt-3',
                    bordered: false,
                  },
                  {
                    default: () =>
                      h(
                        'span',
                        {},
                        {
                          default: () =>
                            getDictLabel(sys_dept_dict.value, item, I18n.global.t('weiZhi')),
                        }
                      ),
                  }
                );
              })
            );
          } else {
            return I18n.global.t('zanWu');
          }
        }
      },
    },

    {
      title: I18n.global.t('suoShuBuMen'),
      key: 'deptId',
      render: (row) =>
        dictTagView(getDictLabel(sys_dept_dict.value, row.deptId, I18n.global.t('weiZhi'))),
    },
    {
      title: I18n.global.t('biaoTi'),
      key: 'title',
    },
    {
      title: I18n.global.t('xinWenLeiXing'),
      key: 'type',
      render(row) {
        return dictTagView(getDictLabel(news_type.value, row.newsType));
      },
    },
    {
      title: I18n.global.t('tuiSongYingYong'),
      key: 'internalAppId',
      render(row) {
        return dictTagView(getDictLabel(internal_app_dict.value, row.internalAppId), {
          bordered: false,
        });
      },
    },
    {
      title: I18n.global.t('chuangJianZhe'),
      key: 'createUserId',
      render: (row) =>
        dictTagView(getDictLabel(sys_user_dict.value, row.createUserId, I18n.global.t('weiZhi'))),
    },
    {
      title: I18n.global.t('chuangJianShiJian'),
      key: 'createTime',
    },
  ];
  // 点击提交
  const onNewsTableSearch = () => {
    // 搜索重置页码
    newsTableRef.value.updatePage(1);
  };
  // 表格操作
  const actionColumn = reactive({
    width: 100,
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
            disabled: record.userType === '0',
            onClick: handleView.bind(null, record),
          },
        ],
      });
    },
  });
  // 查看消息
  const handleView = (newsData) => {
    readNews({ newsId: newsData.newsId })
      .then(async () => {
        const app = userStore.appList.find((item) => item.appId === newsData.internalAppId);
        if (app) {
          await userStore.changeApp(router, app, newsData.link);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // 加载表格数据
  const loadNewsTable = async (page, sort) => {
    return await getUserNewsList({
      newsDtoFilter: { ...getSearchsValue() },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };
  const [register, { getFieldsValue: getSearchsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    collapsedRows: 3,
    labelWidth: 100,
    submitOnReset: true,
    schemas: searchSchema,
    submitClassName: 'primary-button',
  });
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

  :deep(.tags-box) {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
</style>
