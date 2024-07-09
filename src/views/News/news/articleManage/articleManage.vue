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
          <BasicTable
            :columns="columns"
            :request="loadDataTable"
            :row-key="(row:ListData) => row.articleId"
            ref="actionRef"
            :actionColumn="actionColumn"
            @update:checked-row-keys="onCheckedRow"
            :scroll-x="1440"
          >
            <template #tableTitle>
              <n-button type="primary" class="primary-button" @click="addTable">
                {{ $t('tianJiaWenZhang') }}
              </n-button>
              <n-button class="ml-3" :disabled="pushIds.length === 0" @click="handlePsuh(null)">
                {{ $t('piLiangTuiSong') }}
              </n-button>
            </template>
          </BasicTable>
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
          <template #header-extra>
            <n-button
              class="mr-3"
              size="small"
              v-if="articleId"
              @click="handleToDetails(articleId)"
            >
              {{ $t('yuLan') }}
            </n-button>
            <n-button
              type="primary"
              class="mr-3 primary-button"
              @click="handlePsuh(articleId)"
              :disabled="isPush"
              v-if="articleId"
              size="small"
            >
              {{ $t('tuiSong') }}
            </n-button>
          </template>
          <n-grid
            y-gap="20"
            x-gap="30"
            :cols="isOutLink ? '1 s:1 m:1 l:1 xl:1 2xl:1' : '1 s:1 m:2 l:2 xl:2 2xl:2'"
            responsive="screen"
          >
            <n-gi>
              <BasicForm @register="submitRegister" />
            </n-gi>
            <n-gi v-if="!isOutLink">
              <n-form ref="formRef" inline :label-width="80" :model="form" :rules="rules">
                <n-form-item :label="$t('wenZhangNeiRong')" path="content" class="editor-item">
                  <div class="w-full h-full">
                    <tinymce-editor
                      v-model:value="form.content"
                      v-model:defaultValue="tinymceHTML"
                      v-if="!isOutLink"
                    />
                  </div>
                </n-form-item>
              </n-form>
            </n-gi>
          </n-grid>
          <div class="flex justify-end">
            <n-button @click="resetForm">{{ $t('zhongZhi') }}</n-button>
            <n-button type="primary" class="ml-3 primary-button" @click="confirmForm">
              {{ $t('tiJiao') }}
            </n-button>
          </div>
        </n-card>
      </template>
      <BasicModal ref="modalRef" :title="$t('xinWenTuiSong')">
        <div class="mt-5">
          <BasicForm @register="pushRegister" @submit="pushConfirmForm" />
        </div>
      </BasicModal>
    </n-gi>
  </n-grid>
</template>
<script lang="ts" setup>
  import {
    getCmsArticleList,
    getCmsArticleView,
    addCmsArticle,
    updateCmsArticle,
    deleteCmsArticle,
    pushCmsArticle,
    getListAuthType,
  } from '@/api/News/news/articleManage';
  import { useUserStore } from '@/store/modules/user';
  import { transformDataSource, treeDataTranslate } from '@/utils';
  import { getCmsSectionList, cmsSectionDictList } from '@/api/News/news/columnManage';
  import { getCurrentPage } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  import { TableAction, BasicColumn } from '@/components/Table';
  import { FormSchema, useForm } from '@/components/Form/index';
  import TinymceEditor from '@/components/TinymceEditor/TinymceEditor.vue';
  import { useDict } from '@/utils/dict';
  import { Close } from '@vicons/carbon';
  import { BasicModal } from '@/components/Modal/index';
  import I18n from '@/lang/index'; //引入i18n组件
  const cssPrimaryColor = ref(cssConvert('primaryColor', 1));
  const router = useRouter();
  // 获取字典
  const { article_tag, sys_dept_dict } = useDict('article_tag', 'sys_dept_dict');
  // 栏目列表
  const columnList: any = ref([]);
  // 文章id
  const articleId = ref(null);
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
  // Table实例
  const actionRef = ref();
  // 单篇或者列表
  const articleType = ref('');
  // 富文本form实例
  const formRef = ref();
  // 推送弹窗实例
  const modalRef = ref();
  // 富文本内容
  const form = ref({
    content: '',
  });
  // 是否是外链接
  const isOutLink = ref(false);
  // 推送id数组
  const pushIds: Ref<string[]> = ref([]);
  // 是否已推送
  const isPush = ref(false);
  // 富文本默认值
  const tinymceHTML = ref('');

  // 富文本验证规则
  const rules = {
    content: {
      required: true,
      trigger: ['blur', 'input'],
      message: I18n.global.t('wenZhangNeiRongBuNengWeiKong'),
    },
  };
  // 用户信息
  const userStore = useUserStore();
  // 获取所属栏目字典值
  const getColumnListData = async () => {
    getCmsSectionList({ pageParam: { pageNum: 1, pageSize: 9999 } }).then((res) => {
      columnList.value = res.dataList;
      columnObj.value = columnList.value[0];
      defaultSelectedKeys.value.push(columnList.value[0].sectionId);
      listOraddEdit(columnObj.value.type);
    });
  };
  // 栏目选择
  function nodeProps({ option }) {
    return {
      onClick() {
        columnObj.value = option;
        title.value = '';
        pushIds.value = [];
        isBack.value = false;
        listOraddEdit(columnObj.value.type);
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

  // Table表格字段接口
  interface ListData {
    articleId: string;
    title: string;
    author: string;
    showOrder: number;
    hits: number;
    publishTime: string;
  }
  // Table表格表头与数据配置
  const columns: BasicColumn<ListData>[] = [
    {
      type: 'selection',
      key: 'selection',
      width: 80,
    },
    {
      title: I18n.global.t('wenZhangId'),
      key: 'articleId',
    },
    {
      title: I18n.global.t('biaoTi'),
      key: 'title',
    },
    {
      title: I18n.global.t('zuoZhe'),
      key: 'author',
    },
    {
      title: I18n.global.t('paiXu'),
      key: 'showOrder',
    },
    {
      title: I18n.global.t('dianJiLiang'),
      key: 'hits',
    },
    {
      title: I18n.global.t('faBuShiJian'),
      key: 'publishTime',
    },
  ];

  //  获取Table表格数据
  const loadDataTable = async (page, sort) => {
    return await getCmsArticleList({
      cmsArticleDtoFilter: {
        sectionId: columnObj.value.sectionId,
        ...getSearchFieldsValue(),
      },
      pageParam: { ...page },
      orderParam: [...sort],
    });
  };

  // Table表格操作配置
  const actionColumn = reactive({
    width: 220,
    title: I18n.global.t('caoZuo'),
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: I18n.global.t('yuLan'),
            type: 'success',
            text: true,
            onClick: handleToDetails.bind(null, record.articleId),
          },
          {
            label: I18n.global.t('tuiSong'),
            type: 'primary',
            text: true,
            class: 'ml-3',
            disabled: record.isPush === 1,
            onClick: handlePsuh.bind(null, record.articleId),
          },
          {
            label: I18n.global.t('bianJi'),
            type: 'info',
            text: true,
            class: 'ml-3',
            onClick: handleEdit.bind(null, record.articleId),
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

  // Table表格选中行
  function onCheckedRow(rowKeys) {
    pushIds.value = rowKeys;
  }

  // 新增文章
  function addTable() {
    articleId.value = null;
    isList.value = false;
    isBack.value = true;
    title.value = I18n.global.t('xinZengWenZhang');
    form.value.content = '';
    tinymceHTML.value = '';
    getColumnDictData(columnObj.value.sectionId);
    transformDataSource(submitSchemas, [
      {
        key: 'sectionId',
        values: [
          {
            changeKey: 'componentProps.disabled',
            changeValue: false,
          },
        ],
      },
      {
        key: 'outLink',
        values: [
          {
            changeKey: 'isShow',
            changeValue: false,
          },
        ],
      },
      {
        key: 'content',
        values: [
          {
            changeKey: 'isShow',
            changeValue: true,
          },
        ],
      },
    ]);
  }

  // 编辑文章
  function handleEdit(id, showBack = true) {
    isList.value = false;
    isBack.value = showBack;
    form.value.content = '';
    tinymceHTML.value = '';
    getCmsArticleView({ articleId: id }).then((res) => {
      articleId.value = id;
      title.value = I18n.global.t('bianJiWenZhang');
      if (showBack) {
        transformDataSource(submitSchemas, [
          {
            key: 'sectionId',
            values: [
              {
                changeKey: 'componentProps.disabled',
                changeValue: false,
              },
            ],
          },
        ]);
      } else {
        transformDataSource(submitSchemas, [
          {
            key: 'sectionId',
            values: [
              {
                changeKey: 'componentProps.disabled',
                changeValue: true,
              },
            ],
          },
        ]);
      }

      if (res.isOutLink === 1) {
        isOutLink.value = true;
        transformDataSource(submitSchemas, [
          {
            key: 'outLink',
            values: [
              {
                changeKey: 'isShow',
                changeValue: true,
              },
            ],
          },
        ]);
      } else {
        isOutLink.value = false;
        transformDataSource(submitSchemas, [
          {
            key: 'outLink',
            values: [
              {
                changeKey: 'isShow',
                changeValue: false,
              },
            ],
          },
        ]);
      }
      form.value.content = res.content;
      tinymceHTML.value = res.content;
      isPush.value = res.isPush === 1 ? true : false;
      nextTick(() => {
        setSubmitFieldsValue({ ...res });
      });
    });
  }

  // 删除文章
  function handleDelete(record: Recordable) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuWenZhang'),
      content: I18n.global.t('queDingShanChuGaiWenZhang'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteCmsArticle({ articleId: record.articleId }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          getCurrentPage(actionRef, 1);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }
  // 列表或者单篇操作
  const listOraddEdit = (type) => {
    articleType.value = type;
    if (type === '1') {
      // 列表
      isList.value = true;
      nextTick(() => {
        actionRef.value.updatePage(1);
      });
    } else {
      //单篇
      isList.value = false;
      getColumnDictData(columnObj.value.sectionId);
      getColumnArticleData(columnObj.value.sectionId);
    }
  };
  // 获取单篇文章列表
  function getColumnArticleData(sectionId) {
    getCmsArticleList({
      cmsArticleDtoFilter: {
        sectionId,
      },
      pageParam: { pageNum: 1, pageSize: 10 },
      orderParam: [],
    }).then((res) => {
      if (res.dataList.length) {
        handleEdit(res.dataList[0].articleId, false);
      } else {
        title.value = I18n.global.t('xinZengWenZhang');
        articleId.value = null;
        transformDataSource(submitSchemas, [
          {
            key: 'sectionId',
            values: [
              {
                changeKey: 'componentProps.disabled',
                changeValue: true,
              },
            ],
          },
        ]);
      }
    });
  }

  // Table搜索方法
  function onTableSearch() {
    // 搜索重置页码
    actionRef.value.updatePage(1);
  }

  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
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
      rules: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: I18n.global.t('wenZhangBiaoTiBuNengWeiKong'),
        },
      ],
    },
    {
      field: 'sectionId',
      component: 'NCascader',
      label: I18n.global.t('suoShuLanMu'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeSuoShuLanMu'),
        options: [],
        disabled: false,
        labelField: 'name',
        valueField: 'id',
        clearable: true,
        showPath: true,
        filterable: true,
        onUpdateValue: (value: any) => {
          console.log(value);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('suoShuLanMuBuNengWeiKong'),
          trigger: 'change',
        },
      ],
    },
    {
      field: 'tagIdList',
      component: 'NSelect',
      label: I18n.global.t('biaoQian'),
      isShow: true,
      componentProps: {
        multiple: true,
        options: article_tag,
        filterable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'author',
      component: 'NInput',
      label: I18n.global.t('zuoZhe'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuZuoZhe'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'isOutLink',
      component: 'NRadioGroup',
      label: I18n.global.t('shiFouWaiLianJie'),
      isShow: true,
      defaultValue: 2,
      componentProps: {
        options: [
          {
            label: I18n.global.t('shi'),
            value: 1,
          },
          {
            label: I18n.global.t('fou'),
            value: 2,
          },
        ],
        onUpdateValue: (e: any) => {
          if (e === 1) {
            transformDataSource(submitSchemas, [
              {
                key: 'outLink',
                values: [
                  {
                    changeKey: 'isShow',
                    changeValue: true,
                  },
                ],
              },
            ]);
            form.value.content = '';
            tinymceHTML.value = '';
            isOutLink.value = true;
          } else {
            transformDataSource(submitSchemas, [
              {
                key: 'outLink',
                values: [
                  {
                    changeKey: 'isShow',
                    changeValue: false,
                  },
                ],
              },
            ]);
            isOutLink.value = false;
          }
        },
      },
    },
    {
      field: 'outLink',
      component: 'NInput',
      label: I18n.global.t('waiLianJieDiZhi'),
      isShow: false,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuWaiLianJieDiZhi'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'isShow',
      component: 'NRadioGroup',
      label: I18n.global.t('shiFouXianShi'),
      isShow: true,
      defaultValue: 1,
      componentProps: {
        options: [
          {
            label: I18n.global.t('shi'),
            value: 1,
          },
          {
            label: I18n.global.t('fou'),
            value: 2,
          },
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'showOrder',
      component: 'NInputNumber',
      label: I18n.global.t('paiXu'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuPaiXu'),
        min: 1,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'litPic',
      component: 'BasicUpload',
      label: I18n.global.t('suoLveTu'),
      isShow: true,
      componentProps: {
        action: '/common/upload/upload',
        data: { asImage: true },
        name: 'uploadFile',
        width: 100,
        height: 100,
        max: 10,
        helpText: '',
      },
    },
    {
      field: 'description',
      component: 'NInput',
      label: I18n.global.t('miaoShu'),
      isShow: true,
      componentProps: {
        type: 'textarea',
        placeholder: I18n.global.t('qingShuRuMiaoShu'),
        autosize: { minRows: 3 },
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ]);

  const [
    submitRegister,
    {
      setFieldsValue: setSubmitFieldsValue,
      getFieldsValue: getSubmitFieldsValue,
      validate: submitValidate,
      resetFields: submitResetData,
    },
  ] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 150,
    labelPlacement: 'top',
    layout: 'horizontal',
    schemas: submitSchemas,
    showResetButton: false,
    showSubmitButton: false,
  });

  //重置Form表单
  const resetForm = async () => {
    form.value.content = '';
    tinymceHTML.value = '';
    await submitResetData();
    formRef.value?.restoreValidation();
    if (articleType.value === '2') {
      setSubmitFieldsValue({ sectionId: columnObj.value.sectionId });
    }
  };

  // From提交
  const confirmForm = async () => {
    let isValidate = true;
    try {
      await submitValidate();
      isValidate = true;
    } catch {
      isValidate = false;
    }
    if (!isOutLink.value) {
      formRef.value?.validate((errors) => {
        if (!errors && isValidate) {
          addEditArticle();
        } else {
          window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
        }
      });
    } else {
      if (isValidate) {
        addEditArticle();
      } else {
        window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
      }
    }
  };

  // 添加，更新文章操作
  function addEditArticle() {
    if (articleId.value != null) {
      updateCmsArticle({
        cmsArticleDto: {
          articleId: articleId.value,
          ...getSubmitFieldsValue(),
          content: form.value.content,
        },
      }).then(() => {
        window['$message'].success(I18n.global.t('bianJiChengGong'));
      });
    } else {
      addCmsArticle({
        cmsArticleDto: { ...getSubmitFieldsValue(), content: form.value.content },
      }).then((res) => {
        handleEdit(res, articleType.value === '2' ? true : false);
        window['$message'].success(I18n.global.t('tianJiaChengGong'));
      });
    }
  }

  // 获取所属栏目字典值
  const getColumnDictData = async (sectionId) => {
    transformDataSource(submitSchemas, [
      {
        key: 'sectionId',
        values: [
          {
            changeKey: 'componentProps.options',
            changeValue: treeDataTranslate(await cmsSectionDictList({}), 'id', 'parentId'),
          },
        ],
      },
    ]);
    if (sectionId) {
      setSubmitFieldsValue({ sectionId });
    }
  };

  // 推送弹窗
  function handlePsuh(articleIds) {
    if (articleIds) {
      pushIds.value = [articleIds];
    }
    modalRef.value.openModal();
    getAuthType();
  }

  const pushSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'path',
      component: 'NInput',
      label: I18n.global.t('tiaoZhuanLianJie'),
      isShow: true,
      defaultValue: '/news/articleDetails',
      componentProps: {
        placeholder: I18n.global.t('qingShuRuTiaoZhuanLianJie'),
        disabled: true,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'authType',
      component: 'NRadioGroup',
      label: I18n.global.t('shouQuanLeiXing'),
      isShow: true,
      defaultValue: '1',
      componentProps: {
        options: [],
        labelField: 'name',
        valueField: 'id',
        onUpdateValue: (e: any) => {
          if (e === '1') {
            transformDataSource(pushSchemas, [
              {
                key: 'notifyObjectId',
                values: [
                  {
                    changeKey: 'isShow',
                    changeValue: false,
                  },
                ],
              },
            ]);
          } else {
            transformDataSource(pushSchemas, [
              {
                key: 'notifyObjectId',
                values: [
                  {
                    changeKey: 'isShow',
                    changeValue: true,
                  },
                ],
              },
            ]);
          }
        },
      },
    },
    {
      field: 'notifyObjectId',
      component: 'NSelect',
      label: I18n.global.t('tuiSongBuMen'),
      isShow: false,
      componentProps: {
        options: sys_dept_dict,
        multiple: true,
        filterable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          type: 'array',
          message: I18n.global.t('tuiSongBuMenBuNengWeiKong'),
          trigger: 'change',
        },
      ],
    },
  ]);
  const [pushRegister, {}] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 150,
    labelPlacement: 'top',
    layout: 'horizontal',
    schemas: pushSchemas,
    submitButtonText: I18n.global.t('tuiSong'),
    resetButtonText: I18n.global.t('quXiao'),
    submitClassName: 'primary-button',
    resetFunc: () => {
      return new Promise(() => {
        modalRef.value.closeModal();
      });
    },
  });

  // 获取授权部门类型
  const getAuthType = async () => {
    transformDataSource(pushSchemas, [
      {
        key: 'authType',
        values: [
          {
            changeKey: 'componentProps.options',
            changeValue: await getListAuthType({ appId: userStore.appId }),
          },
        ],
      },
    ]);
  };
  // 推送确认
  function pushConfirmForm(form) {
    if (form) {
      pushCmsArticle({
        appId: userStore.appId,
        articleIds: pushIds.value,
        ...form,
        notifyObjectId: JSON.stringify(form.notifyObjectId),
      }).then(() => {
        window['$message'].success(I18n.global.t('tuiSongChengGong'));
        title.value = '';
        isBack.value = false;
        listOraddEdit(columnObj.value.type);
        modalRef.value.closeModal();
      });
    } else {
      window['$message'].info(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }

  // 跳转至文章详情
  function handleToDetails(articleId) {
    router.push({
      name: 'articleDetails',
      query: {
        sectionId: columnObj.value.sectionId,
        articleId,
        type: columnObj.value.type,
      },
    });
  }

  onMounted(() => {
    getColumnListData();
  });
</script>

<style lang="less" scoped>
  .column-info {
    min-height: 425px;
    :deep(.n-tree .n-tree-node) {
      height: 28px !important;
      align-items: center;
    }
  }
  .pro-card {
    min-height: 342px;
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
    min-height: 430px;
  }
  .editor-item {
    min-height: 870px;
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
</style>
