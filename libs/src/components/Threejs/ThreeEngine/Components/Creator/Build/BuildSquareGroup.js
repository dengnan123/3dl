import { Group, Matrix4, MeshBasicMaterial, Quaternion, RepeatWrapping, TextureLoader, Vector3 } from 'three';
import { CreateBuild,buildSideType } from './BuildCreator';

function BuildSquareGroup(eventComp,three3D,xRange,yRange,step){
    const root = new Group();
    const instances = [];
    const groupThis = this;
    root['buildSqureGroup'] = this;
    const existPercent = 0.7;

    

    this.drawGUI = function(gui){
        for (let index = 0; index < instances.length; index++) {
            const folder = gui.addFolder({key:`Group${index}`});
            instances[index].build.drawGUI(folder);
        }
    }
    Object.defineProperty(this, "group", {
        get: function () { return root },
    })

    init();

    

    function init(){
        //高楼
        var buildSetting1 = {
            type:buildSideType.RECT,
            params:{widthX:30,heights:[0,100]},
            sonPos:[],
            build:undefined,
        };
        instances.push(buildSetting1);

        //中
        var buildSetting11 = {
            type:buildSideType.RECT,
            params:{widthX:30,heights:[0,60]},
            sonPos:[],
            build:undefined,
        };

        //矮
        var buildSetting12 = {
            type:buildSideType.RECT,
            params:{widthX:30,heights:[0,30]},
            sonPos:[],
            build:undefined,
        };
        instances.push(buildSetting12);
        var buildSetting2 = {
            type:buildSideType.RECT,
            params:{widthX:30,heights:[0,80,100],scales:[1,1,1.86]},
            sonPos:[],
            build:undefined
        };
        instances.push(buildSetting2);
        var buildSetting3 = {
            type:buildSideType.RECT,
            params:{widthX:30,heights:[0,80,123,150],scales:[1,1.39,1,1.72]},
            sonPos:[],
            build:undefined
        }
        instances.push(buildSetting3);

        var buildSettingCir = {
            type:buildSideType.CIRCLE,
            params:{r:15,num:10,heights:[0,80],scales:[1,1.39]},
            sonPos:[],
            build:undefined
        }
        instances.push(buildSettingCir);


        for (let x = xRange[0]; x <= xRange[1]; x+=step[0]) {
            for (let y = yRange[0]; y <= yRange[1]; y+=step[1]) {
                var random = Math.random();
                if(random>existPercent) continue;
                random = Math.min(Math.random(),0.9999) * instances.length;
                const i = Math.floor(random);
                instances[i].sonPos.push(new Vector3(x*(1+(Math.random()-0.5)*0.4),0,y*(1+(Math.random()-0.5)*0.4)));
            }
        }
        var material = new MeshBasicMaterial();
        var tex = new TextureLoader().load("Resources/Texture/build/NightBuildSide.png",(tex)=>{
            tex.wrapS = tex.wrapT = RepeatWrapping;
            material.map = tex;
            material.needsUpdate = true;
        })
        const matrix = new Matrix4();
        const scale = new Vector3(1,1,1);
        const quaternion = new Quaternion();
        for(var key in instances){
            const ins = instances[key];
            ins.build = CreateBuild(ins.type,ins.params,material,true,ins.sonPos.length);
            ins.sonPos.forEach((element,index) => {
                matrix.compose(element,quaternion,scale);
                ins.build.mesh.setMatrixAt(index,matrix);
            });
            ins.build.mesh.needsUpdate = true;
            root.add(ins.build.mesh);
        }
        // const build1 = CreateBuild(buildSideType.RECT,{widthX:30,heights:[0,100]});
        // three3D.selectionManager.setSelection(buildSquareGroup.group,buildSquareGroup);

        // three3D.selectionManager.setSelection(root,groupThis);

    }
}


export{BuildSquareGroup}