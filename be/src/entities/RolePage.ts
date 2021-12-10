import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role_page", { schema: "test" })
export class RolePage {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column("int", { name: "page_id", nullable: true })
  pageId: number | null;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId: number | null;
}
