import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organizations } from "./Organizations";
import { Users } from "./Users";

@Index("query_snippets_pkey", ["id"], { unique: true })
@Index("query_snippets_trigger_key", ["trigger"], { unique: true })
@Entity("query_snippets", { schema: "public" })
export class QuerySnippets {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "trigger", unique: true, length: 255 })
  trigger: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("text", { name: "snippet" })
  snippet: string;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.querySnippets
  )
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @ManyToOne(() => Users, (users) => users.querySnippets)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
