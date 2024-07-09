<template>
  <n-grid y-gap="15" x-gap="15" cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
    <n-gi>
      <n-card class="select-modal-card">
        <div class="card-header">
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
          :node-props="nodeProps"
          :selected-keys="selectedDeptKeys"
          @update:selected-keys="deptSelectChange"
        />
      </n-card>
    </n-gi>
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
              v-model:value="userSearchKey"
              type="text"
              clearable
              :placeholder="$t('souSuoYongHuMingChengAnEnterSouSuo')"
              @keyup.enter="deptManLoadData"
            />
          </div>
        </div>
        <div
          v-for="item in deptManList"
          :key="item.userId"
          class="mt-2 post-item"
          :class="{ 'select-bg': selectUserId == item.userId }"
          @click="userSelect(item)"
        >
          {{ item.showName }}
        </div>
        <div class="empty-box flex items-center justify-center" v-if="!deptManList.length">
          <n-empty :description="$t('zanWuShuJu')" />
        </div>
      </n-card>
    </n-gi>
    <n-gi span="2">
      <n-card v-if="selectList.length">
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold">{{ $t('yiXuanBuMenRenYuan') }}</div>
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
  import { getSysDeptList } from '@/api/System/setting/department';
  import { getListByDeptId } from '@/api/System/setting/user';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { treeDataTranslate, uniqueObjects } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  export default defineComponent({
    name: 'DeptMan',
    props: {
      multiple: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const designStore = useDesignSettingStore();
      // 全局hover样式
      const cssHoverColor = ref(cssConvert('hoverColor', 1));
      // 全局primary背景颜色
      const cssPrimaryBgColor = ref(cssConvert('primaryColor', designStore.darkTheme ? 0.15 : 0.1));
      // 原始部门数据
      const deptListTile: any = ref([]);
      // 组合部门数据
      const deptList = ref([]);
      // 选中部门id
      const selectDeptId = ref('');
      // 选中部门index数组
      const selectedDeptKeys = ref([]);
      // 选中部门名称
      const selectDeptName = ref('');
      // 选中用户Id
      const selectUserId: any = ref('');
      // 部门人员数据
      const deptManList: any = ref([]);
      // 选中数组
      const selectList: any = ref([]);
      // 部门搜索关键字
      const deptSearchKey = ref('');
      // 用户搜索关键字
      const userSearchKey = ref('');
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
      // 获取部门人员数据
      function deptManLoadData() {
        getListByDeptId({
          deptId: selectDeptId.value,
          name: userSearchKey.value,
        }).then((res) => {
          deptManList.value = res;
        });
      }
      // 部门节点方法
      function nodeProps(item) {
        return {
          onClick() {
            selectDeptId.value = item.option.deptId;
            selectDeptName.value = item.option.deptName;
            selectUserId.value = null;
            deptManLoadData();
          },
        };
      }
      // 部门选中方法
      function deptSelectChange(keys) {
        selectedDeptKeys.value = keys;
      }
      // 部门人员选择方法
      function userSelect(item) {
        selectUserId.value = item.userId;
        if (isMultiple) {
          selectList.value.push({
            label: `${selectDeptName.value} / ${item.showName}`,
            value: item.userId,
          });
          selectList.value = uniqueObjects(selectList.value);
        } else {
          selectList.value = [
            {
              label: `${selectDeptName.value} / ${item.showName}`,
              value: item.userId,
            },
          ];
        }
      }
      // 标签清除方法
      function handleClose(index) {
        selectList.value.splice(index, 1);
      }

      // 全选
      function allChecked() {
        let allSelectList = deptManList.value.map((item) => {
          return {
            label: `${selectDeptName.value} / ${item.showName}`,
            value: item.userId,
          };
        });
        selectList.value = selectList.value.concat(allSelectList);
        selectList.value = uniqueObjects(selectList.value);
      }
      //清除所有
      function clearAll() {
        selectedDeptKeys.value = [];
        selectUserId.value = null;
        selectList.value = [];
      }

      onMounted(() => {
        deptLoadData();
      });
      // 暴露变量
      return {
        cssHoverColor,
        cssPrimaryBgColor,
        isMultiple,
        deptListTile,
        deptList,
        deptManList,
        selectDeptId,
        selectedDeptKeys,
        selectUserId,
        deptSearchKey,
        userSearchKey,
        selectList,
        deptLoadData,
        deptManLoadData,
        nodeProps,
        deptSelectChange,
        userSelect,
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
  .empty-box {
    min-height: 200px;
    height: 100%;
  }
  .tags-box {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
  }
  .post-item {
    padding-left: 10px;
    min-height: 24px;
    line-height: 24px;
    &:hover {
      background: v-bind(cssHoverColor);
    }
  }
  .select-bg {
    background-color: v-bind(cssPrimaryBgColor);
  }
</style>
