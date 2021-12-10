import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Queries } from "./Queries";
import { DataSources } from "./DataSources";
import { Organizations } from "./Organizations";

@Index("query_results_pkey", ["id"], { unique: true })
@Index("ix_query_results_query_hash", ["queryHash"], {})
@Entity("query_results", { schema: "public" })
export class QueryResults {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "query_hash", length: 32 })
  queryHash: string;

  @Column("text", { name: "query" })
  query: string;

  @Column("text", { name: "data" })
  data: string;

  @Column("double precision", { name: "runtime", precision: 53 })
  runtime: number;

  @Column("timestamp with time zone", { name: "retrieved_at" })
  retrievedAt: Date;

  @OneToMany(() => Queries, (queries) => queries.latestQueryData)
  queries: Queries[];

  @ManyToOne(() => DataSources, (dataSources) => dataSources.queryResults)
  @JoinColumn([{ name: "data_source_id", referencedColumnName: "id" }])
  dataSource: DataSources;

  @ManyToOne(() => Organizations, (organizations) => organizations.queryResults)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;
}
