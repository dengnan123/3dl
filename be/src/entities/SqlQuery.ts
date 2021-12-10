import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sql_query", { schema: "test" })
export class SqlQuery {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "query", nullable: true })
  query: string | null;

  @Column("text", { name: "options", nullable: true })
  options: string | null;

  @Column("int", { name: "data_source_id", nullable: true })
  dataSourceId: number | null;
}
