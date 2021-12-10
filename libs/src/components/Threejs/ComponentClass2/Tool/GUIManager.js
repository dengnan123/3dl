import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Vector2, Vector3, Vector4, Color } from 'three';

function GUIManager(mainContainer, data, isShowStats) {
  //   var gui = new GUI();
  var gui = null;
  var width = 450;
  //   gui.width = width;
  var stack = { sons: {}, isRoot: true };
  var valueNode = [];
  const Data = data;

  const stateID = Data.domID + '-Stats';
  var stats = new Stats();
  stats.dom.id = stateID;
  var isShowGUI = false;
  var isShowStats = false;

  //添加Folder
  this.addFolder = function (data) {
    var key = data.key || data.folderName;
    key = 'fold_' + key;
    var _data = addDataToParent(key, data.folderName, data.order, data.parent);
    _data['sons'] = {};
    _data['isOpen'] = data.isOpen;
    _data['isHide'] = data.isHide;
    return _data;
  };
  var addFolder = this.addFolder;

  this.addValue = function (data, parent) {
    var node = new ValueNode(data, parent);
    if (node) {
      valueNode.push(node);
    }
    return node;
  };
  var addValue = this.addValue;

  this.display = function () {
    // gui.destroy();
    if (document.getElementById('guiController')) {
      document.getElementById('guiController').remove();
    }
    gui = new GUI();
    gui.domElement.id = 'guiController';
    gui.width = width;
    displayFolder(stack.sons);
    if (!isShowGUI) {
      gui.hide();
    }
  };

  this.show = () => {
    isShowGUI = true;
    if (gui) {
      gui.show();
    }
  };

  this.hide = () => {
    isShowGUI = false;
    if (gui) {
      gui.hide();
    }
  };

  this.showStats = () => {
    var std = document.getElementById(stateID);
    if (std) {
      std.remove();
    }
    mainContainer.appendChild(stats.dom);
    isShowStats = true;
  };
  this.hideStats = () => {
    var std = document.getElementById(stateID);
    if (std) {
      std.remove();
    }
    isShowStats = false;
  };

  this.Animation = function () {
    if (isShowStats) stats.update();
  };

  this.printGUI = function () {
    console.log(stack);
  };

  this.refreshGUI = function () {
    if (!gui) return;
    for (var key in valueNode) {
      if (valueNode[key].UtoP) {
        valueNode[key].UtoP();
      }
    }
    gui.updateDisplay();
  };

  this.clearGUI = function () {
    stack.sons = {};
    valueNode = [];
    this.settingFolder = addFolder({ folderName: '设置', order: 9999, parent: null, isOpen: true });
  };

  function addDataToParent(key, name, order, parent) {
    key = key || name;
    var _data = { name: name || ' ', order: order || 0 };
    parent = parent || stack;
    if (parent.sons[key]) {
      return parent.sons[key];
    }
    _data['index'] = Object.keys(parent).length;
    _data['parent'] = parent;
    parent.sons[key] = _data;
    return _data;
  }

  function displayFolder(sons, folder) {
    folder = folder || gui;
    var res = Object.keys(sons).sort(function (a, b) {
      var oa = sons[a].order;
      var ob = sons[b].order;
      if (oa != ob) {
        return oa - ob;
      }
      return sons[a].index - sons[b].index;
    });
    for (var key in res) {
      var son = sons[res[key]];

      //如果是折叠夹
      if (son.sons) {
        var f = folder.addFolder(son.name);
        son['folder'] = f;
        f.closed = !son.isOpen;
        if (son.isHide) {
          f.hide();
        }
        displayFolder(son.sons, f);
      } else {
        if (son.data.isColor) {
          son['element'] = folder
            .addColor(son.data.params, son.data.name)
            .name(son.name)
            .onChange(son.data.onChange);
        } else {
          if (son.data.range) {
            son['element'] = folder
              .add(
                son.data.params,
                son.data.name,
                son.data.range.min,
                son.data.range.max,
                son.data.range.delta,
              )
              .name(son.name)
              .onChange(son.data.onChange);
            continue;
          }
          if (son.data.isDrop) {
            son['element'] = folder
              .add(son.data.params, son.data.name, son.data.dropList)
              .name(son.name)
              .onChange(son.data.onChange);
            continue;
          }
          son['element'] = folder
            .add(son.data.params, son.data.name)
            .name(son.name)
            .onChange(son.data.onChange);
        }
      }
    }
  }

  function getParentPath(node) {
    if (!node.name) {
      return undefined;
    }
    var name = node.name;
    var _node = node.parent;
    if (!_node) {
      return name;
    }
    while (_node.name) {
      name = _node.name + '/' + name;
      _node = _node.parent;
    }
    return name;
  }
  var ValueNode = function (data, parent) {
    if (!data) {
      throw new Error('data为空');
    }
    this.uniform = data.uniform || {};
    this.params = {};
    this.onValueChangeFunc = data.func || [];
    this.onValueFinishChange = data.finish || [];
    this.sonGUIDatas = [];
    var uniform = this.uniform;
    var params = this.params;
    var onValueChangeFunc = this.onValueChangeFunc;
    var UtoP;
    var PtoU;
    var infos = data.infos;
    var sonGUIDatas = this.sonGUIDatas;
    initValue();
    this.UtoP = UtoP;

    function initValue() {
      var value = uniform.value;
      if (value == undefined) {
        throw new Error('值为空');
      }
      var vt = typeof value;

      if (vt == 'boolean') {
        initBoolean();
        return;
      }
      if (vt == 'number') {
        initNumber();
        return;
      }
      if (vt == 'function') {
        initFunction();
        return;
      }
      if (vt == 'string') {
        initString();
        return;
      }
      if (data.isColor && value.isVector3) {
        initColor3();
        return;
      }
      if (data.isColor && value.isVector4) {
        // initColor3();
        return;
      }
      if (value.isVector2) {
        initVector2();
        return;
      }
      if (value.isVector3) {
        initVector3();
        return;
      }
      if (value.isVector4) {
        initVector4();
        return;
      }
      function initBoolean() {
        checkInfo(1);
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);
        UtoP = () => { };
        PtoU = () => { };
        _data['data'] = { params: uniform, name: 'value', onChange: onValueChange };
        return;
      }
      function initNumber() {
        checkInfo(1);
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);
        var dd;

        if (info.isBoolean) {
          UtoP = (uniform, params) => {
            params['value'] = uniform.value != 0;
          };
          PtoU = (uniform, params) => {
            uniform.value = params.value + 0;
          };
          UtoP(uniform, params);
          dd = {
            params: params,
            name: 'value',
            onChange: () => {
              onValueChange();
            },
          };
        } else {
          if (info.isDrop) {
            UtoP = (uniform, params) => { };
            PtoU = (uniform, params) => { };
            dd = {
              params: uniform,
              name: 'value',
              isDrop: true,
              dropList: info.dropList,
              onChange: onValueChange,
            };
            checkSlider(dd, info);
          } else {
            UtoP = (uniform, params) => { };
            PtoU = (uniform, params) => { };
            dd = { params: uniform, name: 'value', onChange: onValueChange };
            checkSlider(dd, info);
          }
        }
        _data['data'] = dd;
        return;
      }
      function initString() {
        checkInfo(1);
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);
        var dd;

        if (info.isDrop) {
          UtoP = (uniform, params) => { };
          PtoU = (uniform, params) => { };
          dd = {
            params: uniform,
            name: 'value',
            isDrop: true,
            dropList: info.dropList,
            onChange: onValueChange,
          };
          checkSlider(dd, info);
        } else {
          throw 'initString 不是Drop';
        }

        _data['data'] = dd;
        return;
      }

      function initFunction() {
        checkInfo(1);
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);
        var dd = { params: uniform, name: 'value' };
        _data['data'] = dd;
        return;
      }
      function initColor3() {
        checkInfo(1);
        UtoP = () => {
          var value = uniform.value;
          params['col'] = new Color(value.x, value.y, value.z);
          params['hex'] = params['col'].getHex();
        };
        PtoU = () => {
          var col = params['col'];
          col.setHex(params['hex']);
          uniform.value.x = col.r;
          uniform.value.y = col.g;
          uniform.value.z = col.b;
        };
        UtoP();
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);

        var dd = { isColor: true, params: params, name: 'hex', onChange: onValueChange };
        _data['data'] = dd;

        return;
      }
      function initColor4() {
        checkInfo(2);
        UtoP = () => {
          var value = uniform.value;
          params['col'] = new Color(value.x, value.y, value.z);
          params['hex'] = params['col'].getHex();
          params['alpha'] = value.w;
        };
        PtoU = () => {
          var col = params['col'];
          col.setHex(params['hex']);
          uniform.value.x = col.r;
          uniform.value.y = col.g;
          uniform.value.z = col.b;
          uniform.value.w = params['alpha'];
        };
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);

        var dd = { isColor: true, params: params, name: 'hex', onChange: onValueChange };
        _data['data'] = dd;
        if (data.infos.length == 2)
          if (!data.infos[1].isPass) {
            addVectorValueToGUI('alpha', data.infos[1], onValueChange);
          }

        return;
      }
      function initVector2() {
        checkInfo(2);
        params['x'] = value.x;
        params['y'] = value.y;
        PtoU = function () {
          uniform.value.x = params['x'] + 0;
          uniform.value.y = params['y'] + 0;
        };
        UtoP = function () {
          setParamsValue('x', infos[0]);
          setParamsValue('y', infos[1]);
        };

        UtoP();
        addVectorValueToGUI('x', data.infos[0], onValueChange);
        addVectorValueToGUI('y', data.infos[1], onValueChange);
        return;
      }
      function initVector3() {
        checkInfo(3);
        params['x'] = value.x;
        params['y'] = value.y;
        params['z'] = value.z;
        PtoU = function () {
          uniform.value.x = params['x'] + 0;
          uniform.value.y = params['y'] + 0;
          uniform.value.z = params['z'] + 0;
        };
        UtoP = function () {
          setParamsValue('x', infos[0]);
          setParamsValue('y', infos[1]);
          setParamsValue('z', infos[2]);
        };

        UtoP();
        addVectorValueToGUI('x', data.infos[0], onValueChange);
        addVectorValueToGUI('y', data.infos[1], onValueChange);
        addVectorValueToGUI('z', data.infos[2], onValueChange);
        return;
      }
      function initVector4() {
        checkInfo(4);
        params['x'] = value.x;
        params['y'] = value.y;
        params['z'] = value.z;
        params['w'] = value.w;
        PtoU = function () {
          uniform.value.x = params['x'] + 0;
          uniform.value.y = params['y'] + 0;
          uniform.value.z = params['z'] + 0;
          uniform.value.w = params['w'] + 0;
        };
        UtoP = function () {
          setParamsValue('x', infos[0]);
          setParamsValue('y', infos[1]);
          setParamsValue('z', infos[2]);
          setParamsValue('w', infos[3]);
        };

        UtoP();
        addVectorValueToGUI('x', data.infos[0], onValueChange);
        addVectorValueToGUI('y', data.infos[1], onValueChange);
        addVectorValueToGUI('z', data.infos[2], onValueChange);
        addVectorValueToGUI('w', data.infos[3], onValueChange);
        return;
      }
      function setParamsValue(name, info) {
        if (info.isPass) return;
        if (info.isBoolean) {
          params[name] = uniform.value[name] != 0;
        } else {
          params[name] = uniform.value[name];
        }
      }
      function addVectorValueToGUI(name, info, onVectorChange) {
        if (info.isPass) {
          return null;
        }
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
        sonGUIDatas.push(_data);
        var dd;
        dd = { params: params, name: name, onChange: onVectorChange };
        if (!info.isBoolean) {
          checkSlider(dd, info);
        }
        _data['data'] = dd;
        return _data;
      }
      return;
    }
    function checkInfo(len) {
      var infos = data.infos;
      if (!infos) {
        throw new Error('infos为空');
      }
      if (len > infos.length) {
        throw new Error(`infos的数量不够(至少需要)`);
      }
      for (var key in infos) {
        if (!infos[key].isPass) {
          if (!infos[key].displayName) {
            throw new Error('缺少displayName');
          }
        }
      }
    }
    function checkSlider(data, info) {
      if (!info.isSlider) {
        return;
      }
      var range = { min: info.min || 0, max: info.max || 1, delta: info.delta || 0.01 };
      data['range'] = range;
    }

    function onValueChange() {
      PtoU();
      for (var key in onValueChangeFunc) {
        onValueChangeFunc[key](uniform.value, params);
      }
    }
  };

  this.settingFolder = addFolder({ folderName: '设置', order: 9999, parent: null, isOpen: true });
}

export { GUIManager };
