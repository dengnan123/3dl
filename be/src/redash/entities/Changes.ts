import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("changes_pkey", ["id"], { unique: true })
@Entity("changes", { schema: "public" })
export class Changes {
  @Column("character varying", { name: "object_type", length: 255 })
  objectType: string;

  @Column("integer", { name: "object_id" })
  objectId: number;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "object_version" })
  objectVersion: number;

  @Column("text", { name: "change" })
  change: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.changes)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
