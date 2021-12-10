import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role_feature", { schema: "test" })
export class RoleFeature {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column("text", { name: "feature", nullable: true })
  feature: string | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;
}
