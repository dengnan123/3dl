import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comp_data_source", { schema: "test" })
export class CompDataSource {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", {
    name: "comp_id",
    nullable: true,
    comment: "组件ID",
    length: 255,
  })
  compId: string | null;

  @Column("varchar", {
    name: "data_source_id",
    nullable: true,
    comment: "数据源ID",
    length: 255,
  })
  dataSourceId: string | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "0删除 1 正常",
    default: () => "'1'",
  })
  status: number | null;

  @Column("int", { name: "page_id", nullable: true, comment: "页面ID " })
  pageId: number | null;

  @Column("int", { name: "tag_id", nullable: true, comment: "项目ID" })
  tagId: number | null;
}
