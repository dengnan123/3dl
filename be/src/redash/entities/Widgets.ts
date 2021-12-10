import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dashboards } from "./Dashboards";
import { Visualizations } from "./Visualizations";

@Index("ix_widgets_dashboard_id", ["dashboardId"], {})
@Index("widgets_pkey", ["id"], { unique: true })
@Entity("widgets", { schema: "public" })
export class Widgets {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "text", nullable: true })
  text: string | null;

  @Column("integer", { name: "width" })
  width: number;

  @Column("text", { name: "options" })
  options: string;

  @Column("integer", { name: "dashboard_id" })
  dashboardId: number;

  @ManyToOne(() => Dashboards, (dashboards) => dashboards.widgets)
  @JoinColumn([{ name: "dashboard_id", referencedColumnName: "id" }])
  dashboard: Dashboards;

  @ManyToOne(() => Visualizations, (visualizations) => visualizations.widgets)
  @JoinColumn([{ name: "visualization_id", referencedColumnName: "id" }])
  visualization: Visualizations;
}
