import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("replace", { schema: "test" })
export class Replace {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "replace_json", nullable: true })
  replaceJson: string | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "1 正常  0 删除",
    default: () => "'1'",
  })
  status: number | null;
}
