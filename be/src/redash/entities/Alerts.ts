import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AlertSubscriptions } from "./AlertSubscriptions";
import { Queries } from "./Queries";
import { Users } from "./Users";

@Index("alerts_pkey", ["id"], { unique: true })
@Entity("alerts", { schema: "public" })
export class Alerts {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "options" })
  options: string;

  @Column("character varying", { name: "state", length: 255 })
  state: string;

  @Column("timestamp with time zone", {
    name: "last_triggered_at",
    nullable: true,
  })
  lastTriggeredAt: Date | null;

  @Column("integer", { name: "rearm", nullable: true })
  rearm: number | null;

  @OneToMany(
    () => AlertSubscriptions,
    (alertSubscriptions) => alertSubscriptions.alert
  )
  alertSubscriptions: AlertSubscriptions[];

  @ManyToOne(() => Queries, (queries) => queries.alerts)
  @JoinColumn([{ name: "query_id", referencedColumnName: "id" }])
  query: Queries;

  @ManyToOne(() => Users, (users) => users.alerts)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
