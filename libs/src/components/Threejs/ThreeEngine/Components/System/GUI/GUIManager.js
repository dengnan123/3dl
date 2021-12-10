import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { DebugTool } from '../../../Tool/DebugTool';
import CustomStyle from './GUIStack/Node/CustomStyle';
import { FolderNode } from "./GUIStack/Node/FolderNode";

function GUIManager(eventComp, infos, isForceClose) {
    let gui;
    let mainNode;
    let settingNode;
    let systemNode;
    this.isDrawSystem = true;
    let isUpdatePerFrame = { value: false };
    init();
    function init() {
        if (!isForceClose) {
            const guiDomID = infos.domID + "_GUI";
            var oldGUI = document.getElementById(guiDomID);
            if (oldGUI) {
                oldGUI.remove();
            }
            gui = new GUI();
            gui.domElement.id = guiDomID;
        }
        systemNode = new FolderNode({ key: "System", isNotDrawFolder: true });
        mainNode = new FolderNode({ key: "Root", isNotDrawFolder: true });
        settingNode = new FolderNode({ key: "Setting", name: "设置", isOpen: "true", style: CustomStyle.red });




        settingNode.addValue({
            uniform: {
                value: () => {
                    DebugTool.pasteToClipboard(mainNode.getData());
                }
            }, key: "打印", order: 99999
        });
        settingNode.addValue({
            uniform: {
                value: () => {
                    DebugTool.pasteToClipboard(systemNode.getData());
                }
            }, key: "打印(系统)", order: 99999
        });
        settingNode.addValue({ uniform: isUpdatePerFrame, key: "每帧更新", order: 99998 });


        eventComp.animate.addListener("GUIManager", animate);
        function animate() {
            if (isUpdatePerFrame.value) {
                mainNode.updateGUI();
                return true;
                // console.log("Update GUI")
            }
        }

    }
    this.addValue = function (data) {
        return mainNode.addValue(data);
    }
    this.addFolder = function (data) {
        return mainNode.addFolder(data);
    }
    this.addSettingValue = function (data) {
        return settingNode.addValue(data);
    }
    this.addSettingFolder = function (data) {
        return settingNode.addFolder(data);
    }
    this.addSystemValue = function (data) {
        return systemNode.addValue(data);
    }
    this.addSystemFolder = function (data) {
        return systemNode.addFolder(data);
    }
    this.clear = function () {
    }
    this.clearMain = function () {
        mainNode.Clear();
        this.clearGUI();
    }
    this.clearGUI = function () {
        if (isForceClose) return;
        const deleteArr = [];
        const deleteFolder = [];
        for (var key in gui.__controllers) {
            const con = gui.__controllers[key];
            deleteArr.push(con);
        }
        for (var key in gui.__folders) {
            const fo = gui.__folders[key];
            deleteFolder.push(fo);
        }
        for (var key in deleteArr) {
            gui.remove(deleteArr[key]);
            // console.log(gui.__controllers);
        }
        for (var key in deleteFolder) {
            gui.removeFolder(deleteFolder[key]);
            // console.log(gui.__folders);
        }
    }

    this.draw = function (data) {
        if (isForceClose) return;
        this.clearGUI();
        if (this.isDrawSystem) {
            systemNode.drawGUI(gui);
        }
        else {
            mainNode.drawGUI(gui);
        }
        settingNode.drawGUI(gui);

    }
    this.SetActive = function (active) {
        if (isForceClose) return;

    }
    this.setSystemData = function (data) {
        systemNode.setData(data);
    }

}


export { GUIManager }