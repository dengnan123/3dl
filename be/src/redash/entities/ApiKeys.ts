import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Organizations } from "./Organizations";

@Index("ix_api_keys_api_key", ["apiKey"], {})
@Index("api_keys_pkey", ["id"], { unique: true })
@Index("api_keys_object_type_object_id", ["objectId", "objectType"], {})
@Entity("api_keys", { schema: "public" })
export class ApiKeys {
  @Column("character varying", { name: "object_type", length: 255 })
  objectType: string;

  @Column("integer", { name: "object_id" })
  objectId: number;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "api_key", length: 255 })
  apiKey: string;

  @Column("boolean", { name: "active" })
  active: boolean;

  @ManyToOne(() => Users, (users) => users.apiKeys)
  @JoinColumn([{ name: "created_by_id", referencedColumnName: "id" }])
  createdBy: Users;

  @ManyToOne(() => Organizations, (organizations) => organizations.apiKeys)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;
}
