import type { BasicTableProps } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import { isBoolean, isFunction } from '@/utils/is';
import { APISETTING } from '../const';

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { getPaginationInfo, setPagination, setLoading, tableData },
  emit
) {
  const dataSourceRef = ref<Recordable[]>([]);

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource }: any = unref(propsRef);
      dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  const getRowKey = computed(() => {
    const { rowKey }: any = unref(propsRef);
    return rowKey
      ? rowKey
      : () => {
          return 'key';
        };
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  async function fetch(sortOpt?) {
    try {
      setLoading(true);
      const { request, pagination, beforeRequest, afterRequest, columns }: any = unref(propsRef);
      if (!request) return;
      //组装分页信息
      const pageField = APISETTING.pageField;
      const sizeField = APISETTING.sizeField;
      const totalField = APISETTING.totalField;
      const listField = APISETTING.listField;
      const itemCount = APISETTING.countField;
      let pageParams = {};
      const { pageNum = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps;
      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {};
      } else {
        // pageParams[pageField] = (opt && opt[pageField]) || pageNum;
        pageParams[pageField] = pageNum;
        pageParams[sizeField] = pageSize;
      }
      let params = {
        ...pageParams,
      };
      const sort = sortOpt || getDefaultSort(columns);
      if (beforeRequest && isFunction(beforeRequest)) {
        // The params parameter can be modified by outsiders
        params = (await beforeRequest(params, sort)) || params;
      }
      const res = await request(params, sort);
      const resultTotal = res && res[totalField];
      const currentPage = res && res[pageField];
      const total = res && res[itemCount];

      // const results = res[listField] ? res[listField] : [];
      // 如果数据异常，需获取正确的页码再次执行
      // if (resultTotal) {
      //   const currentTotalPage = Math.ceil(total / pageSize);
      // if (pageNum > currentTotalPage) {
      //   setPagination({
      //     page: currentTotalPage,
      //     itemCount: total,
      //   });
      //   return await fetch(opt);
      // }
      // }
      let resultInfo = res && res[listField] ? res[listField] : [];
      if (afterRequest && isFunction(afterRequest)) {
        // can modify the data returned by the interface for processing
        resultInfo = (await afterRequest(resultInfo)) || resultInfo;
      }
      dataSourceRef.value = resultInfo;
      setPagination({
        page: currentPage,
        pageNum: currentPage,
        pageCount: resultTotal,
        itemCount: total,
      });
      // if (opt && opt[pageField]) {
      //   setPagination({
      //     page: opt[pageField] || 1,
      //   });
      // }
      emit('fetch-success', {
        items: unref(resultInfo),
        resultTotal,
      });
    } catch (error) {
      console.error(error);
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        pageCount: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  function setTableData(values) {
    dataSourceRef.value = values;
  }

  function getDataSource(): any[] {
    return getDataSourceRef.value;
  }

  async function reload(opt?) {
    await fetch(opt);
  }

  /**
   * 获取表格的默认排序参数
   * @param {Array} columns  表格表头
   * @returns {Array} 默认排序参数
   */
  function getDefaultSort(columns) {
    const sortList: any = [];
    columns.map((item) => {
      if (item.defaultSortOrder) {
        sortList.push({
          fieldName: item.key,
          asc: item.defaultSortOrder == 'ascend' ? true : false,
        });
      }
    });
    return sortList;
  }

  return {
    fetch,
    getRowKey,
    getDataSourceRef,
    getDataSource,
    setTableData,
    reload,
  };
}
