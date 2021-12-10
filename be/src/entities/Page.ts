import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("page", { schema: "test" })
export class Page {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;

  @Column("varchar", { name: "user_id", length: 255 })
  userId: string;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("varchar", { name: "description", length: 100 })
  description: string;

  @Column("int", { name: "page_width" })
  pageWidth: number;

  @Column("int", { name: "page_height" })
  pageHeight: number;

  @Column("varchar", { name: "api_host", nullable: true, length: 100 })
  apiHost: string | null;

  @Column("varchar", { name: "bgi", nullable: true, length: 100 })
  bgi: string | null;

  @Column("varchar", {
    name: "bgc",
    nullable: true,
    length: 100,
    default: () => "'#151f30'",
  })
  bgc: string | null;

  @Column("varchar", {
    name: "type",
    nullable: true,
    length: 255,
    default: () => "'allSpread'",
  })
  type: string | null;

  @Column("varchar", { name: "loading_img", nullable: true, length: 255 })
  loadingImg: string | null;

  @Column("varchar", { name: "font_family", nullable: true, length: 255 })
  fontFamily: string | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "0正常 1 删除",
    default: () => "'0'",
  })
  status: number | null;

  @Column("int", {
    name: "hot_update",
    nullable: true,
    comment: "是否开启热更新 1 打开 默认 0 ",
    default: () => "'0'",
  })
  hotUpdate: number | null;

  @Column("text", { name: "page_shell", nullable: true, comment: "页面脚本" })
  pageShell: string | null;

  @Column("text", {
    name: "page_shell_es5_code",
    nullable: true,
    comment: "es5代码",
  })
  pageShellEs5Code: string | null;

  @Column("int", { name: "tag_id", nullable: true, comment: "页面分类ID" })
  tagId: number | null;

  @Column("text", {
    name: "grid_layout",
    nullable: true,
    comment: "页面栅格布局属性",
  })
  gridLayout: string | null;

  @Column("varchar", {
    name: "page_cover_img",
    nullable: true,
    comment: "封面图",
    length: 255,
  })
  pageCoverImg: string | null;

  @Column("varchar", {
    name: "layout_type",
    nullable: true,
    comment: "grid 是栅格布局 默认自由布局",
    length: 255,
  })
  layoutType: string | null;

  @Column("bigint", { name: "update_time", nullable: true })
  updateTime: string | null;

  @Column("text", { name: "rule_style", nullable: true, comment: "参考线样式" })
  ruleStyle: string | null;

  @Column("int", {
    name: "is_ default",
    nullable: true,
    comment: "是否是项目默认页面",
    default: () => "'0'",
  })
  isDefault: number | null;

  @Column("text", {
    name: "page_destory_shell",
    nullable: true,
    comment: "页面销毁脚本",
  })
  pageDestoryShell: string | null;

  @Column("text", { name: "page_destory_shell_es5_code", nullable: true })
  pageDestoryShellEs5Code: string | null;

  @Column("int", {
    name: "open_lazy_loading",
    nullable: true,
    comment: "默认页面开启懒加载",
    default: () => "'1'",
  })
  openLazyLoading: number | null;
}
