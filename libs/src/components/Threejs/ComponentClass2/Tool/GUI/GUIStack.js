import { GUINode } from './GUINode';
function GUIStack() {
  const stack = { sons: {} };
  this.addFolder = function(data, folder) {
    data['key'] = data['key'] || data['displayName'];
    const _data = addDataToParent(data, folder);
    _data['sons'] = {};
    data['type'] = 'folder';
    _data['guiNode'] = new GUINode(data);
    _data['isFolder'] = true;
    return _data;
  };
  this.addValue = function(data, folder) {
    const _data = addDataToParent(data, folder);
    _data['guiNode'] = new GUINode(data);
    _data['updateGUI'] = function() {
      this.guiNode.updateGUI();
    };
    _data['isNeedHead'] = data['isNeedHead'] || false;
    return _data;
  };

  this.clear = function clear(type, levels) {
    stack.sons = {};
  };

  this.drawGUI = function(gui) {
    drawFolder(gui, stack.sons);
  };

  function drawFolder(folder, sons) {
    var res = Object.keys(sons).sort(function(a, b) {
      var oa = sons[a].order;
      var ob = sons[b].order;
      if (oa != ob) {
        return oa - ob;
      }
      return sons[a].index - sons[b].index;
    });

    res.forEach(element => {
      const son = sons[element];
      if (son['isFolder']) {
        const sonFolder = son.guiNode.drawGUI(folder);
        son['guiItem'] = sonFolder;
        drawFolder(sonFolder, son.sons);
      } else {
        const item = son.guiNode.drawGUI(folder);
        son['guiItem'] = item;
      }
    });
  }
  function addDataToParent(data, folder) {
    folder = folder || stack;
    // console.log(data);
    const _data = {};
    const info = data.info || {};
    // console.log(data.key);
    const key = data['key'] || info.displayName;
    if (key == undefined) throw 'key为空';
    _data['key'] = key;
    _data['order'] = data['order'] || 0;
    _data['folder'] = folder;
    if (folder.sons[key]) {
      console.log(getPathOfNode(folder.sons[key]) + '路径已存在');
      return folder.sons[key];
      // throw '路径存在';
    }
    _data['index'] = Object.keys(folder.sons).length;
    folder.sons[key] = _data;
    return _data;
  }
}
function getPathOfNode(node) {
  if (node['folder'].folder !== undefined) {
    return getPathOfNode(node['folder']) + '/' + node['key'];
  } else {
    return node['key'];
  }
}

export { GUIStack };
