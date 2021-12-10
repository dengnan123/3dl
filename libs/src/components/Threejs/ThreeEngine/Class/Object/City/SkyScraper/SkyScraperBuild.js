import { InstancedMesh, Vector3, Matrix4, Object3D } from "three";
import { StringTake } from "../../../../Tool/StringTake";
import { Three3DTool } from "../../../../Tool/Three3DTool";
import { ThreeGroup } from "../../Three/ThreeGroup";


class SkyScraperBuild extends ThreeGroup {

  constructor(object) {
    super();
    if (object) {
      this.load(object);
    }

    this.#object.matrixAutoUpdate = false;
    this.#objectSon.matrixAutoUpdate = false;
  };



  #states = {
    loadComplete: false,
    defaultBuildCount: 1400,
    defaultBuildDelta: 100,
    defaultFloorCount: 6000,
    defaultFloorDelta: 400,
    currentCount: {}
  }

  add(object, height = 0) {
    // this.#addStack.push({ matrix: new Matrix4().copy(matrixWorld), height });
    this.#addStack.push({ object, height });
    return;

    // obj.applyMatrix4(matrixWorld);
    // console.log("aa");
  }
  update() {
    if (!this.#states.loadComplete) return;
    const list = this.#addStack;
    this.#addStack = [];

    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      const object = element.object;
      const height = element.height;
      this.#add(object, height);
    }
    // console.log(list);
    this.#bottomInstance.instanceMatrix.needsUpdate = true;
    this.#topInstance.instanceMatrix.needsUpdate = true;
    for (var key in this.#middleInstance) {
      this.#middleInstance[key].instanceMatrix.needsUpdate = true;
    }
  }
  load(object) {
    if (this.#states.loadComplete) return;
    this.#states.loadComplete = true;


    const h = {};
    object.children.forEach(element => {
      const material = element.children[0].material;
      material.emissiveMap = material.map;
      material.emissive.setRGB(1.0, 1.0, 1.0);
      material.emissiveIntensity = 0.3;
      console.log(material);

      var name = "";
      name = StringTake.takeGLTFNodeName(element.name);
      h[name] = element.position.y;
      element.position.setY(0);
      element.updateMatrix();
      if (name === "Top") {
        if (this.#topInstance) {
          console.log(`${object.name} 重复Top`);
          return;
        }
        const geo = element.children[0].geometry;
        // console.log(element.children[0]);
        const insMesh = new InstancedMesh(geo, material, this.#states.defaultBuildCount);
        this.group.add(insMesh);
        this.#topInstance = insMesh;
        this.#states.currentCount['Top'] = insMesh.count;
        insMesh.name = name;
        insMesh.count = 0;
        return;
      }
      if (name === "Bottom") {
        if (this.#bottomInstance) {
          console.log(`${object.name} 重复Bottom`);
          return;
        }
        const geo = element.children[0].geometry;
        const insMesh = new InstancedMesh(geo, material, this.#states.defaultBuildCount);
        this.group.add(insMesh);
        this.#bottomInstance = insMesh;
        this.#states.currentCount['Bottom'] = insMesh.count;
        insMesh.name = name;

        insMesh.count = 0;
        return;
      }
      const geo = element.children[0].geometry;

      const insMesh = new InstancedMesh(geo, material, this.#states.defaultFloorCount);
      this.group.add(insMesh);
      this.#states.currentCount[name] = insMesh.count;
      insMesh.count = 0;
      insMesh.name = name;

      this.#middleInstance[name] = insMesh;
    });

    var res = Object.keys(h).sort(function (a, b) {

      return h[a] - h[b];
    });
    for (let index = 0; index < res.length - 1; index++) {
      const hKey = res[index];
      const key2 = res[index + 1];
      this.#height[hKey] = h[key2] - h[hKey];
    }
    const top = this.#topInstance;
    this.#height['Top'] = top.geometry.boundingBox.max.y - top.geometry.boundingBox.min.y;

    console.log(this.#height);
  }

  #add = (root, height) => {
    const object3D = this.#object;
    const objSon = this.#objectSon;
    const v3 = this.#v3;
    object3D.parent = null;
    Three3DTool.clearTransform(object3D);
    object3D.add(objSon);
    Three3DTool.clearTransform(objSon);

    const mesh = root.children[0];
    root.remove(mesh);

    var bMax = this.#bottomInstance.geometry.boundingBox.max;
    var bMin = this.#bottomInstance.geometry.boundingBox.min;
    var x = bMax.x - bMin.x;
    var z = bMax.z - bMin.z;
    v3.set(1 / x, 1 / root.scale.y, 1 / z);
    root.position.setY(root.position.y + mesh.geometry.boundingBox.min.y * root.scale.y);
    root.scale.multiply(v3);
    root.updateMatrix();
    root.add(object3D);


    const floorCount = Math.floor((height - this.#height.Top - this.#height.Bottom) / this.#height.Type_0);
    let h = 0;
    //bottom
    const target = objSon;


    const bottomIndex = this.#bottomInstance.count;

    this.#bottomInstance.count += 1;
    this.#bottomInstance.attach(target);

    this.#bottomInstance.setMatrixAt(bottomIndex, target.matrix);
    h += this.#height.Bottom;

    //#region   
    //middle
    const middleIndex = this.#middleInstance.Type_0.count;

    const mIns = this.#middleInstance.Type_0;
    mIns.count += floorCount;
    for (let index = 0; index < floorCount; index++) {
      object3D.attach(target);
      target.position.setY(h);
      target.updateMatrix();
      mIns.attach(target);
      mIns.setMatrixAt(index + middleIndex, target.matrix);
      h += this.#height.Type_0;
      mIns.instanceMatrix.needsUpdate = true;
    }


    const topIndex = this.#topInstance.count;

    this.#topInstance.count += 1;
    object3D.attach(target);
    target.position.setY(h);
    target.updateMatrix();
    this.#topInstance.attach(target);
    this.#topInstance.setMatrixAt(topIndex, target.matrix);

    if (this.#bottomInstance.count % 1000 === 500) {
      console.log(h)
    }
    // console.log(this.#defaultMatrix);
    // console.log(this.#bottomInstance.count);


    //#endregion





  }
  #bounds = {};
  #height = {};
  #topInstance;
  #middleInstance = {};
  #bottomInstance;

  #object = new Object3D();
  #objectSon = new Object3D();
  #defaultMatrix = new Matrix4();
  #v3 = new Vector3();

  #addStack = [];


}

export { SkyScraperBuild }