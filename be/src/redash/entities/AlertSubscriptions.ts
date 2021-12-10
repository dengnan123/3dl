import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NotificationDestinations } from "./NotificationDestinations";
import { Alerts } from "./Alerts";
import { Users } from "./Users";

@Index(
  "alert_subscriptions_destination_id_alert_id",
  ["alertId", "destinationId"],
  { unique: true }
)
@Index("alert_subscriptions_pkey", ["id"], { unique: true })
@Entity("alert_subscriptions", { schema: "public" })
export class AlertSubscriptions {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "destination_id", nullable: true })
  destinationId: number | null;

  @Column("integer", { name: "alert_id" })
  alertId: number;

  @ManyToOne(
    () => NotificationDestinations,
    (notificationDestinations) => notificationDestinations.alertSubscriptions
  )
  @JoinColumn([{ name: "destination_id", referencedColumnName: "id" }])
  destination: NotificationDestinations;

  @ManyToOne(() => Alerts, (alerts) => alerts.alertSubscriptions)
  @JoinColumn([{ name: "alert_id", referencedColumnName: "id" }])
  alert: Alerts;

  @ManyToOne(() => Users, (users) => users.alertSubscriptions)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
