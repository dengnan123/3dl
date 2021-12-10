import { Column, Entity } from "typeorm";

@Entity("data_source_config", { schema: "test" })
export class DataSourceConfig {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("int", { name: "page_id", comment: "大屏ID" })
  pageId: number;

  @Column("int", {
    name: "tag_id",
    nullable: true,
    comment: "有值代表是项目公用数据源",
  })
  tagId: number | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "1 正常 0删除",
    default: () => "'1'",
  })
  status: number | null;

  @Column("int", { name: "query_id", nullable: true, comment: "redash 查询ID" })
  queryId: number | null;

  @Column("varchar", {
    name: "data_source_name",
    nullable: true,
    comment: "数据源名字",
    length: 255,
  })
  dataSourceName: string | null;

  @Column("int", {
    name: "api_host_id",
    nullable: true,
    comment: "API_HOST ID",
  })
  apiHostId: number | null;

  @Column("varchar", {
    name: "data_api_url",
    nullable: true,
    comment: "api URl",
    length: 255,
  })
  dataApiUrl: string | null;

  @Column("text", {
    name: "data_api_url_filter",
    nullable: true,
    comment: "api 处理器函数 返回处理过的api",
  })
  dataApiUrlFilter: string | null;

  @Column("text", { name: "data_api_url_filter_es5_code", nullable: true })
  dataApiUrlFilterEs5Code: string | null;

  @Column("int", {
    name: "open_data_api_url_filter",
    nullable: true,
    comment: "是否打开API 处理器",
  })
  openDataApiUrlFilter: number | null;

  @Column("varchar", {
    name: "data_api_host",
    nullable: true,
    comment: "host",
    length: 255,
  })
  dataApiHost: string | null;

  @Column("int", {
    name: "auto_refresh",
    nullable: true,
    comment: "自否自动刷新",
  })
  autoRefresh: number | null;

  @Column("int", {
    name: "fetch_interval",
    nullable: true,
    comment: "api 拉去间隔",
  })
  fetchInterval: number | null;

  @Column("varchar", {
    name: "use_data_type",
    nullable: true,
    comment: "数据源类型",
    length: 255,
  })
  useDataType: string | null;

  @Column("text", {
    name: "filter_func",
    nullable: true,
    comment: "返回数据过滤器",
  })
  filterFunc: string | null;

  @Column("text", {
    name: "filter_func_es5_code",
    nullable: true,
    comment: "es5代码",
  })
  filterFuncEs5Code: string | null;

  @Column("text", { name: "description", nullable: true, comment: "描述" })
  description: string | null;

  @Column("int", {
    name: "openHighConfig",
    nullable: true,
    comment: "是否打开高级配置 1 打开 0 关闭",
  })
  openHighConfig: number | null;

  @Column("varchar", {
    name: "method_type",
    nullable: true,
    comment: "请求类型",
    length: 255,
  })
  methodType: string | null;

  @Column("text", {
    name: "parmas_filter_func",
    nullable: true,
    comment: "请求参数过滤器",
  })
  parmasFilterFunc: string | null;

  @Column("text", { name: "parmas_filter_func_es5_code", nullable: true })
  parmasFilterFuncEs5Code: string | null;

  @Column("int", {
    name: "page_init_fetch",
    nullable: true,
    comment: "是否打开页面初始化后就加在 1打开 0关闭  ",
    default: () => "'0'",
  })
  pageInitFetch: number | null;

  @Column("text", {
    name: "virtual_api_func",
    nullable: true,
    comment: "虚拟API的逻辑函数",
  })
  virtualApiFunc: string | null;

  @Column("text", {
    name: "cus_header_func",
    nullable: true,
    comment: "自定义header",
  })
  cusHeaderFunc: string | null;

  @Column("text", { name: "cus_header_func_es5_code", nullable: true })
  cusHeaderFuncEs5Code: string | null;

  @Column("int", {
    name: "direct_data_source",
    nullable: true,
    comment: "是否直连后端数据源",
    default: () => "'0'",
  })
  directDataSource: number | null;

  @Column("varchar", {
    name: "api_router",
    nullable: true,
    comment: "后端api路由",
    length: 255,
  })
  apiRouter: string | null;

  @Column("int", {
    name: "open_api_router_filter",
    nullable: true,
    comment: "是否打开 过滤器",
    default: () => "'0'",
  })
  openApiRouterFilter: number | null;

  @Column("text", {
    name: "api_router_filter",
    nullable: true,
    comment: "apiRouter 过滤器",
  })
  apiRouterFilter: string | null;

  @Column("text", { name: "api_router_filter_es5_code", nullable: true })
  apiRouterFilterEs5Code: string | null;

  @Column("varchar", {
    name: "socket_event_name",
    nullable: true,
    comment: "socket 监听 时间名字 ",
    length: 255,
  })
  socketEventName: string | null;

  @Column("int", {
    name: "not_use_proxy",
    nullable: true,
    comment: "默认是使用代理转发接口",
  })
  notUseProxy: number | null;

  @Column("int", {
    name: "open_mock_api",
    nullable: true,
    comment: "是否打开mockApi",
    default: () => "'0'",
  })
  openMockApi: number | null;

  @Column("text", {
    name: "dy_mock_data_func",
    nullable: true,
    comment: "mockData 函数",
  })
  dyMockDataFunc: string | null;

  @Column("text", { name: "dy_mock_data_func_es5_code", nullable: true })
  dyMockDataFuncEs5Code: string | null;

  @Column("int", {
    name: "mock_delay_time",
    nullable: true,
    comment: "延迟时间",
  })
  mockDelayTime: number | null;


  @Column("text", {
    name: "cancel_request_func",
    nullable: true,
    comment: "es5代码",
  })
  cancelRequestFunc: string | null;

  @Column("text", {
    name: "cancel_request_func_es5_code",
    nullable: true,
    comment: "es5代码",
  })
  cancelRequestFuncEs5Code: string | null;
}
