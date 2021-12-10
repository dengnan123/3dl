import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("permission", { schema: "test" })
export class Permission {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;
}
