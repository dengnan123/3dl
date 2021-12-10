import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("access_permissions_pkey", ["id"], { unique: true })
@Entity("access_permissions", { schema: "public" })
export class AccessPermissions {
  @Column("character varying", { name: "object_type", length: 255 })
  objectType: string;

  @Column("integer", { name: "object_id" })
  objectId: number;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "access_type", length: 255 })
  accessType: string;

  @ManyToOne(() => Users, (users) => users.accessPermissions)
  @JoinColumn([{ name: "grantee_id", referencedColumnName: "id" }])
  grantee: Users;

  @ManyToOne(() => Users, (users) => users.accessPermissions2)
  @JoinColumn([{ name: "grantor_id", referencedColumnName: "id" }])
  grantor: Users;
}
