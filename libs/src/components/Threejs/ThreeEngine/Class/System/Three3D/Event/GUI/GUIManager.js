
import { ThreeObject } from '../../../../Object/ThreeObject'
import CustomStyle from './CustomStyle';
import { FolderNode } from './Node/FolderNode/FolderNode';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
class GUIManager extends ThreeObject {
  constructor(infos = GUIManager.static_Infos) {
    super();

    infos = Object.assign(GUIManager.static_Infos, infos);
    this.#alwaysHide = infos.alwaysHideGUI;
    if (!infos.alwaysHideGUI) {
      const guiDomID = infos.domID + "_GUI";
      var oldGUI = document.getElementById(guiDomID);
      if (oldGUI) {
        oldGUI.remove();
      }
      this.#gui = new GUI();
      this.#gui.domElement.id = guiDomID;

      const fd = FolderNode.createData();
      fd.isRoot = true;
      fd.key = fd.name = "Main";
      this.#mainNode = new FolderNode(fd);
      fd.key = fd.name = "System";
      this.#systemNode = new FolderNode(fd);
      fd.key = fd.name = "Setting";
      fd.isRoot = false;
      fd.style = CustomStyle.red;
      this.#settingNode = new FolderNode(fd);
    }



  }

  static static_Infos = {
    domID: "GUIManager",
    container: undefined,
    alwaysHideGUI: false,
  }

  #alwaysHide;
  #gui = undefined;
  #status = undefined;
  #systemNode;
  #mainNode;
  #settingNode;


  clearGUI() {
    if (this.#alwaysHide) return;
    const deleteArr = [];
    const deleteFolder = [];
    const gui = this.#gui;
    for (var key in gui.__controllers) {
      const con = gui.__controllers[key];
      deleteArr.push(con);
    }
    for (let key in gui.__folders) {
      const fo = gui.__folders[key];
      deleteFolder.push(fo);
    }
    for (let key in deleteArr) {
      gui.remove(deleteArr[key]);
      // console.log(gui.__controllers);
    }
    for (let key in deleteFolder) {
      gui.removeFolder(deleteFolder[key]);
      // console.log(gui.__folders);
    }
  }

  draw(isDrawSystem) {
    if (this.#alwaysHide) return;
    this.clearGUI();
    if (isDrawSystem) {
      this.#systemNode.drawGUI(this.#gui);
    }
    else {
      this.#mainNode.drawGUI(this.#gui);
    }
    this.#settingNode.drawGUI(this.#gui);

  }

  dispose() {


    super.dispose();
  }


  get system() { return this.#systemNode; }
  get main() { return this.#mainNode; }
  get setting() { return this.#settingNode; }
}

export { GUIManager }