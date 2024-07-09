<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button text class="mr-4" type="info" @click="addSibling">
        <template #icon>
          <n-icon>
            <PlusSquareOutlined />
          </n-icon>
        </template>
      </n-button>
    </template>
    <span>{{ $t('tianJiaTongJiCaiDan') }}</span>
  </n-popover>
  <n-popover trigger="hover" class="mr-4">
    <template #trigger>
      <n-button text class="mr-4" type="success" @click="addChildren">
        <template #icon>
          <n-icon>
            <PlusCircleTwotone />
          </n-icon> </template
      ></n-button>
    </template>
    <span>{{ $t('tianJiaZiCaiDan') }}</span>
  </n-popover>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button text type="error" @click="deleteSelf">
        <template #icon>
          <n-icon>
            <DeleteTwotone />
          </n-icon> </template
      ></n-button>
    </template>
    <span>{{ $t('shanChuCaiDanHuiYiQiShanChuZiCaiDan') }}</span>
  </n-popover>
</template>

<script setup lang="ts">
  import { DeleteTwotone, PlusSquareOutlined, PlusCircleTwotone } from '@vicons/antd';
  const emit = defineEmits(['addSibling', 'addChildren', 'deleteSelf']);
  function addSibling(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    emit('addSibling');
  }
  function addChildren(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    emit('addChildren');
  }
  function deleteSelf(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    emit('deleteSelf');
  }
</script>
