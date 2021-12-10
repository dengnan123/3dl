import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comp_use_func", { schema: "test" })
export class CompUseFunc {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "page_id", nullable: true })
  pageId: number | null;

  @Column("varchar", { name: "comp_id", nullable: true, length: 255 })
  compId: string | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId: number | null;

  @Column("varchar", {
    name: "comp_func_key",
    nullable: true,
    comment: "组件函数 名字",
    length: 255,
  })
  compFuncKey: string | null;

  @Column("int", { name: "func_id", nullable: true, comment: "使用的函数ID " })
  funcId: number | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "状态",
    default: () => "'1'",
  })
  status: number | null;
}
