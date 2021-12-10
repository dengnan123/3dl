import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_role", { schema: "test" })
export class UserRole {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "user_id", nullable: true, length: 255 })
  userId: string | null;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;
}
