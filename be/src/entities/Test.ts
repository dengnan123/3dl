import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("test", { schema: "test" })
export class Test {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "name", nullable: true })
  name: number | null;
}
