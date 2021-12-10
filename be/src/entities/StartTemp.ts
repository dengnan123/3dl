import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("start_temp", { schema: "test" })
export class StartTemp {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("text", { name: "json", nullable: true })
  json: string | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;
}
