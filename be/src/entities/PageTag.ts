import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("page_tag", { schema: "test" })
export class PageTag {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "page_id", nullable: true })
  pageId: number | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId: number | null;

  @Column("int", { name: "status", nullable: true, comment: "1正常 0删除" })
  status: number | null;
}
