import { Column, Entity } from "typeorm";

@Entity("user", { schema: "test" })
export class User {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("varchar", { name: "user_name", nullable: true, length: 255 })
  userName: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;
}
