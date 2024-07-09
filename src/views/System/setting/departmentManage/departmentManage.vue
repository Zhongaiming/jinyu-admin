<template>
  <n-card :bordered="false" class="pro-card mb-3">
    <BasicForm @register="searchRegister" @submit="onTableSearch" />
    <!-- </n-card> -->
    <!-- <n-card :bordered="false" class="pro-card"> -->
    <div class="dept-box">
      <vue3-tree-org
        ref="treeOrg"
        :data="deptObj"
        :props="{
          id: 'deptId',
          label: 'deptName',
          pid: 'parentId',
          children: 'children',
        }"
        :define-menus="defineMenus"
        center
        :default-expand-level="9999"
        collapsable
        :node-draggable="false"
        :filter-node-method="filterNodeMethod"
        @on-contextmenu="onMenus"
      >
        <!-- 自定义节点内容 -->
        <template #default="{ node }">
          <div class="tree-org-node__text node-label">
            <div class="custom-content">{{ $t('buMenMingCheng') }}：{{ node.label }}</div>
          </div>
        </template>
        <!-- 自定义展开按钮 -->
        <!-- <template v-slot:expand="{ node }">
          <div>{{ node.children.length }}</div>
        </template> -->
      </vue3-tree-org>
    </div>
    <BasicModal
      ref="modalRef"
      :title="title"
      :width="I18n.global.locale.value === 'zh' ? 446 : 480"
    >
      <div class="mt-5">
        <BasicForm @register="submitRegister" @submit="confirmForm" />
      </div>
    </BasicModal>
  </n-card>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form/index';
  import { BasicModal } from '@/components/Modal/index';
  import { treeDataTranslate, transformDataSource } from '@/utils';
  import {
    getSysDeptList,
    getSysDeptView,
    addSysDept,
    updateSysDept,
    getDeptListDict,
    deleteSysDept,
  } from '@/api/System/setting/department';
  import I18n from '@/lang/index'; //引入i18n组件
  // treeOrg实例
  const treeOrg: any = ref('');
  // 部门id(用于编辑)
  const deptId = ref(null);
  // 部门对象
  const deptObj: any = ref({});
  // 搜索Form配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'deptName',
      // labelMessage: '部门名称',
      component: 'NInput',
      label: I18n.global.t('buMenMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuBuMenMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const [searchRegister, { getFieldsValue: getSearchFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 xxl:5' },
    labelWidth: I18n.global.locale.value === 'zh' ? 70 : 140,
    showAdvancedButton: true,
    schemas: searchSchemas,
    submitClassName: 'primary-button',
  });

  // 右键菜单默认配置
  const defineMenus = [
    { name: I18n.global.t('xinZengZiBuMen'), command: 'addDept' },
    { name: I18n.global.t('bianJiBuMen'), command: 'editDept' },
    { name: I18n.global.t('buMenGangWei'), command: 'deptPost' },
    { name: I18n.global.t('shanChuBuMen'), command: 'delDept' },
  ];

  // 右键菜单
  function onMenus({ node, command }) {
    console.log(node, command);
    if (command === 'addDept') {
      addTable(node.id);
    } else if (command === 'editDept') {
      handleEdit(node.id);
    } else if (command === 'deptPost') {
      handleToDepartmentManage(node.id);
    } else if (command === 'delDept') {
      handleDelete(node.id);
    }
  }

  const router = useRouter();
  // 弹出层实例
  const modalRef: any = ref();
  // 弹出层标题
  const title = ref('');

  // 提交Form配置
  const submitSchemas: Ref<FormSchema[]> = ref([
    {
      field: 'parentId',
      component: 'NCascader',
      label: I18n.global.t('suoShuBuMen'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingXuanZeSuoShuBuMen'),
        options: [],
        labelField: 'name',
        valueField: 'id',
        clearable: true,
        showPath: true,
        filterable: true,
        onUpdateValue: (value: any) => {
          console.log(value);
        },
      },
      // slot: 'cascaderSlot',
      rules: [
        {
          required: true,
          message: I18n.global.t('suoShuBuMenBuNengWeiKong'),
          trigger: 'change',
        },
      ],
    },
    {
      field: 'deptName',
      component: 'NInput',
      label: I18n.global.t('buMenMingCheng'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuBuMenMingCheng'),
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('buMenMingChengBuNengWeiKong'),
          trigger: ['blur', 'input'],
        },
      ],
    },
    {
      field: 'showOrder',
      component: 'NInputNumber',
      label: I18n.global.t('xianShiShunXu'),
      isShow: true,
      componentProps: {
        placeholder: I18n.global.t('qingShuRuXianShiShunXu'),
        min: 1,
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [
        {
          required: true,
          message: I18n.global.t('xianShiShunXuBuNengWeiKong'),
          type: 'number',
          trigger: ['blur', 'input'],
        },
      ],
    },
  ]);

  const [submitRegister, { setFieldsValue: setSubmitFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: I18n.global.locale.value === 'zh' ? 120 : 160,
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

  // 新增部门弹窗
  function addTable(parentId) {
    title.value = I18n.global.t('xinZengBuMen');
    modalRef.value.openModal();
    deptId.value = null;
    nextTick(() => {
      setSubmitFieldsValue({ parentId });
    });
  }

  // 编辑部门弹窗
  function handleEdit(id) {
    getSysDeptView({ deptId: id }).then((res) => {
      deptId.value = id;
      title.value = I18n.global.t('bianJiBuMen');
      modalRef.value.openModal();
      nextTick(() => {
        setSubmitFieldsValue(res);
      });
    });
  }
  // 删除部门
  function handleDelete(deptId) {
    window['$dialog'].info({
      title: I18n.global.t('shanChuBuMen'),
      content: I18n.global.t('queDingShanChuGaiBuMen'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        deleteSysDept({ deptId }).then(() => {
          window['$message'].success(I18n.global.t('shanChuChengGong'));
          loadDataTable();
          // let reduceNum = record.parentId ? 0 : 1;
          // getCurrentPage(actionRef, reduceNum);
        });
      },
      onNegativeClick: () => {
        console.log('取消');
      },
    });
  }

  //  获取Table表格数据
  function loadDataTable() {
    getSysDeptList({
      sysDeptDtoFilter: { ...getSearchFieldsValue() },
      pageParam: { pageNum: 1, pageSize: 9999 },
    }).then((res) => {
      deptObj.value = treeDataTranslate(res.dataList, 'deptId', 'parentId', 'showOrder')[0];
    });
  }

  // 获取动态字典值
  const getDynamicDictionaryData = async () => {
    transformDataSource(submitSchemas, [
      {
        key: 'parentId',
        values: [
          {
            changeKey: 'componentProps.options',
            changeValue: treeDataTranslate(await getDeptListDict({}), 'id', 'parentId'),
          },
        ],
      },
    ]);
  };

  // Table搜索方法
  function onTableSearch() {
    loadDataTable();
    // treeOrg.value.filter(getSearchFieldsValue().deptName);
  }

  // 树组件搜索方法
  function filterNodeMethod(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }

  // 弹窗From提交
  function confirmForm(form) {
    if (form) {
      if (deptId.value != null) {
        updateSysDept({ sysDeptDto: { deptId: deptId.value, ...form } }).then(() => {
          window['$message'].success(I18n.global.t('bianJiChengGong'));
          modalRef.value.closeModal();
          loadDataTable();
        });
      } else {
        addSysDept({ sysDeptDto: form }).then(() => {
          window['$message'].success(I18n.global.t('xinJianChengGong'));
          modalRef.value.closeModal();
          loadDataTable();
        });
      }
    } else {
      window['$message'].error(I18n.global.t('qingTianXieWanZhengXinXi'));
    }
  }
  // 跳转至部门岗位管理
  function handleToDepartmentManage(deptId) {
    router.push({ name: 'departmentPost', query: { deptId } });
  }

  onMounted(() => {
    loadDataTable();
    getDynamicDictionaryData();
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
  .dept-box {
    height: calc(100vh - 220px);
  }
  .tree-org-node__text {
    text-align: left;
    font-size: 14px;
  }
  :deep(.tree-org-node__inner) {
    border: 1px solid #ffffff;
    box-shadow: var(--n-box-shadow);
    background-color: var(--n-color);
    color: var(--n-text-color);
  }
  :deep(.zm-tree-org) {
    background: none;
  }
</style>
