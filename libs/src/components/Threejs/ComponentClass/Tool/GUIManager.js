import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Vector2, Vector3, Vector4 } from 'three';
import { Color } from 'three';
import { stat } from 'fs';

function GUIManager(mainContainer, data, isShowStats) {
  //   var gui = new GUI();
  var gui = null;
  var width = 500;
  var stack = { sons: {}, isRoot: true };
  var valueNode = [];
  const Data = data;

  const stateID = Data.domID + '-Stats';
  const guiContainerId = Data.domID + '-GUIContainer';
  const guiId = Data.domID + '-GUIController';
  var stats = new Stats();
  stats.dom.id = stateID;
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
    //
    const guiEle = document.getElementById(guiContainerId);
    if (guiEle) {
      guiEle.remove();
    }
    gui = new GUI({ guiContainerId });
    gui.width = width;
    gui.domElement.id = guiId;
    displayFolder(stack.sons);
  };
  this.show = () => {
    gui.show();
  };
  this.hide = () => {
    gui.hide();
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
    // console.log('refresh');
    // console.log(gui);
    // console.log(valueNode);
    for (var key in valueNode) {
      if (valueNode[key].UtoP) {
        valueNode[key].UtoP();
      }
    }
    gui.updateDisplay();
  };

  function addDataToParent(key, name, order, parent) {
    key = key || name;
    var _data = { name: name || ' ', order: order || 0 };
    parent = parent || stack;
    if (parent.sons[key]) {
      var path = getParentPath(parent.sons[key]);
      throw new Error(`路径(${path})已存在`);
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
          console.log(son['element']);
        } else {
          if (!son.data.range) {
            son['element'] = folder
              .add(son.data.params, son.data.name)
              .name(son.name)
              .onChange(son.data.onChange);
          } else {
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
          }
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

  function initSettingGUI() {
    initPrint();

    function initPrint() {
      var printData = {
        uniform: { value: buttonPrint },
        infos: [{ displayName: '打印', order: 0 }],
      };
      addValue(printData, settingFolder);

      function buttonPrint() {
        console.log(stack);

        // const jsonString = JSON.stringify(stack,null,2)
        // console.log(jsonString);
      }
    }
  }

  var ValueNode = function (data, parent) {
    if (!data) {
      throw new Error('data为空');
    }
    this.uniform = data.uniform || {};
    this.params = {};
    this.onValueChangeFunc = data.func || [];

    var uniform = this.uniform;
    var params = this.params;
    var onValueChangeFunc = this.onValueChangeFunc;
    var UtoP;
    var PtoU;
    var infos = data.infos;
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
        UtoP = () => { };
        PtoU = () => { };
        _data['data'] = { params: uniform, name: 'value', onChange: onValueChange };
        return;
      }
      function initNumber() {
        checkInfo(1);
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
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
          UtoP = (uniform, params) => { };
          PtoU = (uniform, params) => { };
          dd = { params: uniform, name: 'value', onChange: onValueChange };
          checkSlider(dd, info);
        }
        _data['data'] = dd;
        return;
      }
      function initFunction() {
        checkInfo(1);
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);
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
          console.log(uniform);
          var col = params['col'];
          col.setHex(params['hex']);
          uniform.value.x = col.r;
          uniform.value.y = col.g;
          uniform.value.z = col.b;
        };
        UtoP();
        var info = data.infos[0];
        var _data = addDataToParent(info.name, info.displayName, info.order, parent);

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
        var dd;
        dd = { params: params, name: name, onChange: onVectorChange };
        if (!info.isBoolean) {
          checkSlider(dd, info);
        }
        _data['data'] = dd;
        return _data;
      }
      return;

      // if (data.isColor && (value.isVector3 || value.isVector4)) {

      // }

      // if (value.isVector3) {
      //   checkInfo(3);

      //   params['x'] = value.x;
      //   params['y'] = value.y;
      //   params['z'] = value.y;
      //   paramToUniform = function () {
      //     uniform.value.x = params['x'] + 0;
      //     uniform.value.y = params['y'] + 0;
      //     uniform.value.z = params['z'] + 0;
      //   };
      //   addVectorValueToGUI('x', data.infos[0], onValueChange);
      //   addVectorValueToGUI('y', data.infos[1], onValueChange);
      //   addVectorValueToGUI('z', data.infos[2], onValueChange);
      //   return;
      // }
      // if (value.isVector4) {
      //   checkInfo(4);

      //   params['x'] = value.x;
      //   params['y'] = value.y;
      //   params['z'] = value.z;
      //   params['w'] = value.w;
      //   paramToUniform = function () {
      //     uniform.value.x = params['x'] + 0;
      //     uniform.value.y = params['y'] + 0;
      //     uniform.value.z = params['z'] + 0;
      //     uniform.value.w = params['w'] + 0;
      //   };
      //   addVectorValueToGUI('x', data.infos[0], onValueChange);
      //   addVectorValueToGUI('y', data.infos[1], onValueChange);
      //   addVectorValueToGUI('z', data.infos[2], onValueChange);
      //   addVectorValueToGUI('w', data.infos[3], onValueChange);
      //   return;
      // }
      // console.log(value);
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
  var settingFolder = this.settingFolder;
  initSettingGUI();
}

export { GUIManager };
