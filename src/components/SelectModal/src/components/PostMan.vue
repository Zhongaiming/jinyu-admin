<template>
  <n-grid y-gap="15" x-gap="15" cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
    <n-gi>
      <n-card class="select-modal-card">
        <div class="card-header">
          <div class="flex-1">
            <n-input
              v-model:value="postSearchKey"
              type="text"
              clearable
              :placeholder="$t('souSuoGangWeiMingChengAnEnterSouSuo')"
              @keyup.enter="postLoadData"
            />
          </div>
        </div>
        <div
          v-for="item in postList"
          :key="item.postId"
          class="mt-2 post-item"
          :class="{ 'select-bg': selectPostId == item.postId }"
          @click="postSelect(item)"
        >
          {{ item.postName }}
        </div>
        <div class="flex items-center justify-center empty-box" v-if="!postList.length">
          <n-empty :description="$t('zanWuShuJu')" />
        </div>
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
              @keyup.enter="postManLoadData"
            />
          </div>
        </div>
        <div
          v-for="item in postManList"
          :key="item.userId"
          class="mt-2 man-item"
          :class="{ 'select-bg': selectUserId == item.userId }"
          @click="userSelect(item)"
        >
          {{ item.showName }}
        </div>
        <div class="flex items-center justify-center empty-box" v-if="!postManList.length">
          <n-empty description="暂无数据" />
        </div>
      </n-card>
    </n-gi>
    <n-gi span="2">
      <n-card v-if="selectList.length">
        <div class="card-header font-semibold">{{ $t('yiXuanGangWeiRenYuan') }}</div>
        <template #header-extra>
          <div class="flex items-center">
            <span class="text-blue-400 cursor-pointer" @click="allChecked">{{
              $t('quanXuan')
            }}</span>
            <span class="ml-3 text-red-400 cursor-pointer" @click="clearAll">{{
              $t('qingChu')
            }}</span>
          </div>
        </template>
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
  import { getSysPostList } from '@/api/System/setting/post';
  import { getListByPostId } from '@/api/System/setting/user';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { uniqueObjects } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  export default defineComponent({
    name: 'PostMan',
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
      // 岗位数据
      const postList: any = ref([]);
      // 选中岗位id
      const selectPostId = ref('');
      // 选中部门名称
      const selectPostName = ref('');
      // 选中用户Id
      const selectUserId: any = ref('');
      // 岗位人员数据
      const postManList: any = ref([]);
      // 选中数组
      const selectList: any = ref([]);
      // 部门搜索关键字
      const postSearchKey = ref('');
      // 用户搜索关键字
      const userSearchKey = ref('');
      // 是否多选
      const isMultiple = props.multiple;
      // 获取岗位数据
      function postLoadData() {
        getSysPostList({
          sysPostDtoFilter: { postName: postSearchKey.value },
          pageParam: { pageNum: 1, pageSize: 9999 },
        }).then((res) => {
          postList.value = res.dataList;
        });
      }
      // 获取岗位人员数据
      function postManLoadData() {
        getListByPostId({
          postId: selectPostId.value,
          name: userSearchKey.value,
        }).then((res) => {
          postManList.value = res;
        });
      }
      // 岗位选中方法
      function postSelect(item) {
        selectPostId.value = item.postId;
        selectPostName.value = item.postName;
        selectUserId.value = null;
        postManLoadData();
      }

      // 岗位人员选择方法
      function userSelect(item) {
        selectUserId.value = item.userId;
        if (isMultiple) {
          selectList.value.push({
            label: `${selectPostName.value} / ${item.showName}`,
            value: item.userId,
          });
          selectList.value = uniqueObjects(selectList.value);
        } else {
          selectList.value = [
            {
              label: `${selectPostName.value} / ${item.showName}`,
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
        let allSelectList = postManList.value.map((item) => {
          return {
            label: `${selectPostName.value} / ${item.showName}`,
            value: item.userId,
          };
        });
        selectList.value = selectList.value.concat(allSelectList);
        selectList.value = uniqueObjects(selectList.value);
      }
      //清除所有
      function clearAll() {
        selectUserId.value = null;
        selectList.value = [];
      }

      onMounted(() => {
        postLoadData();
      });
      // 暴露变量
      return {
        cssHoverColor,
        cssPrimaryBgColor,
        isMultiple,
        postList,
        postManList,
        selectPostId,
        selectUserId,
        postSearchKey,
        userSearchKey,
        selectList,
        postLoadData,
        postManLoadData,
        postSelect,
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
    font-size: 14px;
    cursor: pointer;
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
  }
  .tags-box {
    position: relative;
    top: -0.75rem;
    left: -0.75rem;
  }
  .post-item {
    padding-left: 10px;
    &:hover {
      background: v-bind(cssHoverColor);
    }
  }
  .man-item {
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
