import type { ComputedRef, Ref } from 'vue';
// 高级类型定义 将传入的类型数组中的值转化为ref或者计算属性类型或者原本的类型,兼容vue中的ref处理
export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};
