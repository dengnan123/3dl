import { Object3D } from "three";
import { ThreeObject } from "../../ThreeObject";

class SplitBuild extends ThreeObject{
  constructor(object:Object);


  readonly root:Object3D;
  static getFromObject(object:SplitBuild):SplitBuild;
}