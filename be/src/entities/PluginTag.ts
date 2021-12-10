import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("plugin_tag", { schema: "test" })
export class PluginTag {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("int", { name: "zIndex", nullable: true, comment: "排序" })
  zIndex: number | null;
}
