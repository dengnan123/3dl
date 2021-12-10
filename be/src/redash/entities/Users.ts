import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccessPermissions } from "./AccessPermissions";
import { AlertSubscriptions } from "./AlertSubscriptions";
import { Alerts } from "./Alerts";
import { ApiKeys } from "./ApiKeys";
import { Changes } from "./Changes";
import { Dashboards } from "./Dashboards";
import { Events } from "./Events";
import { Favorites } from "./Favorites";
import { NotificationDestinations } from "./NotificationDestinations";
import { Queries } from "./Queries";
import { QuerySnippets } from "./QuerySnippets";
import { Organizations } from "./Organizations";

@Index("users_api_key_key", ["apiKey"], { unique: true })
@Index("users_org_id_email", ["email", "orgId"], { unique: true })
@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "org_id" })
  orgId: number;

  @Column("character varying", { name: "name", length: 320 })
  name: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", {
    name: "profile_image_url",
    nullable: true,
    length: 320,
  })
  profileImageUrl: string | null;

  @Column("character varying", {
    name: "password_hash",
    nullable: true,
    length: 128,
  })
  passwordHash: string | null;

  @Column("int4", { name: "groups", nullable: true, array: true })
  groups: number[] | null;

  @Column("character varying", { name: "api_key", unique: true, length: 40 })
  apiKey: string;

  @Column("timestamp with time zone", { name: "disabled_at", nullable: true })
  disabledAt: Date | null;

  @Column("json", { name: "details", nullable: true, default: {} })
  details: object | null;

  @OneToMany(
    () => AccessPermissions,
    (accessPermissions) => accessPermissions.grantee
  )
  accessPermissions: AccessPermissions[];

  @OneToMany(
    () => AccessPermissions,
    (accessPermissions) => accessPermissions.grantor
  )
  accessPermissions2: AccessPermissions[];

  @OneToMany(
    () => AlertSubscriptions,
    (alertSubscriptions) => alertSubscriptions.user
  )
  alertSubscriptions: AlertSubscriptions[];

  @OneToMany(() => Alerts, (alerts) => alerts.user)
  alerts: Alerts[];

  @OneToMany(() => ApiKeys, (apiKeys) => apiKeys.createdBy)
  apiKeys: ApiKeys[];

  @OneToMany(() => Changes, (changes) => changes.user)
  changes: Changes[];

  @OneToMany(() => Dashboards, (dashboards) => dashboards.user)
  dashboards: Dashboards[];

  @OneToMany(() => Events, (events) => events.user)
  events: Events[];

  @OneToMany(() => Favorites, (favorites) => favorites.user)
  favorites: Favorites[];

  @OneToMany(
    () => NotificationDestinations,
    (notificationDestinations) => notificationDestinations.user
  )
  notificationDestinations: NotificationDestinations[];

  @OneToMany(() => Queries, (queries) => queries.lastModifiedBy)
  queries: Queries[];

  @OneToMany(() => Queries, (queries) => queries.user)
  queries2: Queries[];

  @OneToMany(() => QuerySnippets, (querySnippets) => querySnippets.user)
  querySnippets: QuerySnippets[];

  @ManyToOne(() => Organizations, (organizations) => organizations.users)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;
}
