
import { getTypeofObj, typeDic } from './GetTypeofObject';
import { gui } from 'three/examples/jsm/libs/dat.gui.module';




function GUINode(data) {
    const dataType = data.type || getTypeofObj(data.uniform.value) || 'none';
    const guiData = new typeDic[dataType](data);
    data['node'] = guiData;
    this.guiData = guiData;
    if (dataType === 'none') {
        console.log('对应类型不存在');
    }
    this.drawGUI = (folder) => {

        return guiData.drawGUI(folder);
    }
    this.updateGUI = () => {
        guiData.updateGUI();
    }
}




export { GUINode };