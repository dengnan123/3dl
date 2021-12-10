import { Column, Entity } from "typeorm";

@Entity("theme_color", { schema: "test" })
export class ThemeColor {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "colors", nullable: true })
  colors: string | null;

  @Column("int", { name: "creat_time", nullable: true })
  creatTime: number | null;

  @Column("int", { name: "update_time", nullable: true })
  updateTime: number | null;

  @Column("int", { name: "status", nullable: true })
  status: number | null;
}
