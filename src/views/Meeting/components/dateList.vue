<template>
  <div v-if="dateArr && dateArr.length > 0" class="date-meeting-list">
    <n-ellipsis :line-clamp="3">
      <n-tag
        :bordered="false"
        v-for="item in dateArr"
        :key="item.meetingId"
        class="m-1"
        type="success"
      >
        <n-ellipsis style="max-width: 240px">
          {{ item.meetingName }}
        </n-ellipsis>
      </n-tag>
      <template #tooltip>
        <div class="ellipsis-hover">
          <n-tag v-for="item in dateArr" :key="item.meetingId" class="m-1" type="success">
            {{ item.meetingName }}
          </n-tag>
        </div>
      </template>
      <!-- <div class="text-gray-500 text-s line-clamp-1 p-1 date-meeting-item"> </div> -->
    </n-ellipsis>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps({
    dataList: {
      type: Object,
      default: () => {},
    },
    month: Number,
    year: Number,
    date: Number,
  });
  const day = computed(
    () =>
      `${props.year}-${(props.month + '').padStart(2, '0')}-${(props.date + '').padStart(2, '0')}`
  );
  const dateArr = computed(() => props.dataList[day.value] || null);
</script>

<style lang="less">
  .ellipsis-hover {
    width: 450px;
    display: flex;
    flex-wrap: wrap;
  }
</style>
