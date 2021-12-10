import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Alerts } from "./Alerts";
import { DataSources } from "./DataSources";
import { QueryResults } from "./QueryResults";
import { Users } from "./Users";
import { Organizations } from "./Organizations";
import { Visualizations } from "./Visualizations";

@Index("queries_pkey", ["id"], { unique: true })
@Index("ix_queries_is_archived", ["isArchived"], {})
@Index("ix_queries_is_draft", ["isDraft"], {})
@Index("ix_queries_search_vector", ["searchVector"], {})
@Entity("queries", { schema: "public" })
export class Queries {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "version" })
  version: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 4096,
  })
  description: string | null;

  @Column("text", { name: "query" })
  query: string;

  @Column("character varying", { name: "query_hash", length: 32 })
  queryHash: string;

  @Column("character varying", { name: "api_key", length: 40 })
  apiKey: string;

  @Column("boolean", { name: "is_archived" })
  isArchived: boolean;

  @Column("boolean", { name: "is_draft" })
  isDraft: boolean;

  @Column("text", { name: "schedule", nullable: true })
  schedule: string | null;

  @Column("integer", { name: "schedule_failures" })
  scheduleFailures: number;

  @Column("text", { name: "options" })
  options: string;

  @Column("tsvector", { name: "search_vector", nullable: true })
  searchVector: string | null;

  @Column("varchar", { name: "tags", nullable: true, array: true })
  tags: string[] | null;

  @OneToMany(() => Alerts, (alerts) => alerts.query)
  alerts: Alerts[];

  @ManyToOne(() => DataSources, (dataSources) => dataSources.queries)
  @JoinColumn([{ name: "data_source_id", referencedColumnName: "id" }])
  dataSource: DataSources;

  @ManyToOne(() => QueryResults, (queryResults) => queryResults.queries)
  @JoinColumn([{ name: "latest_query_data_id", referencedColumnName: "id" }])
  latestQueryData: QueryResults;

  @ManyToOne(() => Users, (users) => users.queries)
  @JoinColumn([{ name: "last_modified_by_id", referencedColumnName: "id" }])
  lastModifiedBy: Users;

  @ManyToOne(() => Organizations, (organizations) => organizations.queries)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @ManyToOne(() => Users, (users) => users.queries2)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(() => Visualizations, (visualizations) => visualizations.query)
  visualizations: Visualizations[];
}
