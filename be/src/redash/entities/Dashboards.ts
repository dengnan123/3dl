import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organizations } from "./Organizations";
import { Users } from "./Users";
import { Widgets } from "./Widgets";

@Index("dashboards_pkey", ["id"], { unique: true })
@Index("ix_dashboards_is_archived", ["isArchived"], {})
@Index("ix_dashboards_is_draft", ["isDraft"], {})
@Index("ix_dashboards_slug", ["slug"], {})
@Entity("dashboards", { schema: "public" })
export class Dashboards {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "version" })
  version: number;

  @Column("character varying", { name: "slug", length: 140 })
  slug: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "layout" })
  layout: string;

  @Column("boolean", { name: "dashboard_filters_enabled" })
  dashboardFiltersEnabled: boolean;

  @Column("boolean", { name: "is_archived" })
  isArchived: boolean;

  @Column("boolean", { name: "is_draft" })
  isDraft: boolean;

  @Column("varchar", { name: "tags", nullable: true, array: true })
  tags: string[] | null;

  @ManyToOne(() => Organizations, (organizations) => organizations.dashboards)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @ManyToOne(() => Users, (users) => users.dashboards)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(() => Widgets, (widgets) => widgets.dashboard)
  widgets: Widgets[];
}
