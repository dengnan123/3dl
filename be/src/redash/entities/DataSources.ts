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
import { Queries } from "./Queries";
import { QueryResults } from "./QueryResults";

@Index("data_sources_pkey", ["id"], { unique: true })
@Index("data_sources_org_id_name", ["name", "orgId"], {})
@Entity("data_sources", { schema: "public" })
export class DataSources {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "org_id" })
  orgId: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "type", length: 255 })
  type: string;

  @Column("bytea", { name: "encrypted_options" })
  encryptedOptions: Buffer;

  @Column("character varying", { name: "queue_name", length: 255 })
  queueName: string;

  @Column("character varying", { name: "scheduled_queue_name", length: 255 })
  scheduledQueueName: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @OneToMany(
    () => DataSourceGroups,
    (dataSourceGroups) => dataSourceGroups.dataSource
  )
  dataSourceGroups: DataSourceGroups[];

  @ManyToOne(() => Organizations, (organizations) => organizations.dataSources)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @OneToMany(() => Queries, (queries) => queries.dataSource)
  queries: Queries[];

  @OneToMany(() => QueryResults, (queryResults) => queryResults.dataSource)
  queryResults: QueryResults[];
}
