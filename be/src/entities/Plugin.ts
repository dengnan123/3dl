import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("plugin", { schema: "test" })
export class Plugin {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "status", nullable: true, default: () => "'1'" })
  status: number | null;

  @Column("varchar", {
    name: "plugin_name",
    nullable: true,
    comment: "名字",
    length: 255,
  })
  pluginName: string | null;

  @Column("varchar", {
    name: "plugin_key",
    nullable: true,
    comment: "组件打包出来的名字",
    length: 255,
  })
  pluginKey: string | null;

  @Column("varchar", {
    name: "type",
    nullable: true,
    comment: "组件类型由pluinTag决定",
    length: 255,
  })
  type: string | null;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("varchar", {
    name: "version",
    nullable: true,
    comment: "版本",
    length: 255,
  })
  version: string | null;

  @Column("varchar", {
    name: "remark",
    nullable: true,
    comment: "插件描述",
    length: 255,
  })
  remark: string | null;

  @Column("text", {
    name: "expand_info",
    nullable: true,
    comment: "插件字段拓展 json格式",
  })
  expandInfo: string | null;

  @Column("text", { name: "options", nullable: true })
  options: string | null;

  @Column("varchar", {
    name: "plugin_src",
    nullable: true,
    comment: "插件存放地址",
    length: 255,
  })
  pluginSrc: string | null;

  @Column("varchar", {
    name: "plugin_image_src",
    nullable: true,
    comment: "插件图片链接",
    length: 255,
  })
  pluginImageSrc: string | null;

  @Column("int", { name: "plugin_tag_id", nullable: true })
  pluginTagId: number | null;
}
