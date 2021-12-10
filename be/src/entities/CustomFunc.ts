import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("custom_func", { schema: "test" })
export class CustomFunc {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "en_name", nullable: true, length: 255 })
  enName: string | null;

  @Column("text", { name: "des", nullable: true })
  des: string | null;

  @Column("varchar", { name: "input_type", nullable: true, length: 255 })
  inputType: string | null;

  @Column("varchar", { name: "return_type", nullable: true, length: 255 })
  returnType: string | null;

  @Column("int", { name: "status", nullable: true })
  status: number | null;

  @Column("text", { name: "custom_func", nullable: true })
  customFunc: string | null;

  @Column("text", { name: "custom_func_es5_code", nullable: true })
  customFuncEs5Code: string | null;

  @Column("bigint", { name: "createTime", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "updateTime", nullable: true })
  updateTime: string | null;
}
