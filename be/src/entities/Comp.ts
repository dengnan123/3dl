import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comp", { schema: "test" })
export class Comp {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("int", { name: "width", nullable: true, default: () => "'250'" })
  width: number | null;

  @Column("int", { name: "height", nullable: true, default: () => "'250'" })
  height: number | null;

  @Column("int", { name: "z_index", nullable: true, default: () => "'0'" })
  zIndex: number | null;

  @Column("int", { name: "left", nullable: true, default: () => "'100'" })
  left: number | null;

  @Column("int", { name: "top", nullable: true, default: () => "'100'" })
  top: number | null;

  @Column("varchar", { name: "description", nullable: true, length: 100 })
  description: string | null;
}
