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

@Index("events_pkey", ["id"], { unique: true })
@Entity("events", { schema: "public" })
export class Events {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "action", length: 255 })
  action: string;

  @Column("character varying", { name: "object_type", length: 255 })
  objectType: string;

  @Column("character varying", {
    name: "object_id",
    nullable: true,
    length: 255,
  })
  objectId: string | null;

  @Column("text", { name: "additional_properties", nullable: true })
  additionalProperties: string | null;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Organizations, (organizations) => organizations.events)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @ManyToOne(() => Users, (users) => users.events)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
