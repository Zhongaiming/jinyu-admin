<template>
  <n-form v-bind="getBindValue" :model="formModel" ref="formElRef">
    <n-grid v-bind="getGrid">
      <n-gi v-bind="schema.giProps" v-for="schema in getSchema" :key="schema.field">
        <n-form-item :label="schema.label" :path="schema.field">
          <!--标签名右侧温馨提示-->
          <template #label v-if="schema.labelMessage">
            {{ schema.label }}
            <!-- 提示的信息 -->
            <n-tooltip trigger="hover" :style="schema.labelMessageStyle">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ schema.labelMessage }}
            </n-tooltip>
          </template>

          <!--判断插槽-->
          <template v-if="schema.slot">
            <!-- 定义插槽的name和所需要用到的属性 -->
            <slot
              :name="schema.slot"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>

          <!--NCheckbox-->
          <template v-else-if="schema.component === 'NCheckbox'">
            <n-checkbox-group
              v-model:value="formModel[schema.field]"
              @update:value="schema.componentProps?.onUpdateValue"
            >
              <n-space>
                <n-checkbox
                  v-for="item in schema.componentProps.options"
                  :key="
                    schema.componentProps.valueField
                      ? item[schema.componentProps.valueField]
                      : item.value
                  "
                  :value="
                    schema.componentProps.valueField
                      ? item[schema.componentProps.valueField]
                      : item.value
                  "
                  :label="
                    schema.componentProps.labelField
                      ? item[schema.componentProps.labelField]
                      : item.label
                  "
                />
              </n-space>
            </n-checkbox-group>
          </template>

          <!--NRadioGroup-->
          <template v-else-if="schema.component === 'NRadioGroup'">
            <n-radio-group
              v-model:value="formModel[schema.field]"
              @update:value="schema.componentProps?.onUpdateValue"
            >
              <n-space>
                <n-radio
                  v-for="item in schema.componentProps.options"
                  :key="
                    schema.componentProps.valueField
                      ? item[schema.componentProps.valueField]
                      : item.value
                  "
                  :value="
                    schema.componentProps.valueField
                      ? item[schema.componentProps.valueField]
                      : item.value
                  "
                >
                  {{
                    schema.componentProps.labelField
                      ? item[schema.componentProps.labelField]
                      : item.label
                  }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </template>
          <!-- BasicUpload -->
          <template v-else-if="schema.component === 'BasicUpload'">
            <BasicUpload
              :action="uploadUrl + schema.componentProps.action"
              :data="schema.componentProps.data"
              :name="schema.componentProps.name"
              :width="schema.componentProps.width"
              :height="schema.componentProps.height"
              :max="schema.componentProps.max"
              @upload-change="uploadChange($event, schema.field)"
              v-model:value="formModel[schema.field]"
              :maxSize="schema.componentProps.maxSize"
              :accept="schema.componentProps.accept"
              :helpText="schema.componentProps.helpText"
            />
          </template>

          <!-- TinymceEditor -->
          <template v-else-if="schema.component === 'TinymceEditor'">
            <div class="h-80 w-full">
              <tinymce-editor
                v-model:value="formModel[schema.field]"
                v-model:defaultValue="editorDefault[schema.field]"
              />
            </div>
          </template>

          <!-- Text -->
          <template v-else-if="schema.component === 'Text'">
            <div :class="schema.componentProps?.class" :style="schema.componentProps?.style">
              {{ formModel[schema.field] }}
            </div>
          </template>
          <!--动态渲染表单组件-->
          <component
            v-else
            v-bind="getComponentProps(schema)"
            :is="schema.component"
            v-model:value="formModel[schema.field]"
            :class="{ isFull: schema.isFull != false && getProps.isFull }"
          />
          <!--组件后面的内容-->
          <template v-if="schema.suffix">
            <slot
              :name="schema.suffix"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>
        </n-form-item>
      </n-gi>
      <!--提交 重置 展开 收起 按钮-->
      <n-gi
        :span="isInline ? '' : 24"
        :suffix="isInline ? true : false"
        #="{ overflow }"
        class="gi-button-group"
        v-if="getProps.showActionButtonGroup"
      >
        <n-space
          align="center"
          :justify="'end'"
          :style="{
            'margin-left': `${isInline ? 12 : getProps.labelWidth}px`,
            'margin-top': `${isInline ? 0 : 16}px`,
          }"
        >
          <!-- :loading="loadingSub" -->
          <template v-if="isInline">
            <n-button
              v-if="getProps.showSubmitButton"
              v-bind="getSubmitBtnOptions"
              @click="handleSubmit"
              :class="getProps.submitClassName"
              >{{ getProps.submitButtonText }}</n-button
            >
            <n-button
              v-if="getProps.showResetButton"
              v-bind="getResetBtnOptions"
              :class="getProps.resetClassName"
              @click="resetFields"
              >{{ getProps.resetButtonText }}</n-button
            >
          </template>
          <template v-else>
            <n-button
              v-if="getProps.showResetButton"
              v-bind="getResetBtnOptions"
              :class="getProps.resetClassName"
              @click="resetFields"
              >{{ getProps.resetButtonText }}</n-button
            >
            <n-button
              v-if="getProps.showSubmitButton"
              v-bind="getSubmitBtnOptions"
              :class="getProps.submitClassName"
              @click="handleSubmit"
              >{{ getProps.submitButtonText }}</n-button
            >
          </template>
          <n-button
            type="primary"
            text
            icon-placement="right"
            v-if="
              (isInline && getProps.showAdvancedButton && overflow) ||
              (isInline && getProps.showAdvancedButton && overflow === getGrid.collapsed)
            "
            @click="unfoldToggle"
          >
            <template #icon>
              <n-icon size="14" class="unfold-icon" v-if="overflow">
                <DownOutlined />
              </n-icon>
              <n-icon size="14" class="unfold-icon" v-else>
                <UpOutlined />
              </n-icon>
            </template>
            {{ overflow ? $t('zhanKai') : $t('shouQi') }}
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts">
  import { createPlaceholderMessage } from './helper';
  import { useFormEvents } from './hooks/useFormEvents';
  import { useFormValues } from './hooks/useFormValues';
  import { basicProps } from './props';
  import { DownOutlined, UpOutlined, QuestionCircleOutlined } from '@vicons/antd';
  import type { GridProps } from 'naive-ui/lib/grid';
  import type { FormSchema, FormProps, FormActionType } from './types/form';
  import { useGlobSetting } from '@/hooks/setting';
  import { isArray } from '@/utils/is/index';
  import { deepMerge } from '@/utils';
  export default defineComponent({
    name: 'BasicForm',
    components: { DownOutlined, UpOutlined, QuestionCircleOutlined },
    props: {
      ...basicProps,
    },
    emits: ['reset', 'submit', 'register'],
    setup(props, { emit, attrs }) {
      const defaultFormModel = ref<Recordable>({});
      const formModel = reactive<Recordable>({});
      const propsRef = ref<Partial<FormProps>>({});
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      const formElRef = ref<Nullable<FormActionType>>(null);
      const gridCollapsed = ref(true);
      const loadingSub = ref(false);
      const isUpdateDefaultRef = ref(false);
      const editorDefault = reactive<Recordable>({});
      // 公共上传接口
      const { uploadUrl } = useGlobSetting();
      const getSubmitBtnOptions = computed(() => {
        return Object.assign(
          {
            size: props.size,
            type: 'primary',
          },
          props.submitButtonOptions
        );
      });

      const getResetBtnOptions = computed(() => {
        return Object.assign(
          {
            size: props.size,
            type: 'default',
          },
          props.resetButtonOptions
        );
      });

      function getComponentProps(schema) {
        const compProps = schema.componentProps ?? {};
        const component = schema.component;
        return {
          clearable: true,
          placeholder: createPlaceholderMessage(unref(component)),
          ...compProps,
        };
      }

      const getProps = computed((): FormProps => {
        const formProps = { ...props, ...unref(propsRef) } as FormProps;
        const rulesObj: any = {
          rules: {},
        };
        const schemas: any = formProps.schemas || [];
        schemas.forEach((item) => {
          if (item.rules && isArray(item.rules)) {
            rulesObj.rules[item.field] = item.rules;
          }
        });
        return { ...formProps, ...unref(rulesObj) };
      });

      const isInline = computed(() => {
        const { layout } = unref(getProps);
        return layout === 'inline';
      });

      const getGrid = computed((): GridProps => {
        const { gridProps } = unref(getProps);
        return {
          ...gridProps,
          collapsed: isInline.value ? gridCollapsed.value : false,
          responsive: 'screen',
        };
      });

      const getBindValue = computed(
        () => ({ ...attrs, ...props, ...unref(getProps) } as Recordable)
      );

      const getSchema = computed((): FormSchema[] => {
        let schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue } = schema;
          // handle date type
          // dateItemType.includes(component as string)
          if (defaultValue) {
            schema.defaultValue = defaultValue;
          }
        }
        schemas = schemas.filter((item) => item.isShow);
        // 过滤隐藏的表单
        return schemas as FormSchema[];
      });

      const { handleFormValues, initDefault } = useFormValues({
        defaultFormModel,
        getSchema,
        formModel,
      });

      const { handleSubmit, validate, resetFields, getFieldsValue, clearValidate, setFieldsValue } =
        useFormEvents({
          emit,
          getProps,
          formModel,
          getSchema,
          formElRef: formElRef as Ref<FormActionType>,
          defaultFormModel,
          loadingSub,
          handleFormValues,
        });

      function unfoldToggle() {
        gridCollapsed.value = !gridCollapsed.value;
      }

      function uploadChange(list, field) {
        formModel[field] = list.join(',');
      }

      async function setProps(formProps: Partial<FormProps>): Promise<void> {
        propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
      }

      const formActionType: Partial<FormActionType> = {
        getFieldsValue,
        setFieldsValue,
        resetFields,
        validate,
        clearValidate,
        setProps,
        submit: handleSubmit,
      };

      watch(
        () => getSchema.value,
        (schema) => {
          if (unref(isUpdateDefaultRef)) {
            return;
          }
          if (schema?.length) {
            initDefault();
            isUpdateDefaultRef.value = true;
          }
        }
      );

      watch(
        () => formModel,
        (val) => {
          getSchema.value.forEach((item) => {
            if (item.component === 'TinymceEditor') {
              if (val[item.field]) {
                editorDefault[item.field] = val[item.field];
              }
            }
          });
        },
        { deep: true }
      );

      onMounted(() => {
        initDefault();
        emit('register', formActionType);
      });

      return {
        formElRef,
        formModel,
        editorDefault,
        getGrid,
        getProps,
        getBindValue,
        getSchema,
        uploadUrl,
        getSubmitBtnOptions,
        getResetBtnOptions,
        handleSubmit,
        uploadChange,
        resetFields,
        loadingSub,
        isInline,
        getComponentProps,
        unfoldToggle,
      };
    },
  });
</script>

<style lang="less" scoped>
  .isFull {
    width: 100%;
    justify-content: flex-start;
  }

  .unfold-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -3px;
  }

  @media screen and (max-width: 640px) {
    .gi-button-group {
      grid-column: 1 / span 1 !important;
    }
  }
</style>
