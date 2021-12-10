import { folderType } from "./DataNode/OthreType";
import { UniformNode } from "./UniformNode";

function FolderNode(data) {
    const key = data.key;
    const order = data.order || 0;
    const node = new folderType(data);
    const index = data.index || 0;
    const isNotDrawFolder = data.isNotDrawFolder || false;
    const style = data.style;
    let sons = {};

    this.addValue = function (data) {
        if (!data.key) {
            console.log("key不存在", data);
        }
        if (sons[data.key]) {
            console.log("key已存在", data);
        }
        data['index'] = Object.keys(sons).length;
        var sonNode = new UniformNode(data);
        sons[sonNode.key] = sonNode;
        return sonNode;
    }
    this.addFolder = function (data) {
        if (!data.key) {
            console.log("key不存在", data);
        }
        if (sons[data.key]) {
            // console.log("key已存在",data);
            return sons[data.key];
        }
        data['index'] = Object.keys(sons).length;
        var sonNode = new FolderNode(data);
        sons[sonNode.key] = sonNode;
        return sonNode;
    }
    this.drawGUI = function (folder, parentStyle) {
        if (!isNotDrawFolder) {
            folder = node.drawGUI(folder, parentStyle);
        }
        var res = Object.keys(sons).sort(function (a, b) {
            var oa = sons[a].order;
            var ob = sons[b].order;
            if (oa !== ob) {
                return oa - ob;
            }
            return sons[a].index - sons[b].index;
        });
        res.forEach(element => {
            var son = sons[element];
            son.drawGUI(folder, style || parentStyle);
        })

    }
    this.getData = function () {
        const data = {};
        for (var key in sons) {
            const sonNode = sons[key];
            data[key] = sonNode.getData();
        }

        return data;
    }
    this.setData = function (data) {
        for (var key in data) {
            if (sons[key]) {
                sons[key].setData(data[key]);
            }
        }
    }
    this.updateGUI = function () {
        for (var key in sons) {
            sons[key].updateGUI();
        }
    }
    this.Clear = function () {
        sons = {};

    }

    this.dispose = function () {

    }
    Object.defineProperty(this, "key", {
        get: function () { return key },
    })
    Object.defineProperty(this, "order", {
        get: function () { return order },
    })
    Object.defineProperty(this, "index", {
        get: function () { return index },
    })
    Object.defineProperty(this, "isFolder", {
        get: function () { return true },
    })

}

export { FolderNode }