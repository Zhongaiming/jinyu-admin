<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <template v-if="title">
        <div class="table-toolbar-left-title">
          {{ title }}
          <n-tooltip trigger="hover" v-if="titleTooltip">
            <template #trigger>
              <n-icon size="18" class="ml-1 text-gray-400 cursor-pointer">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            {{ titleTooltip }}
          </n-tooltip>
        </div>
      </template>
      <slot name="tableTitle"></slot>
    </div>

    <div class="flex items-center table-toolbar-right">
      <!--顶部右侧区域-->
      <slot name="toolbar"></slot>

      <!--斑马纹-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="mr-2 table-toolbar-right-icon flex">
            <n-switch v-model:value="isStriped" @update:value="setStriped" />
          </div>
        </template>
        <span>{{ $t('biaoGeBanMaWen') }}</span>
      </n-tooltip>
      <n-divider vertical />

      <!--刷新-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon flex" @click="reload(null)">
            <n-icon size="18">
              <ReloadOutlined />
            </n-icon>
          </div>
        </template>
        <span>{{ $t('shuaXin') }}</span>
      </n-tooltip>

      <!--密度-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon flex">
            <n-dropdown
              @select="densitySelect"
              trigger="click"
              :options="densityOptions"
              v-model:value="tableSize"
            >
              <n-icon size="18">
                <ColumnHeightOutlined />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>{{ $t('miDu') }}</span>
      </n-tooltip>

      <!--表格设置单独抽离成组件-->
      <ColumnSetting />
    </div>
  </div>
  <div class="s-table">
    <n-data-table
      ref="tableElRef"
      v-bind="getBindValues"
      :striped="isStriped"
      :pagination="showPagination ? pagination : false"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
      @update:sorter="handleSortedChange"
    >
      <!-- <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template> -->
    </n-data-table>
  </div>
</template>

<script lang="ts">
  import { ReloadOutlined, ColumnHeightOutlined, QuestionCircleOutlined } from '@vicons/antd';
  import { createTableContext } from './hooks/useTableContext';
  import ColumnSetting from './components/settings/ColumnSetting.vue';
  import { useLoading } from './hooks/useLoading';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { usePagination } from './hooks/usePagination';
  import { basicProps } from './props';
  import { BasicTableProps } from './types/table';
  import { getViewportOffset } from '@/utils/domUtils';
  import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';
  import { isBoolean } from '@/utils/is';
  import I18n from '@/lang/index'; //引入i18n组件
  const densityOptions = [
    {
      type: 'menu',
      label: I18n.global.t('jinCou'),
      key: 'small',
    },
    {
      type: 'menu',
      label: I18n.global.t('moRen'),
      key: 'medium',
    },
    {
      type: 'menu',
      label: I18n.global.t('kuanSong'),
      key: 'large',
    },
  ];

  export default defineComponent({
    components: {
      ReloadOutlined,
      ColumnHeightOutlined,
      ColumnSetting,
      QuestionCircleOutlined,
    },
    props: {
      ...basicProps,
    },
    emits: [
      'fetch-success',
      'fetch-error',
      'update:checked-row-keys',
      'edit-end',
      'edit-cancel',
      'edit-row-end',
      'edit-change',
    ],
    setup(props, { emit }) {
      const deviceHeight = ref(150);
      const tableElRef = ref<ComponentRef>(null);
      const wrapRef = ref<Nullable<HTMLDivElement>>(null);
      let paginationEl: HTMLElement | null;
      const isStriped = ref(false);
      const tableData = ref<Recordable[]>([]);
      const innerPropsRef = ref<Partial<BasicTableProps>>();

      const getProps = computed(() => {
        return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
      });

      const showPagination = computed(() => {
        return props.showPagination;
      });

      const { getLoading, setLoading } = useLoading(getProps);

      const { getPaginationInfo, setPagination } = usePagination(getProps);

      const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(
        getProps,
        {
          getPaginationInfo,
          setPagination,
          tableData,
          setLoading,
        },
        emit
      );
      const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
        useColumns(getProps);

      const state = reactive({
        tableSize: unref(getProps as any).size || 'medium',
        isColumnSetting: false,
      });
      //页码切换
      function updatePage(currentPage) {
        setPagination({ page: currentPage, pageNum: currentPage });
        reload();
      }

      //分页数量切换
      function updatePageSize(size) {
        setPagination({ page: 1, pageNum: 1, pageSize: size });
        reload();
      }

      //密度切换
      function densitySelect(e) {
        state.tableSize = e;
      }

      //选中行
      function updateCheckedRowKeys(rowKeys, rows) {
        emit('update:checked-row-keys', rowKeys, rows);
      }

      function handleSortedChange(sorter) {
        let sortList = getChangeSort(sorter);
        setPagination({ page: 1, pageNum: 1 });
        reload(sortList);
      }

      //获取表格列信息
      // const getColumnsRef = computed(() => getColumns());

      //获取表格列信息
      // const getCacheColumnsRef = computed(() => getCacheColumns());

      //获取表格列信息
      // const getPageColumnsRef = computed(() => getPageColumns());

      //获取表格大小
      const getTableSize = computed(() => state.tableSize);

      //组装表格信息
      const getBindValues = computed(() => {
        const tableData = unref(getDataSourceRef);
        const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';
        return {
          ...unref(getProps),
          loading: unref(getLoading),
          columns: toRaw(unref(getPageColumns)),
          rowKey: unref(getRowKey),
          data: tableData,
          size: unref(getTableSize),
          remote: true,
          maxHeight: maxHeight,
        };
      });

      //获取分页信息
      const pagination = computed(() => toRaw(unref(getPaginationInfo)));

      function setProps(props: Partial<BasicTableProps>) {
        innerPropsRef.value = { ...unref(innerPropsRef), ...props };
      }

      const setStriped = (value: boolean) => (isStriped.value = value);

      const tableAction = {
        reload,
        setColumns,
        setLoading,
        setProps,
        getColumns,
        getPageColumns,
        getCacheColumns,
        setCacheColumnsField,
        emit,
      };

      const getCanResize = computed(() => {
        const { canResize } = unref(getProps);
        return canResize;
      });

      async function computeTableHeight() {
        const table = unref(tableElRef);
        if (!table) return;
        if (!unref(getCanResize)) return;
        const tableEl: any = table?.$el;
        const headEl = tableEl.querySelector('.n-data-table-thead ');
        const { bottomIncludeBody } = getViewportOffset(headEl);
        const headerH = 64;
        let paginationH = 2;
        let marginH = 24;
        if (!isBoolean(unref(pagination))) {
          paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
          if (paginationEl) {
            const offsetHeight = paginationEl.offsetHeight;
            paginationH += offsetHeight || 0;
          } else {
            paginationH += 28;
          }
        }
        let height =
          bottomIncludeBody - (headerH + paginationH + marginH + (props.resizeHeightOffset || 0));
        const maxHeight = props.maxHeight;
        height = maxHeight && maxHeight < height ? maxHeight : height;
        deviceHeight.value = height;
      }

      /**
       * 获取表格的变化排序参数
       * @param {Array} sorter  排序参数
       * @returns {Array} 默认排序参数
       */

      function getChangeSort(sorter) {
        const sortList: any = [];
        if (Array.isArray(sorter)) {
          const newSorter = [...sorter].sort((a, b) => b.sorter.multiple - a.sorter.multiple);
          newSorter.map((item) => {
            if (item.order) {
              sortList.push({
                fieldName: item.columnKey,
                asc: item.order == 'ascend' ? true : false,
              });
            }
          });
        } else {
          if (sorter.order) {
            sortList.push({
              fieldName: sorter.columnKey,
              asc: sorter.order == 'ascend' ? true : false,
            });
          }
        }
        return sortList;
      }

      useWindowSizeFn(computeTableHeight, 280);

      onMounted(() => {
        nextTick(() => {
          computeTableHeight();
        });
      });

      createTableContext({ ...tableAction, wrapRef, getBindValues });

      return {
        ...toRefs(state),
        tableElRef,
        getBindValues,
        getDataSource,
        densityOptions,
        showPagination,
        reload,
        densitySelect,
        updateCheckedRowKeys,
        updatePage,
        updatePageSize,
        handleSortedChange,
        pagination,
        tableAction,
        setStriped,
        isStriped,
      };
    },
  });
</script>
<style lang="less" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 16px 0px;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 600;
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      flex: 1;

      &-icon {
        margin-left: 12px;
        font-size: 16px;
        cursor: pointer;
        color: var(--text-color);

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }
</style>
