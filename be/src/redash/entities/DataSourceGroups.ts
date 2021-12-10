import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DataSources } from "./DataSources";
import { Groups } from "./Groups";

@Index("data_source_groups_pkey", ["id"], { unique: true })
@Entity("data_source_groups", { schema: "public" })
export class DataSourceGroups {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("boolean", { name: "view_only" })
  viewOnly: boolean;

  @ManyToOne(() => DataSources, (dataSources) => dataSources.dataSourceGroups)
  @JoinColumn([{ name: "data_source_id", referencedColumnName: "id" }])
  dataSource: DataSources;

  @ManyToOne(() => Groups, (groups) => groups.dataSourceGroups)
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Groups;
}
