# FM 筛选表格

### Table

| 参数             | 说明                                                                                          | 类型     | 默认值                                         |
| ---------------- | --------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------- |
| id               | 表单 ID                                                                                       | string   | 随机生成                                       |
| dataSource       | 表单数据                                                                                      | Array    | []                                             |
| pagination       | 分页属性                                                                                      | Object   | { pageNumber: 1,pageSize: 10,totalElements: 0} |
| columns          | [antd Columns](https://ant.design/components/table-cn/#Column)支持的列属性,额外属性说明见下方 | Column   |
| onChange         | 搜索条件、分页、排序变化时触发事件                                                            | Fucntion | async () => {}                                 |
| disabledFilter   | 禁用筛选                                                                                      | Boolean  | false                                          |
| clickRowSelected | 点击行时，是否添加选择样式                                                                    | Boolean  | false                                          |
| onClickRow       | 点击行触发的事件                                                                              | Fucntion |
| action           | 表格数据请求,需返回如下格式{pageNumber: 1,pageSize: 10, totalElements: 0, content: []}        | any      |
| actionParams     | 表格数据请求参数                                                                              | Object   |
| initLoad         | 是否初始化时加载数据，配合 action 使用                                                        | Boolean  | true                                           |
| tProps           | table 组件其他参数，与[antd table](https://ant.design/components/table-cn/#Table)一致         | Object   |

### Columns

| 参数           | 说明                                        | 类型                                                         | 默认值         |
| -------------- | ------------------------------------------- | ------------------------------------------------------------ | -------------- |
| filterRender   | 自定义渲染搜索组件                          | ReactNode \| ({onFilterChange, onFilterSearch })=> ReactNode |
| noFilter       | 是否不展示筛选组件                          | Boolean                                                      | false          |
| editor         | 是否为编辑列,值为 true 则默认没有排序与筛选 | Boolean                                                      | false          |
| sortKey        | 筛序参数的 key                              | string                                                       | dataIndex 的值 |
| filterKey      | 筛选参数的 key                              | string                                                       | dataIndex 的值 |
| filterProps    | 筛选项配置,详细说明见下方                   | Object                                                       |
| onFilterParams | 筛选参数触发时回调，返回对象替换筛选参数    | Object                                                       |

### filterProps

| 参数    | 说明               | 类型                         | 默认值 |
| ------- | ------------------ | ---------------------------- | ------ |
| type    | 筛选组件类型       | 'text' \| 'date' \| 'select' | 'text' |
| options | 'select'的渲染数据 | [{label: '', value: ''}]     |
| ...     | antd 支持的参数    |

### 方法

| 名称             | 描述                                 |
| ---------------- | ------------------------------------ |
| load             | 重新加载数据，仅在传递 action 时生效 |
| resetFilter      | 重置筛选条件                         |
| loading          | 显示 loading                         |
| getTableData     | 获取表单数据                         |
| getTableParams   | 获取表单筛选参数                     |
| clearRowSelected | 清除行选中样式                       |
