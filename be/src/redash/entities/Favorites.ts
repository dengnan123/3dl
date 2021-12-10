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

@Index("favorites_pkey", ["id"], { unique: true })
@Index("unique_favorite", ["objectId", "objectType", "userId"], {
  unique: true,
})
@Entity("favorites", { schema: "public" })
export class Favorites {
  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "object_type",
    unique: true,
    length: 255,
  })
  objectType: string;

  @Column("integer", { name: "object_id", unique: true })
  objectId: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @ManyToOne(() => Organizations, (organizations) => organizations.favorites)
  @JoinColumn([{ name: "org_id", referencedColumnName: "id" }])
  org: Organizations;

  @ManyToOne(() => Users, (users) => users.favorites)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
