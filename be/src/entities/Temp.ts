import { Column, Entity } from "typeorm";

@Entity("temp", { schema: "test" })
export class Temp {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("varchar", { name: "image", nullable: true, length: 255 })
  image: string | null;

  @Column("varchar", { name: "temp_name", nullable: true, length: 255 })
  tempName: string | null;
}
