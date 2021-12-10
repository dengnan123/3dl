import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role", { schema: "test" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("varchar", { name: "des", nullable: true, length: 255 })
  des: string | null;
}
