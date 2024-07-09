# JinYu-Admin

[toc]

## 项目配置

在根目录下的`setting`文件夹下，有项目的一些默认配置（各个文件下有注释）

### 动画设置 animateSetting.ts

动画与动画名的一些映射关系，配置后的动画会在页面右侧设置中可使用

###  颜色与主题 designSetting.ts

默认的一些颜色设置和主题的设置

### 页面显示 projectSetting.ts

用于配置项目内展示的内容、布局、文本等效果

### 内部组件默认设置 componentSetting.ts

控制封装后组件的一些配置，在使用组件时优先使用手动传入的值

#### table

里面有表格组件的一些默认配置

1. `apiSetting`
   与后端接口有关，可根据实际接口修改

   ```json
       apiSetting: {
         // 当前页的字段名
         pageField: 'page',
         // 每页数量字段名
         sizeField: 'pageSize',
         // 接口返回的数据字段名
         listField: 'list',
         // 接口返回总页数字段名
         totalField: 'pageCount',
         //总数字段名
         countField: 'itemCount',
       },
   ```

2. `defaultPageSize`
   表格组件中默认分页的数量

   ```ts
       //默认分页数量
       defaultPageSize: 10,
   ```

3. `pageSizes`
   控制分页大小的选择器中的值

   ```ts
       //可切换每页数量集合
       pageSizes: [10, 20, 30, 40, 50],
   ```

   

#### upload

图片上传组件的一些配置

1. `apiSetting`

   ```ts
       //考虑接口规范不同
       apiSetting: {
         // 集合字段名
         infoField: 'data',
         // 图片地址字段名
         imgField: 'photo',
       },
   ```

2. `maxSize`
   最大上传数

   ```ts
       //最大上传图片大小
       maxSize: 2,
   ```

3. `fileType`
   支持上传的类型

   ```ts
       //图片上传类型
       fileType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
   ```

   

## 组件

### BasicForm 表单组件

封装后的表单组件，传入配置使用

#### 基础使用

1. 定义[表单内元素](#FORM元素的prop)，`schemas`的内容：

   ```ts
     const schemas: FormSchema[] = [
       {
         // 绑定的字段
         field: 'name',
         // 使用的组件
         component: 'NInput',
         // 显示的label
         label: '姓名',
         // label提示信息
         labelMessage: '这是一个提示',
         // 组件的props
         componentProps: {
           // 默认提示
           placeholder: '请输入姓名',
           // 输入时的方法
           onInput: (e: any) => {
             console.log(e);
           },
         },
         // 验证规则
         rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
       },
       {
         field: 'mobile',
         component: 'NInputNumber',
         label: '手机',
         componentProps: {
           placeholder: '请输入手机号码',
           // 是否显示按钮
           showButton: false,
           onInput: (e: any) => {
             console.log(e);
           },
         },
       },
        //使用下拉框
       {
         field: 'type',
         component: 'NSelect',
         label: '类型',
         componentProps: {
           placeholder: '请选择类型',
           options: [
             {
               label: '舒适性',
               value: 1,
             },
             {
               label: '经济性',
               value: 2,
             },
           ],
           onUpdateValue: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeDate',
         component: 'NDatePicker',
         label: '预约时间',
         defaultValue: 1183135260000,
         componentProps: {
           type: 'date',
           clearable: true,
           onUpdateValue: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeTime',
         component: 'NTimePicker',
         label: '停留时间',
         componentProps: {
           clearable: true,
           onUpdateValue: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeProject',
         component: 'NCheckbox',
         label: '预约项目',
         componentProps: {
           placeholder: '请选择预约项目',
           options: [
             {
               label: '种牙',
               value: 1,
             },
             {
               label: '补牙',
               value: 2,
             },
             {
               label: '根管',
               value: 3,
             },
           ],
           onUpdateChecked: (e: any) => {
             console.log(e);
           },
         },
       },
      //使用按钮组   
       {
         field: 'makeSource',
         component: 'NRadioGroup',
         label: '来源',
         componentProps: {
           options: [
             {
               label: '网上',
               value: 1,
             },
             {
               label: '门店',
               value: 2,
             },
           ],
           onUpdateChecked: (e: any) => {
             console.log(e);
           },
         },
       },
       // 可以使用具名插槽定义显示
       {
         field: 'status',
         label: '状态',
         //插槽名
         slot: 'statusSlot',
       },
     ];
   ```

2. 在BasicForm组件上直接填入[表单配置](#表单上的props)

   ```ts
        <BasicForm
          submitButtonText="提交预约"
          layout="horizontal"
          :gridProps="{ cols: 1 }"
          :schemas="schemas"
        >
   	</BasicForm>
   ```

3. 如果使用的表单元素中使用了`solt`，需要在定义时写上具名插槽

   ```ts
        <BasicForm
          submitButtonText="提交预约"
          layout="horizontal"
          :gridProps="{ cols: 1 }"
          :schemas="schemas"
        >
          <template #statusSlot="{ model, field }">
            <n-input v-model:value="model[field]" />
          </template>
        </BasicForm>
   ```

4. 使用`@`监听事件，事件列表见[表单上事件](#表单上的事件)

   ```ts
           <BasicForm
             submitButtonText="提交预约"
             layout="horizontal"
             :gridProps="{ cols: 1 }"
             :schemas="schemas"
             @submit="handleSubmit"
             @reset="handleReset"
           >
             <template #statusSlot="{ model, field }">
               <n-input v-model:value="model[field]" />
             </template>
           </BasicForm>
   ```

#### useForm

主要是更换了绑定form属性的方式，

先定义[表单内元素](#FORM元素的prop)，`schemas`的内容：

   ```ts
     const schemas: FormSchema[] = [
       {
         // 绑定的字段
         field: 'name',
         // 使用的组件
         component: 'NInput',
         // 显示的label
         label: '姓名',
         // label提示信息
         labelMessage: '这是一个提示',
         // 组件的props
         componentProps: {
           // 默认提示
           placeholder: '请输入姓名',
           // 输入时的方法
           onInput: (e: any) => {
             console.log(e);
           },
         },
         // 验证规则
         rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
       },
       {
         field: 'mobile',
         component: 'NInputNumber',
         label: '手机',
         componentProps: {
           placeholder: '请输入手机号码',
           // 是否显示按钮
           showButton: false,
           onInput: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'type',
         component: 'NSelect',
         label: '类型',
         componentProps: {
           placeholder: '请选择类型',
           options: [
             {
               label: '舒适性',
               value: 1,
             },
             {
               label: '经济性',
               value: 2,
             },
           ],
           onUpdateValue: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeDate',
         component: 'NDatePicker',
         label: '预约时间',
         defaultValue: 1183135260000,
         componentProps: {
           type: 'date',
           clearable: true,
           onUpdateValue: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeTime',
         component: 'NTimePicker',
         label: '停留时间',
         componentProps: {
           clearable: true,
           onUpdateValue: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeProject',
         component: 'NCheckbox',
         label: '预约项目',
         componentProps: {
           placeholder: '请选择预约项目',
           options: [
             {
               label: '种牙',
               value: 1,
             },
             {
               label: '补牙',
               value: 2,
             },
             {
               label: '根管',
               value: 3,
             },
           ],
           onUpdateChecked: (e: any) => {
             console.log(e);
           },
         },
       },
       {
         field: 'makeSource',
         component: 'NRadioGroup',
         label: '来源',
         componentProps: {
           options: [
             {
               label: '网上',
               value: 1,
             },
             {
               label: '门店',
               value: 2,
             },
           ],
           onUpdateChecked: (e: any) => {
             console.log(e);
           },
         },
       },
       // 可以使用具名插槽定义显示
       {
         field: 'status',
         label: '状态',
         //插槽
         slot: 'statusSlot',
       },
     ];
   ```

然后使用`useForm`方法绑定form上的属性：

```ts
  const [register, {}] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 120,
    layout: 'horizontal',
    submitButtonText: '提交预约',
    schemas,
  });
```

会生成一个注册器，在`BasicForm`上使用`register`绑定属性:

```ts
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
          <template #statusSlot="{ model, field }">
            <n-input v-model:value="model[field]" />
          </template>
        </BasicForm>
```

事件使用`@`监听，`schemas`中使用了`solt`的，需要使用具名插槽

#### 表单上的事件

可以在组件上使用的事件

|    名称     |                             说明                             |
| :---------: | :----------------------------------------------------------: |
|  register   | 通过useForm绑定表单属性时使用传入的是[useForm](#useForm)函数返回的一个参数 |
|   submit    |                           提交事件                           |
| handleReset |                           重置事件                           |



#### 表单上的props

这是在**BasicForm**组件上传入的值

|      名称(加粗为必填)      |            类型            | 默认值 | 示例（忽略基础类型） | 说明 |
| :-------------------: | :------------------------: | :----: | :------------------: | :--: |
|         model         |         `Recordable`         | `{}` | `:model=formData` | 表单绑定的对象，绑定的是一个属性为`string`类型的对象 |
|      labelWidth   |      `number|string`       | 80 | / | label的宽度 |
|        schemas        |       `FormSchema[]`       | / | / | 配置表单内元素，见[对应属性](#FORM元素的prop)，类型没有强制必填，但是使用该组件时需要 |
|        **inline**     |          `boolean`         | `false` | / | 表单是否为行内表单 |
|        layout     |           `string`           | inline | / | 已知的是控制表单按钮组显示，默认情况下显示会展示‘展开/收起’按钮，按钮组放在最右侧，整个表单默认会折叠 |
|         **size**      |           `string`           | medium | / | 控制表单大小，可选值`'small' | 'medium' | 'large'` |
|   **labelPlacement** |           `string`           | left | / | label显示的位置，可选值：`'left'|'top'` |
|        **isFull**     |          `boolean`         | `true` | / | 是否占满整行 |
| showActionButtonGroup |          `boolean`         | `true` | / | 是否显示操作按钮组 |
|    showResetButton    |          `boolean`         | `true` | / | 是否显示操作按钮（查询/重置） |
| resetButtonOptions | `Partial<ButtonProps>` | / | `{color:red}` | 重置按钮的属性配置，其实就是n-button的配置，不过都是可选的，具体属性见[官网](https://www.naiveui.com/zh-CN/light/components/button#Button-Props) |
|  showSubmitButton |          `boolean`         | `true` | / | 是否显示确认按钮 |
| showAdvancedButton |          `boolean`         | `true` | / | 是否展开收起按钮 |
|  submitButtonOptions  |  `Partial<ButtonProps>`  | / | `{color:red}` | 提交按钮的属性配置，其实就是n-button的配置，不过都是可选的，具体属性见[官网](https://www.naiveui.com/zh-CN/light/components/button#Button-Props) |
|  submitButtonText |           `string`           | 查询 | / | 确认按钮文字 |
|    resetButtonText    |           `string`           | 重置 | / | resetButtonText |
|      resetFunc      |   `() => Promise<void>`    | / | / | 属性传入重置的方法（一般使用事件） |
| submitFunc  |   `() => Promise<void>`    | / | / | 属性传入提交的方法（一般使用事件） |
|     submitOnReset     |          `boolean`         | `false` | / | 在提交时重置表单 |
|     baseGridStyle     | `CSSProperties` | / | `grid-template-rows:repeat(1fr,4)` | css中grid布局属性 |
|     collapsedRows     |           `number`           | 1 | / | 默认展示的行数 |

#### FORM元素的props

这里是表单中元素的配置项，也是`schemas`数组中的值

| 名称(加粗为必填)  |       类型        | 默认值  |                     示例（忽略基础类型）                     |                             说明                             |
| :---------------: | :---------------: | :-----: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|     **field**     |     `string`      |    /    |                              /                               |                       表单中绑定的字段                       |
|     **label**     |     `string`      |    /    |                              /                               |                         显示的label                          |
|   labelMessage    |     `string`      |    /    |                              /                               |                       label提示的信息                        |
| labelMessageStyle |  `object|string`  |    /    |                       `{color:isRed}`                        | labe提示信息的样式，传入object类型时，使用的是vue中object绑定样式写法 |
|   defaultValue    |     `string`      |    /    |                              /                               |                            默认值                            |
|     component     |     `string`      | NInput  |                              /                               | 使用的组件类型(是[n-from](https://www.naiveui.com/zh-CN/os-theme/components/form)下的元素，不过使用大驼峰的形式填入，NInput对应n-input) |
|  componentProps   |     `object`      |    /    |        `placeholder: '请输入姓名',showButton: false`         | 要使用的组件传入的prop，详见[navie-ui文档](https://www.naiveui.com/zh-CN/os-theme/components/button)，例：`n-input`的[prop](https://www.naiveui.com/zh-CN/os-theme/components/input#API)，在这里的事件使用了==jsx==语法，注意[写法](https://www.naiveui.com/zh-CN/os-theme/docs/jsx#%E5%BD%A2%E5%A6%82-@update:\*-%E7%9A%84-prop) |
|       slot        |     `string`      |    /    |                              /                               |         是否使用插槽(使用的话填入string类型的插槽名          |
|       rules       | `object|object[]` |    /    | `[{ required: true, message: '请输入姓名', trigger: ['blur'] }]` | 表单验证规则，也可以自定义规则，见[naive-ui相关文档](https://www.naiveui.com/zh-CN/os-theme/components/form#custom-rule.vue) |
|      giProps      |  `GridItemProps`  |    /    |                          `{span:1}`                          | 作为grid下的子元素,布局规则，见naive-ui官方文档[GridItemProps](https://www.naiveui.com/zh-CN/os-theme/components/grid#GridItem-Props) |
|      isFull       |     `boolean`     | `false` |                              /                               |                         是否宽度100%                         |
|      suffix       |     `string`      |    /    |                             `%`                              |                    在表单元素后的后缀符号                    |

### BasicTable 表格组件

内部封装`n-data-table`的表格组件，传入配置即可使用

#### 基础使用

基础使用**BasicTable**渲染数据

1. 定义表格的列数据，详见表格列的[props](#表格列的props)

   ```ts
   export const columns = [
     {
       title: 'id',
       key: 'id',
       width: 100,
     },
     {
       title: '编码',
       key: 'no',
       width: 100,
     },
     {
       title: '名称',
       key: 'name',
       width: 100,
     },
     {
       title: '头像',
       key: 'avatar',
       width: 100,
       render(row) {
         return h(NAvatar, {
           size: 48,
           src: row.avatar,
         });
       },
     },
     {
       title: '地址',
       key: 'address',
       width: 150,
     },
     {
       title: '开始日期',
       key: 'beginTime',
       width: 160,
     },
     {
       title: '结束日期',
       key: 'endTime',
       width: 160,
     },
     {
       title: '状态',
       key: 'status',
       width: 100,
       render(row) {
         return h(
           NTag,
           {
             type: row.status ? 'success' : 'error',
           },
           {
             default: () => (row.status ? '启用' : '禁用'),
           }
         );
       },
     },
     {
       title: '创建时间',
       key: 'date',
       width: 160,
     },
     {
       title: '停留时间',
       key: 'time',
       width: 80,
     },
   ]
   ```

2. 在**BasicTable**组件上填入需要的`props`，[定义规则](#表格上的props)

   ```ts
       <BasicTable
         title="表格列表"
         titleTooltip="这是一个提示"
         :columns="columns"
         :request="loadDataTable"
         :row-key="(row) => row.id"
         ref="actionRef"
         :actionColumn="actionColumn"
         :scroll-x="1360"
         @update:checked-row-keys="onCheckedRow"
       >
         <template #toolbar>
           <n-button type="primary" @click="reloadTable">刷新数据</n-button>
         </template>
       </BasicTable>
   ```

   `loadDataTable`：直接返回接口数据即可

   `actionColumn`：操作列的配置，配合**TableAction** [表格操作组件](#TableAction 表格操作组件)使用

   - 会通过配置生成工具栏与分页

   - 组件中预置了一个`toolbar`插槽，显示位置在页面上工具栏=><u>斑马纹开关</u>的左侧，一般自定义按钮

3. 使用`@`监听组件[事件](#表格上的事件)

#### 单元格编辑

与基础使用的区别在于，`columns`定义时，列元素需要添加：`editComponent`，`edit:true`，`editRule`等属性，`edit`属性控制单元格是否可编辑，详见表格列的[props](#表格列的props)

`columns`示例：

```ts
export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '编码',
    key: 'no',
    width: 100,
  },
  {
    title: '名称',
    key: 'name',
    editComponent: 'NInput',
    // 默认必填校验
    editRule: true,
    edit: true,
    width: 200,
  },
  {
    title: '头像',
    key: 'avatar',
    width: 100,
    render(row) {
      return h(NAvatar, {
        size: 48,
        src: row.avatar,
      });
    },
  },
  {
    title: '地址',
    key: 'address',
    editComponent: 'NSelect',
    editComponentProps: {
      options: [
        {
          label: '广东省',
          value: 1,
        },
        {
          label: '浙江省',
          value: 2,
        },
      ],
    },
    edit: true,
    width: 200,
    ellipsis: false,
  },
  {
    title: '开始日期',
    key: 'beginTime',
    edit: true,
    width: 160,
    editComponent: 'NDatePicker',
    editComponentProps: {
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },
    ellipsis: false,
  },
  {
    title: '结束日期',
    key: 'endTime',
    width: 160,
  },
  {
    title: '创建时间',
    key: 'date',
    width: 160,
  },
  {
    title: '停留时间',
    key: 'time',
    width: 80,
  },
];
```

#### 整行编辑

与基础使用的区别在于，`columns`定义时，列元素需要添加：`editComponent`，`editRow:true`，`edit:true`，`editRow`等属性，`edit`属性控制单元格是否可编辑,`editRow`控制整行是否可编辑，详见表格列的[props](#表格列的props)

`columns`示例：

```ts
export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '编码',
    key: 'no',
    width: 100,
  },
  {
    title: '名称',
    key: 'name',
    editComponent: 'NInput',
    editRow: true,
    // 默认必填校验
    editRule: true,
    // edit: true,
    width: 200,
  },
  {
    title: '头像',
    key: 'avatar',
    width: 100,
    render(row) {
      return h(NAvatar, {
        size: 48,
        src: row.avatar,
      });
    },
  },
  {
    title: '地址',
    key: 'address',
    editRow: true,
    editComponent: 'NSelect',
    editComponentProps: {
      options: [
        {
          label: '广东省',
          value: 1,
        },
        {
          label: '浙江省',
          value: 2,
        },
      ],
    },
    edit: true,
    width: 200,
    ellipsis: false,
  },
  {
    title: '开始日期',
    key: 'beginTime',
    editRow: true,
    edit: true,
    width: 240,
    editComponent: 'NDatePicker',
    editComponentProps: {
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },
    ellipsis: false,
  },
  {
    title: '结束日期',
    key: 'endTime',
    width: 160,
  },
  {
    title: '状态',
    key: 'status',
    editRow: true,
    edit: true,
    width: 100,
    editComponent: 'NSwitch',
    editValueMap: (value) => {
      return value ? '启用' : '禁用';
    },
  },
  {
    title: '创建时间',
    key: 'date',
    width: 160,
  },
  {
    title: '停留时间',
    key: 'time',
    width: 80,
  },
];
```

#### 表格上的事件

**cell**：单元格

**row**：行

|      名称      | 说明 |
| :------------------------: | :--: |
|      fetch-success    | 请求成功的回调 |
|       fetch-error       | 请求失败的回调 |
| update:checked-row-keys | 选中**row**后的回调，返回选中数据 |
| edit-end | 编辑**cell**完之后的回调（只是编辑完了**cell**，在编辑**row**时，后续会触发`edit-row-end`） |
|       edit-cancel       | 编辑取消的回调 |
|      edit-row-end       | 编辑**row**结束的回调 |

#### 表格上的props

继承了原`n-data-table`的[props](https://www.naiveui.com/zh-CN/os-theme/components/data-table#DataTable-Props)

|  名称(加粗为必填)  |                   类型                   |  默认值  |       示例（忽略基础类型）       |                             说明                             |
| :----------------: | :--------------------------------------: | :------: | :------------------------------: | :----------------------------------------------------------: |
|       title        |                 `string`                 |    /     |                /                 |                          表格的标题                          |
|    titleTooltip    |                 `string`                 |  `null`  |          `这是一条提示`          |                        表格的标题提示                        |
|        size        |                 `string`                 | `medium` |                /                 |           表格的大小，可选值：`small|medium|large`           |
|      columns       |                 `any[]`                  |   `[]`   |                /                 |         表格列数据，每列的[填写规则](#表格列的props)         |
|    actionColumn    |                 `any[]`                  |    /     |  `actionColumn="actionColumn"`   | **操作**列的数据定义，因为复杂，所以需要单独定义，[填写规则](#表格列的props) |
|   beforeRequest    | `(...arg: any[]) => void  |Promise<any>` |    /     | `:request="beformLoadDataTable"` |                   在发送请求数据之前的方法                   |
|      request       |    `(...arg: any[]) => Promise<any>`     |    /     |    `:request="loadDataTable"`    |                      请求表格数据的方法                      |
|    afterRequest    | `(...arg: any[]) => void  |Promise<any>` |    /     | `:request="afterLoadDataTable"`  |                   在发送请求数据之后的方法                   |
|       rowKey       |           `string|any=>string`           |    /     |   `:row-key="(row) => row.id"`   |                    行数据的key，需要唯一                     |
|     pagination     |                 `object`                 |    /     |         `{pageSize:20}`          |           分页的配置信息，[填写规则](#分页的配置)            |
|   showPagination   |                `boolean`                 |    /     |                /                 |                           (已废弃)                           |
|     canResize      |                `boolean`                 |  `true`  |                /                 |                      是否可以自适应大小                      |
| resizeHeightOffset |                 `number`                 |   `0`    |                /                 |                          高度偏移量                          |
|      loading       |                `boolean`                 | `false`  |                /                 |                          是否加载中                          |

##### 分页的配置

关于**受控模式**见[naive-ui相关说明](https://www.naiveui.com/zh-CN/light/docs/controlled-uncontrolled)，其实就是会去改变组件内的值

| 名称(加粗为必填) |    类型    |         默认值         |                  示例（忽略基础类型）                   |                             说明                             |
| :--------------: | :--------: | :--------------------: | :-----------------------------------------------------: | :----------------------------------------------------------: |
|       page       |  `number`  |           /            |                            /                            |                      受控模式下的当前页                      |
|    itemCount     |  `number`  |           /            |                            /                            |                            总条数                            |
|    pageCount     |  `number`  |           /            |                            /                            |                            总页数                            |
|     pageSize     |  `number`  |          `10`          |                            /                            | 受控模式下的分页大小，默认值在[**componentSetting.ts**](#table)中可配置，也可以手动传入 |
|    pageSizes     | `number[]` | `[10, 20, 30, 40, 50]` |                            /                            | 每页条数，默认值在[**componentSetting.ts**](#table)中可配置，也可以手动传入 |
|  showSizePicker  | `boolean`  |          true          |                            /                            |                  是否显示每条页条数的显示器                  |
| showQuickJumper  | `boolean`  |          ture          |                            /                            |                       是否显示快速跳转                       |
|      prefix      |   `any`    |        共`$`条         | prefix: (pagingInfo) => 共 ${*pagingInfo*.itemCount} 条 |          自定义显示分页前缀，默认值中的`$`是占位符           |

#### 表格列的props

基础了`n-data-table`下的[columns](https://www.naiveui.com/zh-CN/os-theme/components/data-table#DataTable-Props)（没有直接锚点，无法直接跳转，向下方滑找到 **DataTableColumn Properties**）

如果是编辑列，可以使用**TableAction**[表格操作列组件]()

|  名称(加粗为必填)  |                             类型                             |                    默认值                     |             示例（忽略基础类型）              |                             说明                             |
| :----------------: | :----------------------------------------------------------: | :-------------------------------------------: | :-------------------------------------------: | :----------------------------------------------------------: |
|        edit        |                          `boolean`                           |                    `false`                    |                     false                     |                       是否编辑**cell**                       |
|      editRow       |                          `boolean`                           |                    `false`                    |                     false                     |                       是否编辑**row**                        |
|   editComponent    |                       `ComponentType`                        |                       /                       |                    n-input                    |  表格列编辑时使用的类型，具体见[ComponentType](#支持的组件)  |
| editComponentProps |                           `object`                           | `placeholder: '请输入姓名',showButton: false` |                       /                       | 类型是属性为是`string`的对象，编辑数据时该列使用的组件传入的prop，详见[navie-ui文档](https://www.naiveui.com/zh-CN/os-theme/components/button)，例：[n-input的prop](https://www.naiveui.com/zh-CN/os-theme/components/input#API)，在这里的事件使用了==jsx==语法，注意[写法](https://www.naiveui.com/zh-CN/os-theme/docs/jsx#%E5%BD%A2%E5%A6%82-@update:\*-%E7%9A%84-prop) |
|      editRule      | `boolean|((text: string, record: Recordable) => Promise<string>)` |                       /                       |                    `true`                     |            是否开启必填效验，使用方法的形式待测试            |
|    editValueMap    |                   `(value: any) => string`                   |                       /                       | `(value) => {return value ? '启用' : '禁用'}` |                  编辑时，格式化当前值的方法                  |
|     onEditRow      |                          `function`                          |                       /                       |                       /                       |                         编辑时的方法                         |
|        auth        |                          `string[]`                          |                       /                       |               `['admin-user']`                |             权限标识的数组，通过标识控制是否显示             |
|       ifShow       |         `boolean|((column: BasicColumn) => boolean)`         |                       /                       |                  `()=>true`                   |              是否显示，可以通过一个判断方法控制              |
|     draggable      |                          `boolean`                           |                    `true`                     |                       /                       |                     控制该列是否可以拖拽                     |

如果是操作列，需要使用**TableAction**[表格操作组件](#TableAction 表格操作组件)

##### 支持的组件

表格列支持通过name直接使用的组件（大驼峰格式）

```ts
export type ComponentType =
  | 'NInput'
  | 'NInputNumber'
  | 'NSelect'
  | 'NCheckbox'
  | 'NSwitch'
  | 'NDatePicker'
  | 'NTimePicker'
  | 'NCascader';
```

### TableAction 表格操作组件

这个组件可以定义多个表格操作按钮，配合**BasicTable**组件使用

#### 表格操作组件的props与使用示例

| 名称(加粗为必填) |      类型      |  默认值  | 示例（忽略基础类型） |                          说明                          |
| :--------------: | :------------: | :------: | :------------------: | :----------------------------------------------------: |
|   **actions**    | `ActionItem[]` |  `null`  |      见下面代码      | 直接显示在操作列下的按钮[配置](#表格操作列按钮的props) |
| dropDownActions  | `ActionItem[]` |  `null`  |      见下面代码      |   操作列下，下拉的按钮[配置](#表格操作列按钮的props)   |
|      style       |    `string`    | `button` |          /           |                  控制使用什么样式显示                  |
|      select      |      `Fn`      | `()=>{}` |          /           |                  点击任意按钮后的回调                  |

使用`actions`的示例：

```typescript
      return h(TableAction as any, {
        style: 'text',
        actions: [
          {
            label: '删除',
            type: 'error',
            // 配置 color 会覆盖 type
            color: 'red',
            icon: DeleteOutlined,
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
			auth: ['basic_list'],
          },
          {
            label: '编辑',
            type: 'primary',
            icon: EditOutlined,
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
        ];
      });
```

使用`dropDownActions`的示例：

```typescript
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['basic_list'],
          },
        ],
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
```

#### 表格操作列按钮的props

继承了`n-button`组件的[props](https://www.naiveui.com/zh-CN/os-theme/components/button#Button-Props)，全设置为可选，并扩展了以下属性：

| 名称(加粗为必填) |                             类型                             |  默认值   | 示例（忽略基础类型） |                             说明                             |
| :--------------: | :----------------------------------------------------------: | :-------: | :------------------: | :----------------------------------------------------------: |
|     onClick      |                             `Fn`                             |     /     |          /           |                       点击后的回调方法                       |
|      label       |                           `string`                           |     /     |          /           |                          label标题                           |
|       type       |   `'success'|'error'|'warning'|'info'|'primary'|'default'`   | `primary` |          /           |                    控制使用什么类型的样式                    |
|      color       |                           `string`                           |     /     |          /           |               颜色设置，会覆盖`type`设置的颜色               |
|       icon       |                         `Component`                          |     /     |          /           |                       图标，类型是组件                       |
|     disabled     |                          `boolean`                           |  `fasle`  |          /           |                           是否禁用                           |
|     divider      |                          `boolean`                           |  `false`  |          /           |                         是否有分隔线                         |
|       auth       | `string|string[]|{value:string,label:string}|{value:string,label:string}[]` |     /     |   `['admin_user']`   |                    权限标识，控制是否显示                    |
|      ifShow      |                   `boolean|{$}=> boolean`                    |  `true`   |          /           | 控制是否显示，可以自定义实现，其中`{$}`表示是 <u>表格操作列操作的props</u>的类型 |

## 其他可参考文档

[官方组件文档](https://docs.naiveadmin.com/components/form.html)

[表格组件使用](https://www.jianshu.com/p/c058d5da3186)
