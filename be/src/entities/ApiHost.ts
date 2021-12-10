import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("api_host", { schema: "test" })
export class ApiHost {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", {
    name: "api_host_name",
    nullable: true,
    comment: "名称",
    length: 255,
  })
  apiHostName: string | null;

  @Column("text", { name: "source_list", nullable: true, comment: "数据组 " })
  sourceList: string | null;

  @Column("varchar", {
    name: "api_host_env",
    nullable: true,
    comment: "API_HOST变量",
    length: 255,
  })
  apiHostEnv: string | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "1 正常 0删除",
    default: () => "'1'",
  })
  status: number | null;

  @Column("int", { name: "page_id", nullable: true, comment: "页面ID" })
  pageId: number | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId: number | null;

  @Column("int", {
    name: "not_use_proxy",
    nullable: true,
    comment: "设置是否使用node转发 默认是使用的 0 ",
    default: () => "'0'",
  })
  notUseProxy: number | null;

  @Column("varchar", {
    name: "type",
    nullable: true,
    comment: "数据源类型 默认是接口地址 也可能是数据库",
    length: 255,
  })
  type: string | null;
}
