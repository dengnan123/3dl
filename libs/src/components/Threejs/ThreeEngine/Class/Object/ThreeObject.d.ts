export class ThreeObject {
  /**
   * 
   */
  constructor();

  /**
   *  用于存放需要dispose的资源
   */
  object: Object;
  disposed: Boolean;
  /**
   * 销毁
   */
  dispose(): void;
}

