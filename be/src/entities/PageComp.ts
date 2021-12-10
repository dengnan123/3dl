import { Column, Entity } from "typeorm";

@Entity("page_comp", { schema: "test" })
export class PageComp {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("int", { name: "comp_id" })
  compId: number;

  @Column("int", { name: "page_id" })
  pageId: number;

  @Column("varchar", { name: "group_id", nullable: true, length: 255 })
  groupId: string | null;

  @Column("varchar", {
    name: "type",
    nullable: true,
    comment: "组件类型",
    length: 255,
  })
  type: string | null;

  @Column("int", {
    name: "status",
    comment: "组件状态 0 正常  1删除",
    default: () => "'0'",
  })
  status: number;

  @Column("text", {
    name: "data_source_id",
    nullable: true,
    comment: "数据源ID 或者 数据源ID数组",
  })
  dataSourceId: string | null;

  @Column("text", {
    name: "show_comps",
    nullable: true,
    comment: "点击时需要显示的组件ID",
  })
  showComps: string | null;

  @Column("int", { name: "width", nullable: true })
  width: number | null;

  @Column("int", { name: "height", nullable: true })
  height: number | null;

  @Column("int", { name: "left", nullable: true })
  left: number | null;

  @Column("int", { name: "top", nullable: true })
  top: number | null;

  @Column("int", { name: "z_index", nullable: true })
  zIndex: number | null;

  @Column("varchar", { name: "comp_name", nullable: true, length: 100 })
  compName: string | null;

  @Column("varchar", { name: "map_id", nullable: true, length: 100 })
  mapId: string | null;

  @Column("text", { name: "mock_data", nullable: true })
  mockData: string | null;

  @Column("text", { name: "style", nullable: true })
  style: string | null;

  @Column("varchar", { name: "data_api_url", nullable: true, length: 255 })
  dataApiUrl: string | null;

  @Column("int", { name: "auto_refresh", nullable: true })
  autoRefresh: number | null;

  @Column("int", { name: "fetch_interval", nullable: true })
  fetchInterval: number | null;

  @Column("varchar", { name: "use_data_type", nullable: true, length: 255 })
  useDataType: string | null;

  @Column("int", { name: "translate_x", nullable: true })
  translateX: number | null;

  @Column("int", { name: "transform_y", nullable: true })
  transformY: number | null;

  @Column("text", { name: "basic_style", nullable: true })
  basicStyle: string | null;

  @Column("text", { name: "deps", nullable: true })
  deps: string | null;

  @Column("text", { name: "cache_params_deps", nullable: true })
  cacheParamsDeps: string | null;

  @Column("varchar", { name: "alias_name", nullable: true, length: 255 })
  aliasName: string | null;

  @Column("int", { name: "is_locking", nullable: true })
  isLocking: number | null;

  @Column("text", {
    name: "clear_params_comps",
    nullable: true,
    comment: "关联的需要清除条件的组件ID数组",
  })
  clearParamsComps: string | null;

  @Column("int", {
    name: "is_hidden",
    nullable: true,
    comment: "1隐藏 0显示",
    default: () => "'0'",
  })
  isHidden: number | null;

  @Column("text", {
    name: "loading_deps",
    nullable: true,
    comment: "组件关联的需要loading数据源",
  })
  loadingDeps: string | null;

  @Column("int", { name: "now_page", nullable: true })
  nowPage: number | null;

  @Column("int", {
    name: "open_high_config",
    nullable: true,
    comment: "是否打开高级配置 0 打开 1 关闭",
  })
  openHighConfig: number | null;

  @Column("text", { name: "container_deps", nullable: true })
  containerDeps: string | null;

  @Column("int", {
    name: "is_open_drill_down",
    nullable: true,
    comment: "是否下钻",
  })
  isOpenDrillDown: number | null;

  @Column("varchar", {
    name: "data_source_name",
    nullable: true,
    comment: "数据源名字",
    length: 255,
  })
  dataSourceName: string | null;

  @Column("varchar", {
    name: "child_data_source_name",
    nullable: true,
    comment: "子数据源 如a.b.c",
    length: 255,
  })
  childDataSourceName: string | null;

  @Column("text", { name: "data_source_association", nullable: true })
  dataSourceAssociation: string | null;

  @Column("text", {
    name: "pass_params_comps",
    nullable: true,
    comment: "参数传递给其他组件",
  })
  passParamsComps: string | null;

  @Column("text", {
    name: "click_callback_func",
    nullable: true,
    comment: "组件点击额外的回调函数",
  })
  clickCallbackFunc: string | null;

  @Column("text", {
    name: "hidden_comps",
    nullable: true,
    comment: "点击时需要隐藏的组件ID",
  })
  hiddenComps: string | null;

  @Column("text", {
    name: "click_callback_func_es5_code",
    nullable: true,
    comment: "babel编译后的es5代码",
  })
  clickCallbackFuncEs5Code: string | null;

  @Column("text", {
    name: "on_click_callback_func",
    nullable: true,
    comment: "onClick回调函数",
  })
  onClickCallbackFunc: string | null;

  @Column("text", {
    name: "on_click_callback_func_es5_code",
    nullable: true,
    comment: "onClick babel编译后的es5代码",
  })
  onClickCallbackFuncEs5Code: string | null;

  @Column("bigint", { name: "creat_time", nullable: true })
  creatTime: string | null;

  @Column("text", {
    name: "filter_func",
    nullable: true,
    comment: "组件数据过滤器",
  })
  filterFunc: string | null;

  @Column("text", {
    name: "filter_func_es5_code",
    nullable: true,
    comment: "组件数据过滤器 es5 代码",
  })
  filterFuncEs5Code: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("varchar", {
    name: "auth_api_id",
    nullable: true,
    comment: "组件关联的权限api ID",
    length: 255,
  })
  authApiId: string | null;

  @Column("text", {
    name: "auth_func",
    nullable: true,
    comment: "组件的权限代码",
  })
  authFunc: string | null;

  @Column("text", {
    name: "auth_func_es5",
    nullable: true,
    comment: "组件的权限es5 代码 保留老字段 兼容以前",
  })
  authFuncEs5: string | null;

  @Column("text", {
    name: "auth_func_es5_code",
    nullable: true,
    comment: "组件的权限es5 代码 最新字段",
  })
  authFuncEs5Code: string | null;

  @Column("int", {
    name: "open_auth_func",
    nullable: true,
    comment: "开启组件权限",
    default: () => "'0'",
  })
  openAuthFunc: number | null;

  @Column("text", {
    name: "show_comps_filter_func",
    nullable: true,
    comment: "showComps的过滤器",
  })
  showCompsFilterFunc: string | null;

  @Column("text", { name: "show_comps_filter_func_es5_code", nullable: true })
  showCompsFilterFuncEs5Code: string | null;

  @Column("int", {
    name: "open_show_comps_filter_func",
    nullable: true,
    comment: "是否打开过滤器",
    default: () => "'0'",
  })
  openShowCompsFilterFunc: number | null;

  @Column("text", {
    name: "hidden_comps_filter_func",
    nullable: true,
    comment: "hiddenComps的过滤器",
  })
  hiddenCompsFilterFunc: string | null;

  @Column("text", { name: "hidden_comps_filter_func_es5_code", nullable: true })
  hiddenCompsFilterFuncEs5Code: string | null;

  @Column("int", {
    name: "open_hidden_comps_filter_func",
    nullable: true,
    comment: "是否打开过滤器",
  })
  openHiddenCompsFilterFunc: number | null;

  @Column("int", {
    name: "open_deps_filter_func",
    nullable: true,
    comment: "是否 打开deps过滤器",
    default: () => "'0'",
  })
  openDepsFilterFunc: number | null;

  @Column("text", { name: "move_callback_func_es5_code", nullable: true })
  moveCallbackFuncEs5Code: string | null;

  @Column("text", {
    name: "move_callback_func",
    nullable: true,
    comment: "滑动事件回调",
  })
  moveCallbackFunc: string | null;

  @Column("text", { name: "deps_filter_func", nullable: true })
  depsFilterFunc: string | null;

  @Column("text", { name: "deps_filter_func_es5_code", nullable: true })
  depsFilterFuncEs5Code: string | null;

  @Column("text", {
    name: "clear_api_deps",
    nullable: true,
    comment: "清理关联的api ",
  })
  clearApiDeps: string | null;

  @Column("int", {
    name: "open_clear_api_deps_func",
    nullable: true,
    comment: "是否打开清理函数",
    default: () => "'0'",
  })
  openClearApiDepsFunc: number | null;

  @Column("text", {
    name: "clear_api_deps_func",
    nullable: true,
    comment: "清理函数",
  })
  clearApiDepsFunc: string | null;

  @Column("text", { name: "clear_api_deps_func_es5_code", nullable: true })
  clearApiDepsFuncEs5Code: string | null;

  @Column("text", { name: "grid", nullable: true, comment: "组件栅格布局属性" })
  grid: string | null;

  @Column("text", {
    name: "dynamic_expand",
    nullable: true,
    comment: "动态扩展对象",
  })
  dynamicExpand: string | null;
}
