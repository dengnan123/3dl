import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tag", { schema: "test" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "1 正常 0 删除",
    default: () => "'1'",
  })
  status: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("int", {
    name: "loading_id",
    nullable: true,
    comment: "项目使用的loading ",
  })
  loadingId: number | null;

  @Column("text", { name: "git_config", nullable: true })
  gitConfig: string | null;

  @Column("text", { name: "server_config", nullable: true })
  serverConfig: string | null;
}
