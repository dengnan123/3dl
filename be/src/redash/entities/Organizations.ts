import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiKeys } from "./ApiKeys";
import { Dashboards } from "./Dashboards";
import { DataSources } from "./DataSources";
import { Events } from "./Events";
import { Favorites } from "./Favorites";
import { Groups } from "./Groups";
import { NotificationDestinations } from "./NotificationDestinations";
import { Queries } from "./Queries";
import { QueryResults } from "./QueryResults";
import { QuerySnippets } from "./QuerySnippets";
import { Users } from "./Users";

@Index("organizations_pkey", ["id"], { unique: true })
@Index("organizations_slug_key", ["slug"], { unique: true })
@Entity("organizations", { schema: "public" })
export class Organizations {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "slug", unique: true, length: 255 })
  slug: string;

  @Column("text", { name: "settings" })
  settings: string;

  @OneToMany(() => ApiKeys, (apiKeys) => apiKeys.org)
  apiKeys: ApiKeys[];

  @OneToMany(() => Dashboards, (dashboards) => dashboards.org)
  dashboards: Dashboards[];

  @OneToMany(() => DataSources, (dataSources) => dataSources.org)
  dataSources: DataSources[];

  @OneToMany(() => Events, (events) => events.org)
  events: Events[];

  @OneToMany(() => Favorites, (favorites) => favorites.org)
  favorites: Favorites[];

  @OneToMany(() => Groups, (groups) => groups.org)
  groups: Groups[];

  @OneToMany(
    () => NotificationDestinations,
    (notificationDestinations) => notificationDestinations.org
  )
  notificationDestinations: NotificationDestinations[];

  @OneToMany(() => Queries, (queries) => queries.org)
  queries: Queries[];

  @OneToMany(() => QueryResults, (queryResults) => queryResults.org)
  queryResults: QueryResults[];

  @OneToMany(() => QuerySnippets, (querySnippets) => querySnippets.org)
  querySnippets: QuerySnippets[];

  @OneToMany(() => Users, (users) => users.org)
  users: Users[];
}
