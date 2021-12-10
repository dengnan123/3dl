import { BoxBufferGeometry, Group, Mesh, MeshStandardMaterial, Object3D } from "three";

var InstanceManager = function ({ animate, screenSize }, scene) {
    const itemsDic = {};
    let group;


    this.AddInstance = function (key,obj) {
        // console.log(obj);
        var item = itemsDic[key];
        if(item){
            console.log(`Instance Item ${key} 已存在`);
            return item; 
        }
        group.add(obj);
        item = new InstanceItem(obj);
        // "test",new InstanceItem(new Object3D(),scene)
    }
    const AddInstance = this.AddInstance;
    

    init();
    function init() {
        //初始化Group
        group = new Group();
        group.name = "GPU Instance";
        scene.add(group);
        // //
        // var boxGeo = new BoxBufferGeometry(1,1,1);
        // var mesh = new Mesh(boxGeo,new MeshStandardMaterial({color:0xFF0000}));
        // var box3D = new Object3D();
        // box3D.name = "box";
        // box3D.add(mesh);
        // mesh.position.set(0.5,0.5,0.5);
        // AddInstance("box",box3D);
    }

    
    
}


var InstanceItem = function (obj) {
    let _obj = obj;

    console.log(_obj);
}

export { InstanceManager };