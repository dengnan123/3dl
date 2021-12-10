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
import { Organizations } from "./Organizations";
import { Users } from "./Users";

@Index("notification_destinations_pkey", ["id"], { unique: true })
@Index("notification_destinations_org_id_name", ["name", "orgId"], {
  unique: true,
})
@Entity("notification_destinations", { schema: "public" })
export class NotificationDestinations {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "org_id" })
  orgId: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "type", length: 255 })
  type: string;

  @Column("text", { name: "options" })
  options: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @OneToMany(
    () => AlertSubscriptions,
    (alertSubscriptions) => alertSubscriptions.destination
  )
  alertSubscriptions: AlertSubscriptions[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.notificationDestinations
  )
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @ManyToOne(() => Users, (users) => users.notificationDestinations)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
