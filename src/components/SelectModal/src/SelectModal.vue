<template>
  <n-modal
    id="select-modal"
    v-bind="getBindValue"
    v-model:show="isModal"
    @close="onCloseModal"
    :style="{
      width:
        typeof getBindValue.width === 'number' ? getBindValue.width + 'px' : getBindValue.width,
    }"
  >
    <template #header>
      <div class="w-full cursor-move" id="select-modal-bar">{{ getBindValue.title }}</div>
    </template>

    <div v-if="getBindValue.type">
      <component :is="getBindValue.type" :multiple="getBindValue.multiple" ref="componentRef" />
    </div>
    <!-- <template #default>
      <slot name="default"></slot>
    </template> -->
    <template #action v-if="!$slots.action && getBindValue.showDefaultAction">
      <n-space>
        <n-button @click="closeModal">{{ $t('quXiao') }}</n-button>
        <n-button type="primary" :loading="subLoading" @click="handleSubmit">{{
          subBtuText
        }}</n-button>
      </n-space>
    </template>
    <template v-else #action>
      <slot name="action"></slot>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { basicProps } from './props';
  import { ModalProps } from './type';
  import startDrag from '@/utils/Drag';
  import Dept from './components/Dept.vue';
  import Post from './components/Post.vue';
  import DeptPost from './components/DeptPost.vue';
  import DeptPostMan from './components/DeptPostMan.vue';
  import DeptMan from './components/DeptMan.vue';
  import PostMan from './components/PostMan.vue';
  import Man from './components/Man.vue';
  import MeetingMan from './components/MeetingMan.vue';
  export default defineComponent({
    name: 'SelectModal',
    components: { Dept, Post, DeptPost, DeptPostMan, DeptMan, PostMan, Man, MeetingMan },
    props: {
      ...basicProps,
    },
    emits: ['on-close', 'on-ok'],
    setup(props, { emit }) {
      const attrs = useAttrs();
      const isModal = ref(false);
      const subLoading = ref(false);
      const componentRef = ref<any>(null);
      const propsRef = ref<Partial<ModalProps> | null>(null);
      const getProps = computed(() => {
        return { ...props, ...(unref(propsRef) as any) };
      });

      const subBtuText = computed(() => {
        return props.subBtuText;
      });

      const getBindValue = computed(() => {
        return {
          ...attrs,
          ...unref(getProps),
          ...unref(propsRef),
        };
      });

      function openModal() {
        isModal.value = true;
        nextTick(() => {
          const oBox = document.getElementById('select-modal');
          const oBar = document.getElementById('select-modal-bar');
          startDrag(oBar, oBox);
        });
      }

      function closeModal() {
        isModal.value = false;
        subLoading.value = false;
        emit('on-close');
      }

      function onCloseModal() {
        isModal.value = false;
        emit('on-close');
      }

      function handleSubmit() {
        subLoading.value = true;
        emit('on-ok', componentRef.value.selectList);
        closeModal();
      }

      return {
        isModal,
        subLoading,
        componentRef,
        subBtuText,
        getBindValue,
        openModal,
        closeModal,
        onCloseModal,
        handleSubmit,
      };
    },
  });
</script>

<style lang="less" scoped>
  // .cursor-move {
  //   cursor: move;
  // }
</style>
