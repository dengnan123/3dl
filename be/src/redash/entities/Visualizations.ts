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
import { Widgets } from "./Widgets";

@Index("visualizations_pkey", ["id"], { unique: true })
@Entity("visualizations", { schema: "public" })
export class Visualizations {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "type", length: 100 })
  type: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 4096,
  })
  description: string | null;

  @Column("text", { name: "options" })
  options: string;

  @ManyToOne(() => Queries, (queries) => queries.visualizations)
  @JoinColumn([{ name: "query_id", referencedColumnName: "id" }])
  query: Queries;

  @OneToMany(() => Widgets, (widgets) => widgets.visualization)
  widgets: Widgets[];
}
