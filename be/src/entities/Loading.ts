import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("loading", { schema: "test" })
export class Loading {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "loadingStyle", nullable: true })
  loadingStyle: string | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId: number | null;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("int", { name: "detault", nullable: true })
  detault: number | null;
}
