import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("env", { schema: "test" })
export class Env {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "名称",
    length: 255,
  })
  name: string | null;

  @Column("varchar", {
    name: "env_key",
    nullable: true,
    comment: "环境变量 KEY 值",
    length: 255,
  })
  envKey: string | null;

  @Column("int", { name: "page_id", nullable: true })
  pageId: number | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "1 正常  0 删除",
    default: () => "'1'",
  })
  status: number | null;

  @Column("int", {
    name: "checked",
    nullable: true,
    comment: "1 选中  0 没选中",
    default: () => "'0'",
  })
  checked: number | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId: number | null;
}
