<template>
  <n-grid y-gap="20" x-gap="0" cols="6" item-responsive responsive="screen">
    <n-gi span="6 s:6 m:2 l:2 xl:1 2xl:1">
      <n-card title="" class="column-info" hoverable>
        <n-tree
          block-line
          :data="columnList"
          :default-selected-keys="defaultSelectedKeys"
          key-field="sectionId"
          label-field="title"
          children-field="children"
          :node-props="nodeProps"
          default-expand-all
          selectable
        />
      </n-card>
    </n-gi>
    <n-gi span="6 s:6 m:4 l:4 xl:5 2xl:5">
      <template v-if="isList">
        <n-card class="search-card mb-1.5" hoverable>
          <BasicForm @register="searchRegister" @submit="onTableSearch" />
        </n-card>
        <n-card :bordered="false" class="pro-card" hoverable>
          <div v-if="articleList.length">
            <div
              class="flex items-center mt-5 article-list"
              v-for="item in articleList"
              :key="item.articleId"
              @click="toArticleDetails(item.articleId)"
            >
              <BasicImage
                width="160"
                height="128"
                :src="imgFilter(item.litPic)"
                :other="{ objectFit: 'cover' }"
              />
              <div class="ml-3 h-32 flex flex-col justify-between">
                <div>
                  <div class="text-lg">
                    {{ item.title }}
                  </div>
                  <div class="text-base text-gray-500 mt-2">
                    {{ item.description }}
                  </div>
                </div>

                <div class="text-gray-400"> {{ $t('faBuShiJian') }}：{{ item.publishTime }} </div>
              </div>
            </div>

            <div class="flex items-center justify-end mt-10">
              <n-pagination
                v-model:page="pagination.pageNum"
                v-model:page-size="pagination.pageSize"
                :item-count="pagination.total"
                show-size-picker
                :page-sizes="[6, 12, 18, 24, 30]"
                @update:page="articlePageChange"
                @update:page-size="articlePageSizeChange"
              />
            </div>
          </div>
          <div v-else>
            <div class="h-56 flex items-center justify-center">
              <n-empty :description="$t('zanWuShuJu')" />
            </div>
          </div>
        </n-card>
      </template>
      <template v-else>
        <n-card :title="title" class="article-info" hoverable>
          <div
            class="page-close-box"
            v-if="isBack"
            @click="
              isList = true;
              isBack = false;
              title = '';
            "
          >
            <div>
              <n-icon size="20">
                <Close />
              </n-icon>
            </div>
          </div>
          <div class="article-details" v-if="articleDetails">
            <div class="text-2xl text-black text-center">
              {{ articleDetails.title }}
            </div>
            <div class="flex items-center justify-center mt-5">
              <span class="text-base text-gray-400"
                >{{ $t('faBuShiJian') }}：{{ articleDetails.publishTime }}</span
              >
              <span class="text-base ml-5 text-gray-400"
                >{{ $t('yuLanCiShu') }}：{{ articleDetails.hits || 0 }}</span
              >
              <span class="text-base ml-5 text-gray-400"
                >{{ $t('zuoZhe') }}：{{ articleDetails.author || $t('zanWu') }}</span
              >
            </div>
            <div
              class="article-content mt-10"
              v-dompurify-html="articleDetails.content"
              v-if="articleDetails.isOutLink === 2"
            ></div>
            <n-spin class="mt-10" :show="loading" v-else>
              <div class="frame">
                <iframe :src="articleDetails.outLink" class="frame-iframe" ref="frameRef"></iframe>
              </div>
            </n-spin>
          </div>
          <div v-else>
            <div class="h-64 flex items-center justify-center">
              <n-empty :description="$t('zanWuShuJu')" />
            </div>
          </div>
        </n-card>
      </template>
    </n-gi>
  </n-grid>
</template>
<script lang="ts" setup>
  import { getCmsArticleList, getCmsArticleView } from '@/api/News/news/articleManage';
  import { getCmsSectionList } from '@/api/News/news/columnManage';
  import { cssConvert } from '@/hooks/useThemeVars';
  import { FormSchema, useForm } from '@/components/Form/index';
  import { Close } from '@vicons/carbon';
  import I18n from '@/lang/index'; //引入i18n组件
  const cssPrimaryColor = ref(cssConvert('primaryColor', 1));
  const route = useRoute();
  // 栏目列表
  const columnList: any = ref([]);
  // 弹出层标题
  const title = ref('');
  // 栏目对象
  const columnObj: any = ref({});
  // 默认选中的key
  const defaultSelectedKeys: any = ref([]);
  // 是否是列表
  const isList = ref(true);
  // 是否显示返回
  const isBack = ref(false);
  // 文章列表
  const articleList: any = ref([]);
  // 文章详情
  const articleDetails: any = ref(null);
  // 是否是单篇
  const type = ref(null);
  // 栏目id
  const sectionId = ref(null);
  const frameRef = ref<HTMLFrameElement | null>(null);
  // iframe loading
  const loading = ref(false);
  // 文章列表页码
  const pagination = reactive({
    pageNum: 1,
    pageSize: 6,
    totalPage: 0,
    total: 0,
  });
  // 获取所属栏目字典值
  const getColumnListData = async () => {
    getCmsSectionList({ pageParam: { pageNum: 1, pageSize: 9999 } }).then((res) => {
      columnList.value = res.dataList;
      columnObj.value = columnList.value[0];
      sectionId.value = (route.query && route.query.sectionId) || columnList.value[0].sectionId;
      type.value = (route.query && route.query.type) || columnObj.value.type;
      defaultSelectedKeys.value.push(sectionId.value);
      listOraddEdit(route.query && route.query.articleId);
    });
  };
  // 栏目选择
  function nodeProps({ option }) {
    return {
      onClick() {
        columnObj.value = option;
        title.value = '';
        isBack.value = false;
        sectionId.value = columnObj.value.sectionId;
        type.value = columnObj.value.type;
        listOraddEdit();
      },
    };
  }

  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      component: 'NInput',
      label: I18n.global.t('wenZhangBiaoTi'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuWenZhangBiaoTi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: 80,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  //  获取Table表格数据
  const loadDataTable = () => {
    getCmsArticleList({
      cmsArticleDtoFilter: {
        sectionId: sectionId.value,
        ...getSearchFieldsValue(),
      },
      pageParam: { pageNum: pagination.pageNum, pageSize: pagination.pageSize },
      orderParam: [],
    }).then((res) => {
      articleList.value = res.dataList;
      pagination.totalPage = res.pageCount;
      pagination.total = res.totalCount;
    });
  };

  // 列表或者单篇操作
  const listOraddEdit = (articleId?) => {
    if (type.value === '1') {
      if (articleId) {
        handleView(route.query.articleId);
      } else {
        // 列表
        isList.value = true;
        loadDataTable();
      }
    } else {
      //单篇
      isList.value = false;
      getColumnArticleData();
    }
  };
  // 获取单篇文章列表
  function getColumnArticleData() {
    getCmsArticleList({
      cmsArticleDtoFilter: {
        sectionId: sectionId.value,
      },
      pageParam: { pageNum: 1, pageSize: 10 },
      orderParam: [],
    }).then((res) => {
      if (res.dataList.length) {
        handleView(res.dataList[0].articleId);
      }
    });
  }
  //点击文章列表
  function toArticleDetails(articleId) {
    isBack.value = true;
    handleView(articleId);
  }

  // 获取文章详情
  function handleView(articleId) {
    isList.value = false;
    getCmsArticleView({ articleId }).then((res) => {
      articleDetails.value = res;
      if (articleDetails.value.isOutLink === 1) {
        loading.value = true;
        init();
      }
    });
  }

  function hideLoading() {
    loading.value = false;
  }

  function init() {
    nextTick(() => {
      const iframe = unref(frameRef);
      if (!iframe) return;
      const _frame = iframe as any;
      if (_frame.attachEvent) {
        _frame.attachEvent('onload', () => {
          hideLoading();
        });
      } else {
        iframe.onload = () => {
          hideLoading();
        };
      }
    });
  }

  // 搜索
  function onTableSearch() {
    pagination.pageNum = 1;
    loadDataTable();
  }
  // 切换页码
  function articlePageChange(page) {
    pagination.pageNum = page;
    loadDataTable();
  }
  // 切换分页大小
  function articlePageSizeChange(pageSize) {
    pagination.pageSize = pageSize;
    loadDataTable();
  }

  // 图片过滤
  function imgFilter(litPic) {
    if (!litPic) {
      return new URL('@/assets/images/noImg.png', import.meta.url).href;
    } else {
      return litPic.split(',')[0];
    }
  }

  onMounted(() => {
    getColumnListData();
  });
</script>

<style lang="less" scoped>
  .column-info {
    min-height: 350px;
    :deep(.n-tree .n-tree-node) {
      height: 28px !important;
      align-items: center;
    }
  }
  .pro-card {
    min-height: 267px;
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

  .article-info {
    position: relative;
    min-height: 350px;
    :deep(.n-card__content) {
      padding: 30px 24px !important;
    }
  }
  .article-list:first-child {
    margin-top: 0px !important;
  }
  .page-close-box {
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
    border-width: 22px;
    border-style: dashed;
    border-color: v-bind(cssPrimaryColor) v-bind(cssPrimaryColor) transparent transparent; // 上 右 下 左
    text-align: center;
    color: #ffffff;
    div {
      position: relative;
      top: -17px;
      left: -2px;
    }
  }

  .frame {
    width: 100%;
    height: calc(80vh - 2.5rem);

    &-iframe {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
