import { DoubleSide } from "three";
import { InstancedMesh, Matrix4, Group, Object3D } from "three";
import { Three3DTool } from "../../Tool/Three3DTool";


function InstanceItem(item, count) {
  const root = new Group();
  const instances = [];

  const obj3D = new Object3D();
  let isDoubleFace = false;

  init();
  function init() {
    root.name = item.name;
    //获取meshes
    var meshes = Three3DTool.getObjectsWithType(item, 'isMesh');
    //将根目录转移到item下
    item.add(root);

    meshes.forEach(element => {
      var insMesh = new InstancedMesh(element.geometry, element.material, count);
      insMesh.name = element.name;
      root.add(insMesh);
      instances.push(insMesh);
    });
  }

  this.set = function (item, index) {
    let side = 0;
    instances.forEach(element => {
      //清除obj状态
      Three3DTool.clearTransform(obj3D);
      //将obj转移到element下面
      element.add(obj3D);
      //转移到父空间
      element.parent.attach(obj3D);
      //转移到相对目标空间
      item.add(obj3D);
      //转移到父空间
      element.parent.attach(obj3D);
      element.setMatrixAt(index, obj3D.matrix);
      element.parent.remove(obj3D);

      // if (!isDoubleFace) {
      //   if (item.scale.x < 0) side++;
      //   if (item.scale.z < 0) side++;
      //   if (side % 2 == 1) {
      //     isDoubleFace = true;
      //     instances.forEach(element => {
      //       // console.log(element.material);
      //       element.material.side = DoubleSide;
      //       element.material.needsUpdate = true;
      //     });
      //   }
      // }
    });

  }


  Object.defineProperty(this, "root", {
    get: function () { return root },
  })
  Object.defineProperty(this, "insCount", {
    get: function () { return count },
  })
}

export { InstanceItem }