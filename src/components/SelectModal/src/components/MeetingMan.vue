<template>
  <n-grid y-gap="15" :cols="1">
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
              @keyup.enter="userLoadData"
            />
          </div>
        </div>
        <div
          v-for="item in userList"
          :key="item.meetingUserId"
          class="man-item mt-2"
          :class="{ 'select-bg': selectUserId == item.meetingUserId }"
          @click="userSelect(item)"
        >
          {{ item.meetingUserName }}
        </div>
        <div class="flex items-center justify-center empty-box" v-if="!userList.length">
          <n-empty description="暂无数据" />
        </div>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card v-if="selectList.length">
        <div class="card-header font-semibold">{{ $t('yiXuanYongHu') }}</div>
        <template #header-extra>
          <div class="flex items-center">
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
  import { getMeetingUserList } from '@/api/Meeting/user/user';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { uniqueObjects } from '@/utils';
  import { cssConvert } from '@/hooks/useThemeVars';
  export default defineComponent({
    name: 'Man',
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
      // 用户数据
      const userList: any = ref([]);
      // 选中数组
      const selectList: any = ref([]);
      // 选中用户id
      const selectUserId = ref(null);
      // 搜索岗位关键字
      const userSearchKey = ref('');
      // 是否多选
      const isMultiple = props.multiple;
      // 获取用户数据
      function userLoadData() {
        getMeetingUserList({
          meetingUserDtoFilter: { meetingUserName: userSearchKey.value },
          pageParam: { pageNum: 1, pageSize: 9999 },
        }).then((res) => {
          userList.value = res.dataList;
        });
      }
      // 用户选中方法
      function userSelect(item) {
        selectUserId.value = item.meetingUserId;
        if (isMultiple) {
          selectList.value.push({
            label: item.meetingUserName,
            value: item.meetingUserId,
          });
          selectList.value = uniqueObjects(selectList.value);
        } else {
          selectList.value = [
            {
              label: item.meetingUserName,
              value: item.meetingUserId,
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
        selectList.value = userList.value.map((item) => {
          return {
            label: item.meetingUserName,
            value: item.meetingUserId,
          };
        });
      }
      //清除所有
      function clearAll() {
        selectUserId.value = null;
        selectList.value = [];
      }

      onMounted(() => {
        userLoadData();
      });
      // 暴露变量
      return {
        cssHoverColor,
        cssPrimaryBgColor,
        isMultiple,
        userList,
        userSearchKey,
        selectUserId,
        selectList,
        userLoadData,
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
