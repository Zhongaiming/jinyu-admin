import { ComponentType } from './index';
import type { CSSProperties } from 'vue';
import type { GridProps, GridItemProps } from 'naive-ui/lib/grid';
import type { ButtonProps } from 'naive-ui/lib/button';

// 表单元素的prop
export interface FormSchema {
  field: string;
  // label
  label: string;
  // label的提示信息
  labelMessage?: string;
  // label提示信息的样式
  labelMessageStyle?: object | string;
  // 默认值
  defaultValue?: any;
  // 使用的组件类型
  component?: ComponentType;
  // 组件的prop
  componentProps?: any;
  // 是否使用插槽,一般使用具名插槽自定义显示
  slot?: string;
  // 表单验证规则
  rules?: object | object[];
  // 在grid下的布局规则,一般是用来响应式
  giProps?: GridItemProps;
  // 是否宽度100%
  isFull?: boolean;
  suffix?: string;
  // 是否显示
  isShow: boolean;
}

// 表单的prop
export interface FormProps {
  model?: Recordable;
  // label的宽度
  labelWidth?: number | string;
  // 表单内元素数组
  schemas?: FormSchema[];
  // 是否行布局
  inline: boolean;
  // 布局方式 horizontal 等
  layout?: string;
  // 布局的size
  size: string;
  //label的位置 left top等
  labelPlacement: string;
  // 是否宽度100%
  isFull: boolean;
  showActionButtonGroup?: boolean;
  // 是否显示重置按钮
  showResetButton?: boolean;
  // 重置按钮配置 传入的n-button的prop
  resetButtonOptions?: Partial<ButtonProps>;
  // 是否显示提交按钮
  showSubmitButton?: boolean;
  showAdvancedButton?: boolean;
  // 提交按钮的prop 传入的n-button的prop
  submitButtonOptions?: Partial<ButtonProps>;
  // 提交按钮的显示文本
  submitButtonText?: string;
  // 重置按钮的显示文本
  resetButtonText?: string;
  // gird布局配置 响应式gird
  gridProps?: GridProps;
  // gird元素的布局 响应式gird
  giProps?: GridItemProps;
  // 重置方法
  resetFunc?: () => Promise<void>;
  // 提交方法
  submitFunc?: () => Promise<void>;
  // 是否提交时重置(清空)表单
  submitOnReset?: boolean;
  baseGridStyle?: CSSProperties;
  collapsedRows?: number;
  submitClassName?: string;
  resetClassName?: string;
}
// 表单操作按钮的方法
export interface FormActionType {
  // 提交按钮方法
  submit: () => Promise<any>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  setSchema: (schemaProps: Partial<FormSchema[]>) => Promise<void>;
  setFieldsValue: (values: Recordable) => void;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: () => Recordable;
  resetFields: () => Promise<void>;
  validate: (nameList?: any[]) => Promise<any>;
  setLoading: (status: boolean) => void;
}

// 获取表单实例
export type RegisterFn = (formInstance: FormActionType) => void;

// useForm要返回的类型
export type UseFormReturnType = [RegisterFn, FormActionType];
