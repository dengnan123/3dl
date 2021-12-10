import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_action_log", { schema: "test" })
export class UserActionLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "user_id", nullable: true, comment: "用户ID" })
  userId: number | null;

  @Column("varchar", {
    name: "action_type",
    nullable: true,
    comment: "操作类型",
    length: 255,
  })
  actionType: string | null;

  @Column("text", { name: "des", nullable: true, comment: "详情" })
  des: string | null;

  @Column("bigint", {
    name: "create_time",
    nullable: true,
    comment: "操作时间",
  })
  createTime: string | null;

  @Column("int", { name: "tag_id", nullable: true, comment: "项目Id" })
  tagId: number | null;

  @Column("int", { name: "page_id", nullable: true, comment: "页面ID" })
  pageId: number | null;

  @Column("varchar", {
    name: "comp_id",
    nullable: true,
    comment: "组件ID",
    length: 255,
  })
  compId: string | null;
}
