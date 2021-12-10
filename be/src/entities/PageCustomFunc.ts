import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("page_custom_func", { schema: "test" })
export class PageCustomFunc {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "pageId", nullable: true })
  pageId: number | null;

  @Column("int", { name: "tagId", nullable: true })
  tagId: number | null;

  @Column("int", { name: "status", nullable: true })
  status: number | null;

  @Column("int", { name: "funcId", nullable: true })
  funcId: number | null;

  @Column("bigint", { name: "createTime", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "updateTime", nullable: true })
  updateTime: string | null;
}
