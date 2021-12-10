import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("database_", { schema: "test" })
export class Database {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("text", { name: "options", nullable: true })
  options: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;
}
