import { BufferGeometry, Float32BufferAttribute, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Mesh, MeshBasicMaterial, MeshStandardMaterial, RepeatWrapping, TextureLoader } from "three";

var buildSideType = {
    RECT: 0,
    CIRCLE: 1,
    PATH:3,
}
const uvHeightLength = 100;
var CreateBuild = function (type, params, material, isInstance=false,instanceCount = 0) {
    const path = getSidePath(type, params);
    const meshData = createMeshData(path, params);
    const geometry = new BufferGeometry();
    geometry.setIndex(meshData.index);
    geometry.setAttribute('position', meshData.vertex);
    geometry.setAttribute('uv', meshData.uv);
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.computeBoundingBox();
    if (!material) {
        material = new MeshBasicMaterial();
        var tex = new TextureLoader().load("Resources/Texture/build/NightBuildSide.png",(tex)=>{
            tex.wrapS = tex.wrapT = RepeatWrapping;
            material.map = tex;
            material.needsUpdate = true;
        })
    }
    let mesh;
    if (isInstance) {
        mesh = new InstancedMesh(geometry, material,instanceCount);
    }
    else {
        mesh = new Mesh(geometry, material);
    }
    return {
        path,
        meshData,
        mesh,
        geometry,
        dispose: function () {

        },
        drawGUI:function(gui){
            const scalesFolder = gui.addFolder({key:"Scales"});
            const heightFolder = gui.addFolder({key:"heights"})
            const scales = this.meshData.scales;
            const heights = this.meshData.heights;
            const meshData = this.meshData;
            const geometry = this.geometry;
            for(var key in scales){
                scalesFolder.addValue({
                    uniform:{value:scales[key]},
                    storeP:{index:key},
                    key:`第${key}个`,
                    info:{isSlider:true,min:0.01,max:3},
                    onChange:function(val){
                        const index = this.storeP.index;
                        const oldVal = scales[index];
                        scales[index] = val;
                        const vertex = meshData.vertex;
                        
                        const start = index*meshData.pathPointCount;
                        const len = meshData.pathPointCount;
                        for (let i = 0; i < len; i++) {
                            const pos = start+i;
                            vertex.setX(pos,vertex.getX(pos)/oldVal*val);
                            vertex.setZ(pos,vertex.getZ(pos)/oldVal*val);
                        }
                        geometry.attributes.position.needsUpdate = true;   
                    },
                    onFinish:function(){
                        geometry.computeVertexNormals();
                        geometry.computeTangents();
                        geometry.computeBoundingBox();
                    }
                })
            }
            console.log(heights)
            for(var key in heights){
                heightFolder.addValue({
                    uniform:{value:heights[key]},
                    storeP:{index:key},
                    key:`第${key}个`,
                    info:{isSlider:true,min:0,max:1000},
                    onChange:function(val){
                        const index = this.storeP.index;
                        const oldVal = heights[index];
                        heights[index] = val;
                        const vertex = meshData.vertex;
                        const uv = meshData.uv;
                        
                        const start = index*meshData.pathPointCount;
                        const len = meshData.pathPointCount;
                        for (let i = 0; i < len; i++) {
                            const pos = start+i;
                            vertex.setY(pos,val);
                            uv.setY(pos,val/uvHeightLength);
                        }
                        geometry.attributes.position.needsUpdate = true;   
                        geometry.attributes.uv.needsUpdate = true;
                    },
                    onFinish:function(){
                        geometry.computeVertexNormals();
                        geometry.computeTangents();
                        geometry.computeBoundingBox();
                        console.log(geometry.attributes);
                    }
                })
            }
        },
        getJSON:function(){

        },
        onScalesChange:function(index){

        }
    }

}

var getSidePath = function (type, params) {
    switch (type) {
        case buildSideType.RECT:
            return createRect(params);
        case buildSideType.CIRCLE:
            return createCircle(params);
        case buildSideType.PATH:
            return params.path; 
        default:
            break;
    }


    function createRect(params) {
        const widthX = params.widthX;
        const widthZ = params.widthZ || widthX;;
        const path = [];
        //左上
        path.push(-widthX / 2, widthZ / 2);
        //右上
        path.push(widthX / 2, widthZ / 2);
        //右下
        path.push(widthX / 2, -widthZ / 2);
        //左下
        path.push(-widthX / 2, -widthZ / 2);
        //左上
        path.push(-widthX / 2, widthZ / 2);

        return path;
    }

    function createCircle(params) {
        const { num, r } = params;
        const path = [];
        const anglePer = Math.PI*2/num;
        for (let index = 0; index <= num; index++) {
            let angle = anglePer * index;
            path.push(Math.cos(angle)*r,-Math.sin(angle)*r);
        }
        return path;
    }

}


var createMeshData = function (path, params) {
    const c11 = path[0];
    const c12 = path[1];
    const cn1 = path[path.length-2];
    const cn2 = path[path.length-1];
    if(Math.abs(c11-cn1)>0.000001||Math.abs(c12-cn2)>0.000001){
        console.log("输入Path未封闭");
        path.push(c11,c12);
    }

    let heights = params.heights;
    let scales = params.scales;
    if (!scales) {
        scales = Array(heights.length).fill(1);
    }
    const vertex = [];
    const index = [];
    const uv = [];
    const vertexCount = heights.length * path.length / 2;
    const pathLen = path.length / 2;
    const hLen = heights.length;
    //vertices
    for (let hIndex = 0; hIndex < hLen; hIndex++) {
        const h = heights[hIndex];

        for (let pIndex = 0; pIndex < pathLen; pIndex++) {
            vertex.push(path[pIndex * 2] * scales[hIndex], h, path[pIndex * 2 + 1] * scales[hIndex]);
            uv.push(pIndex/(pathLen),h/uvHeightLength);
        }
    }
    //bottom
    let hIndex = 0;
    for (let pIndex = 0; pIndex < pathLen-1; pIndex++) {
        vertex.push(path[pIndex * 2] * scales[hIndex], heights[hIndex], path[pIndex * 2 + 1] * scales[hIndex]);
        uv.push(pIndex/(pathLen),0);
    }
    //top
    hIndex = hLen-1;
    for (let pIndex = 0; pIndex < pathLen-1; pIndex++) {
        vertex.push(path[pIndex * 2] * scales[hIndex], heights[hIndex], path[pIndex * 2 + 1] * scales[hIndex]);
        uv.push(pIndex/(pathLen),0);
    }
    //triangles
    for (let pi = 1; pi <= pathLen; pi++) {
        let lastP = pi - 1;
        let thisP = pi;
        for (let hi = 1; hi < hLen; hi++) {
            //left up
            const p11 = hi * pathLen + lastP;
            const p12 = hi * pathLen + thisP;
            const p21 = (hi - 1) * pathLen + lastP;
            const p22 = (hi - 1) * pathLen + thisP;

            // index.push(p11,p12,p22);
            // index.push(p11,p22,p21);
            index.push(p22, p12, p11);
            index.push(p21, p22, p11);
        }

    }
    //button
    const buttonIndex = [];
    let c = (hLen)*pathLen;
    let f = c+1;
    let b = c+pathLen-2;
    let isForward = true;
    while(b!=f){
        buttonIndex.push(b,c,f);
        if(isForward){
            c= f++;
            isForward = !isForward;
        }
        else{
            c = b--;
            isForward = !isForward;
        }
    }

    //top
    const topIndex = [];
    c = (hLen+1)*pathLen-1;
    f = c+1;
    b = c+pathLen-2;
    isForward = true;
    while(b!=f){
        topIndex.push(b,c,f);
        if(isForward){
            c= f++;
            isForward = !isForward;
        }
        else{
            c = b--;
            isForward = !isForward;
        }
    }
    index.push(...buttonIndex.reverse(),...topIndex);
    // console.log("vertexCount", vertex.length / 3);
    // console.log("faceCount", index.length / 3);
    // console.log(vertex);
    // console.log(index);
    return {
        vertex: new Float32BufferAttribute(vertex, 3),
        index,
        uv: new Float32BufferAttribute(uv, 2),
        vertexCount,
        heights,
        scales,
        
        pathPointCount: pathLen,
        heightFloorCount: hLen,
    }

}


export { CreateBuild, buildSideType }