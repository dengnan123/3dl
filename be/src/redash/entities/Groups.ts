import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DataSourceGroups } from "./DataSourceGroups";
import { Organizations } from "./Organizations";

@Index("groups_pkey", ["id"], { unique: true })
@Entity("groups", { schema: "public" })
export class Groups {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "type", length: 255 })
  type: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("varchar", { name: "permissions", array: true })
  permissions: string[];

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @OneToMany(
    () => DataSourceGroups,
    (dataSourceGroups) => dataSourceGroups.group
  )
  dataSourceGroups: DataSourceGroups[];

  @ManyToOne(() => Organizations, (organizations) => organizations.groups)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;
}
