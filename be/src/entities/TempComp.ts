import { Column, Entity } from "typeorm";

@Entity("temp_comp", { schema: "test" })
export class TempComp {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("int", { name: "comp_id" })
  compId: number;

  @Column("int", { name: "page_id" })
  pageId: number;

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

  @Column("int", { name: "status", default: () => "'0'" })
  status: number;

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

  @Column("varchar", { name: "group_id", nullable: true, length: 255 })
  groupId: string | null;

  @Column("int", { name: "translate_x", nullable: true })
  translateX: number | null;

  @Column("int", { name: "transform_y", nullable: true })
  transformY: number | null;

  @Column("text", { name: "basic_style", nullable: true })
  basicStyle: string | null;

  @Column("text", { name: "deps", nullable: true })
  deps: string | null;

  @Column("varchar", { name: "alias_name", nullable: true, length: 255 })
  aliasName: string | null;

  @Column("int", { name: "is_locking", nullable: true })
  isLocking: number | null;

  @Column("int", { name: "is_hidden", nullable: true })
  isHidden: number | null;

  @Column("int", { name: "now_page", nullable: true })
  nowPage: number | null;

  @Column("int", { name: "high_config", nullable: true })
  highConfig: number | null;

  @Column("text", { name: "filter_func", nullable: true })
  filterFunc: string | null;

  @Column("text", { name: "container_deps", nullable: true })
  containerDeps: string | null;

  @Column("varchar", { name: "temp_id", nullable: true, length: 255 })
  tempId: string | null;
}
