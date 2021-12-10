import { Group, InstancedMesh } from "three";

var Three3DTool = {
    alignTo: function (obj, alignTo) {
        if (!alignTo.parent) return;
        alignTo.add(obj);
        this.clearTransform(obj);
        alignTo.parent.attach(obj);
        obj.updateMatrix();
    },
    clearTransform: function (obj) {
        obj.position.set(0, 0, 0);
        obj.rotation.set(0, 0, 0);
        obj.scale.set(1, 1, 1);
        obj.updateMatrix();
    },

    clearObject3D: function (obj) {
        const objs = [];
        obj.children.forEach(element => {
            element.traverse((object) => {
                objs.push(object);
            })
        });

        for (var key in objs) {
            // objs[key].removeFromParent();
            objs[key].parent.remove(objs[key]);
        }
    },
    getObject3DChildrenTree: function (obj, tree, func) {
        if (obj.children && obj.children instanceof Array) {
            const node = {
                info: undefined,
                sons: []
            }
            if (func(obj, node)) {
                return;
            }
            tree.push(node);
            obj.children.forEach(element => {
                this.getObject3DChildrenTree(element, node.sons, func);
            });
            return node;
        }
    },
    getObject3DInChildren: function (obj, func) {
        if (obj.children && obj.children instanceof Array) {
            if (func(obj)) {
                return;
            }
            obj.children.forEach(element => {
                this.getObject3DInChildren(element, func);
            });
        }
    },
    getObject3DChildrenNameTree: function (obj) {

        const tree = [];
        var func = (son, node) => {
            node.info = son.name;
            return false;
        }
        const data = this.getObject3DChildrenTree(obj, tree, func);
        return data;
    },
    getObjectsWithType: function (obj, typeName) {
        const array = [];
        var func = (son) => {
            if (son[typeName]) {
                array.push(son);
                return true;
            }
        }
        this.getObject3DInChildren(obj, func);
        return array;
    },

    replaceMeshWithInstanceMesh: function (obj, count, parent) {
        //创建新的Group
        const group = new Group();
        group.name = obj.name;
        //将新的group Align到对象
        obj.add(group);
        obj.parent.attach(group);

        const meshes = this.getObjectsWithType(obj, "isMesh");
        meshes.forEach(element => {
            const newMeshIns = new InstancedMesh(element.geometry, element.material, count);
            element.add(newMeshIns);
            parent.attach(newMeshIns);
            newMeshIns.name = element.name;
        });
        return group;

    },
}

export { Three3DTool }