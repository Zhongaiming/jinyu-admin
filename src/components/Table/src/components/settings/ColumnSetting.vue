<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="cursor-pointer table-toolbar-right-icon flex">
        <n-popover
          trigger="click"
          :width="i18n.locale.value === 'zh' ? 230 : 400"
          class="toolbar-popover"
          placement="bottom-end"
        >
          <template #trigger>
            <n-icon size="18">
              <SettingOutlined />
            </n-icon>
          </template>
          <template #header>
            <div class="table-toolbar-inner-popover-title">
              <n-space>
                <n-checkbox v-model:checked="checkAll" @update:checked="onCheckAll">{{
                  $t('lieZhanShi')
                }}</n-checkbox>
                <n-checkbox v-model:checked="selection" @update:checked="onSelection">{{
                  $t('gouXuanLie')
                }}</n-checkbox>
                <n-button text type="info" size="small" class="mt-1" @click="resetColumns">{{
                  $t('zhongZhi')
                }}</n-button>
              </n-space>
            </div>
          </template>
          <div class="table-toolbar-inner">
            <n-checkbox-group v-model:value="checkList" @update:value="onChange">
              <Draggable
                v-model="columnsList"
                animation="300"
                item-key="key"
                filter=".no-draggable"
                :move="onMove"
                @end="draggableEnd"
              >
                <template #item="{ element }">
                  <div
                    class="table-toolbar-inner-checkbox"
                    :class="{
                      'table-toolbar-inner-checkbox-dark': getDarkTheme === true,
                      'no-draggable': element.draggable === false,
                    }"
                  >
                    <span
                      class="drag-icon"
                      :class="{ 'drag-icon-hidden': element.draggable === false }"
                    >
                      <n-icon size="18">
                        <DragOutlined />
                      </n-icon>
                    </span>
                    <n-checkbox :value="element.key" :label="element.title" />
                    <div class="fixed-item">
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <n-icon
                            size="18"
                            :color="element.fixed === 'left' ? '#2080f0' : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'left')"
                          >
                            <VerticalRightOutlined />
                          </n-icon>
                        </template>
                        <span>{{ $t('guDingDaoZuoCe') }}</span>
                      </n-tooltip>
                      <n-divider vertical />
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <n-icon
                            size="18"
                            :color="element.fixed === 'right' ? '#2080f0' : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'right')"
                          >
                            <VerticalLeftOutlined />
                          </n-icon>
                        </template>
                        <span>{{ $t('guDingDaoYouCe') }}</span>
                      </n-tooltip>
                    </div>
                  </div>
                </template>
              </Draggable>
            </n-checkbox-group>
          </div>
        </n-popover>
      </div>
    </template>
    <span>{{ $t('lieSheZhi') }}</span>
  </n-tooltip>
</template>

<script lang="ts">
  import { ref, defineComponent, reactive, unref, toRaw, computed, toRefs, watchEffect } from 'vue';
  import { useTableContext } from '../../hooks/useTableContext';
  import { cloneDeep } from 'lodash-es';
  import I18n from '@/lang/index'; //引入i18n组件
  import {
    SettingOutlined,
    DragOutlined,
    VerticalRightOutlined,
    VerticalLeftOutlined,
  } from '@vicons/antd';
  import Draggable from 'vuedraggable';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';

  interface Options {
    title: string;
    key: string;
    fixed?: boolean | 'left' | 'right';
  }

  export default defineComponent({
    name: 'ColumnSetting',
    components: {
      SettingOutlined,
      DragOutlined,
      Draggable,
      VerticalRightOutlined,
      VerticalLeftOutlined,
    },
    setup() {
      const { getDarkTheme } = useDesignSetting();
      const table: any = useTableContext();
      const columnsList = ref<Options[]>([]);
      const cacheColumnsList = ref<Options[]>([]);
      const state = reactive({
        selection: false,
        checkAll: true,
        checkList: [],
        defaultCheckList: [],
        tempCheckList: [],
      });
      const i18n = I18n.global;
      const getSelection = computed(() => {
        return state.selection;
      });

      watchEffect(() => {
        const columns = table.getColumns();
        if (columns.length) {
          init();
        }
      });

      //初始化
      function init() {
        const columns: any[] = getColumns();
        const checkList: any = columns.map((item) => item.key);
        state.checkList = checkList;
        state.defaultCheckList = checkList;
        const newColumns = columns.filter(
          (item) => item.key != 'action' && item.title != I18n.global.t('caoZuo')
        );
        if (!columnsList.value.length) {
          columnsList.value = cloneDeep(newColumns);
          cacheColumnsList.value = cloneDeep(newColumns);
        }
      }

      //切换
      function onChange(checkList) {
        const cacheKeys = columnsList.value.map((item) => item.key);
        const newColumn: string[] = [];
        cacheKeys.map((item) => {
          if (checkList.indexOf(item) >= 0) {
            newColumn.push(item);
          }
        });
        if (state.selection) {
          newColumn.unshift('selection');
        }
        newColumn.push('action');
        setColumns(newColumn);
      }

      //设置
      function setColumns(columns) {
        table.setColumns(columns);
      }

      //获取
      function getColumns() {
        let newRet: any[] = [];
        table.getColumns().forEach((item) => {
          newRet.push({ ...item });
        });
        return newRet;
      }

      //重置
      function resetColumns() {
        state.checkList = [...state.defaultCheckList];
        state.checkAll = true;
        let cacheColumnsKeys: any[] = table.getCacheColumns();
        let newColumns = cacheColumnsKeys.map((item) => {
          return {
            ...item,
            fixed: undefined,
          };
        });
        setColumns(newColumns);
        columnsList.value = newColumns;
      }

      //全选
      function onCheckAll(e) {
        let checkList = table.getColumns();
        if (e) {
          setColumns(state.tempCheckList);
          state.checkList = checkList;
        } else {
          state.tempCheckList = checkList;
          setColumns([]);
          state.checkList = [];
        }
      }

      //拖拽排序
      function draggableEnd() {
        const checkList = table.getColumns();
        const newColumns = toRaw(unref(columnsList));
        columnsList.value = newColumns;
        // setColumns(newColumns);
        const res: any[] = newColumns.filter((item) => {
          return checkList.find((checkItem) => item.key === checkItem.key);
        });
        if (state.selection) {
          res.unshift({ type: 'selection', key: 'selection' });
        }
        setColumns(res);
      }

      //勾选列
      function onSelection(e) {
        let checkList = table.getColumns();
        if (e) {
          checkList.unshift({ type: 'selection', key: 'selection' });
          setColumns(checkList);
        } else {
          checkList.splice(0, 1);
          setColumns(checkList);
        }
      }

      function onMove(e) {
        if (e.draggedContext.element.draggable === false) return false;
        return true;
      }

      //固定
      function fixedColumn(item, fixed) {
        if (!(state.checkList as any).includes(item.key)) return;
        let columns = getColumns();
        const isFixed = item.fixed === fixed ? undefined : fixed;
        let index = columns.findIndex((res) => res.key === item.key);
        if (index !== -1) {
          columns[index].fixed = isFixed;
        }
        table.setCacheColumnsField(item.key, { fixed: isFixed });
        columnsList.value[index].fixed = isFixed;
        setColumns(columns);
      }

      return {
        ...toRefs(state),
        i18n,
        columnsList,
        getDarkTheme,
        onChange,
        onCheckAll,
        onSelection,
        onMove,
        resetColumns,
        fixedColumn,
        draggableEnd,
        getSelection,
      };
    },
  });
</script>

<style lang="less">
  .table-toolbar {
    &-inner-popover-title {
      padding: 3px 0;
    }

    &-right {
      &-icon {
        margin-left: 12px;
        font-size: 16px;
        color: var(--text-color);
        cursor: pointer;

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner {
    &-checkbox {
      display: flex;
      align-items: center;
      padding: 10px 14px;

      &:hover {
        background: #e6f7ff;
      }

      .drag-icon {
        display: inline-flex;
        margin-right: 8px;
        cursor: move;
        &-hidden {
          visibility: hidden;
          cursor: default;
        }
      }

      .fixed-item {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: auto;
      }

      .ant-checkbox-wrapper {
        flex: 1;

        &:hover {
          color: #1890ff !important;
        }
      }
    }

    &-checkbox-dark {
      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }
    }
  }

  .toolbar-popover {
    .n-popover__content {
      padding: 0;
    }
  }
</style>
