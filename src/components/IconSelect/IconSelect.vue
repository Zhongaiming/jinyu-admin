<template>
  <div>
    <div class="flex items-center">
      <n-icon v-if="showIcon" size="40" :component="showIcon" @click="deleteIcon" />
      <span v-else>{{ $t('wu') }}</span>
      <n-button @click="openModal" quaternary round type="info" class="ml-2">{{
        $t('xuanZe')
      }}</n-button>
    </div>
    <BasicModal @register="modalRegister" ref="iconSelectModalRef">
      <template #default>
        <NInput v-model:value="searchValue" :placeholder="$t('souSuoTuBiao')" clearable />
        <n-tabs type="line" animated v-model:value="tabValue" pane-style="height:360px">
          <n-tab-pane v-for="name in tabNames" :key="name" :name="name" :tab="name">
            <n-virtual-list
              :item-size="20"
              :items="showIconKeys"
              class="icon-list-wrap"
              style="max-height: 360px"
              :default-scroll-key="0"
              :default-scroll-index="0"
              item-resizable
              v-if="showIconKeys.length"
            >
              <template #default="{ item }">
                <div
                  :key="item"
                  class="flex border items-center p-4 list-wrap-item"
                  @click="selectIcon(item)"
                >
                  <n-icon size="40" :component="iconLists[item]" />
                  <span class="ml-2">{{ item }}</span>
                </div>
              </template>
            </n-virtual-list>
            <n-empty v-else :description="$t('zanWuShuJu')" />
          </n-tab-pane>
        </n-tabs>
      </template>
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from 'naive-ui';
  import { useModal } from '../Modal';
  // 引入图标
  import * as antd from '@vicons/antd';
  import * as carbon from '@vicons/carbon';
  import * as ionicons5 from '@vicons/ionicons5';
  import * as tabler from '@vicons/tabler';
  import I18n from '@/lang/index'; //引入i18n组件
  defineOptions({ name: 'IconSelect' });

  // 父组件传入的值
  const props = defineProps({
    icon: {
      type: String,
      default: 'BulbOutlined',
    },
  });
  const emits = defineEmits(['update:icon']);
  const dialog = useDialog();
  // 定义图标映射
  const iconMap = new Map();
  // 所有图标列表
  const iconLists: any = { ...antd, ...carbon, ...ionicons5, ...tabler };

  iconMap.set('all', iconLists);
  iconMap.set('antd', antd);
  iconMap.set('carbon', carbon);
  iconMap.set('ionicons5', ionicons5);
  iconMap.set('tabler', tabler);
  // tab的name
  const tabNames = Array.from(iconMap.keys());
  // 当前的tab
  const tabValue = ref('all');
  // 显示的图标组件
  const showIcon = computed(() => iconLists[props.icon]);
  // 需要显示的图标的key 先拿到Map中的图标数组 再获取到所有的key,然后进行过滤
  const showIconKeys = computed(() =>
    Object.keys(iconMap.get(tabValue.value)).filter((item: string) =>
      item.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  );
  //弹框实例ref
  const iconSelectModalRef = ref<ComponentRef>(null);
  // 搜索字段
  const searchValue = ref<string>('');
  // 初始化弹框
  const [modalRegister, { openModal, closeModal }] = useModal({
    title: I18n.global.t('xuanZeTuBiao'),
    width: '50%',
  });
  function selectIcon(item) {
    dialog.info({
      title: I18n.global.t('tiShi'),
      content: I18n.global.t('queDingXuanZe') + item + I18n.global.t('tuBiaoMa'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        emits('update:icon', item);
        closeModal();
      },
    });
  }
  function deleteIcon() {
    dialog.info({
      title: I18n.global.t('tiShi'),
      content: I18n.global.t('queDingShanChu') + props.icon + I18n.global.t('tuBiaoMa'),
      positiveText: I18n.global.t('queDing'),
      negativeText: I18n.global.t('quXiao'),
      onPositiveClick: () => {
        emits('update:icon', '');
        closeModal();
      },
    });
  }
</script>

<script lang="ts">
  export default {
    name: 'IconSelect',
  };
</script>

<style scoped lang="less">
  .icon-list-wrap {
    :deep(.v-vl-visible-items) {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 0.75rem;
      align-items: center;
    }
  }
</style>
