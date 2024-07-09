<template>
  <n-grid y-gap="15" cols="1">
    <n-gi>
      <n-card class="select-modal-card">
        <div class="card-header flex items-center">
          <div class="mr-2" v-if="isMultiple">
            <n-button tertiary size="small" @click="allChecked">
              <span class="text-sm">{{ $t('quanXuan') }}</span></n-button
            >
          </div>
          <div class="flex-1">
            <n-input
              v-model:value="deptSearchKey"
              type="text"
              clearable
              :placeholder="$t('souSuoBuMenMingChengAnEnterSouSuo')"
              @keyup.enter="deptLoadData"
            />
          </div>
        </div>
        <n-tree
          block-line
          :data="deptList"
          default-expand-all
          key-field="deptId"
          label-field="deptName"
          :selected-keys="selectedDeptKeys"
          :node-props="nodeProps"
          @update:selected-keys="deptSelectChange"
        />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card v-if="selectList.length">
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold">{{ $t('yiXuanBuMen') }}</div>
          <span class="ml-3 text-red-400 cursor-pointer" @click="clearAll">{{
            $t('qingChu')
          }}</span>
        </div>
        <div class="flex flex-wrap tags-box mt-3">
          <n-tag
            closable
            @close="handleClose(index)"
            v-for="(item, index) in selectList"
            :key="item.value"
            class="ml-3 mt-3"
          >
            {{ item.label }}
          </n-tag>
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script lang="ts">
  import { treeDataTranslate, uniqueObjects } from '@/utils';
  import { getSysDeptList } from '@/api/System/setting/department';
  export default defineComponent({
    name: 'Dept',
    props: {
      multiple: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      // 原始部门数据
      const deptListTile: any = ref([]);
      // 组合部门数据
      const deptList = ref([]);
      // 选中部门index数组
      const selectedDeptKeys = ref([]);
      // 选中数组
      const selectList: any = ref([]);
      // 搜索部门关键字
      const deptSearchKey = ref('');
      // 是否多选
      const isMultiple = props.multiple;
      // 获取部门数据
      function deptLoadData() {
        getSysDeptList({
          sysDeptDtoFilter: { deptName: deptSearchKey.value },
          pageParam: { pageNum: 1, pageSize: 9999 },
        }).then((res) => {
          deptListTile.value = res.dataList;
          deptList.value = treeDataTranslate(res.dataList, 'deptId', 'parentId', 'showOrder');
        });
      }
      // 部门节点方法
      function nodeProps(item) {
        return {
          onClick() {
            if (isMultiple) {
              selectList.value.push({
                label: item.option.deptName,
                value: item.option.deptId,
              });
              selectList.value = uniqueObjects(selectList.value);
            } else {
              selectList.value = [{ label: item.option.deptName, value: item.option.deptId }];
            }
          },
        };
      }
      // 部门选中方法
      function deptSelectChange(keys) {
        selectedDeptKeys.value = keys;
      }
      // 标签清除方法
      function handleClose(index) {
        selectList.value.splice(index, 1);
      }

      // 全选
      function allChecked() {
        selectList.value = deptListTile.value.map((item) => {
          return {
            label: item.deptName,
            value: item.deptId,
          };
        });
      }
      //清除所有
      function clearAll() {
        selectedDeptKeys.value = [];
        selectList.value = [];
      }

      onMounted(() => {
        deptLoadData();
      });
      // 暴露变量
      return {
        isMultiple,
        deptListTile,
        deptList,
        selectedDeptKeys,
        deptSearchKey,
        selectList,
        deptLoadData,
        nodeProps,
        deptSelectChange,
        handleClose,
        allChecked,
        clearAll,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.n-card__content) {
    padding: 15px 20px !important;
  }
  .card-header {
    margin-bottom: 0.75rem;
  }
  .select-modal-card {
    min-height: 280px;
    height: 100%;
  }
  .tags-box {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
  }
</style>
