import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("index_id", ["indexId"], {})
@Entity("theme_config", { schema: "test" })
export class ThemeConfig {
  @Column("varchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "creat_time", nullable: true })
  creatTime: number | null;

  @Column("int", { name: "update_time", nullable: true })
  updateTime: number | null;

  @Column("int", { name: "status", nullable: true })
  status: number | null;

  @Column("varchar", {
    name: "type",
    nullable: true,
    comment: "主题类型,对应的是组件库 的compName",
    length: 255,
  })
  type: string | null;

  @Column("text", {
    name: "style",
    nullable: true,
    comment: "主题库配置，对应组件表的styke",
  })
  style: string | null;

  @Column("text", { name: "mock_data", nullable: true })
  mockData: string | null;

  @Column("text", {
    name: "image_src",
    nullable: true,
    comment: "base 64 图片",
  })
  imageSrc: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "index_id" })
  indexId: number;

  @Column("varchar", {
    name: "theme_type",
    nullable: true,
    comment: "主题库分类",
    length: 255,
  })
  themeType: string | null;
}
