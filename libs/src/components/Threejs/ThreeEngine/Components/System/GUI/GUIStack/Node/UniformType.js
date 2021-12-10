import { NoneType } from "./DataNode/OthreType";
import { BooleanType } from "./DataNode/ValueType/BooleanType";
import { NumberType } from "./DataNode/ValueType/NumberType";
import { StringType } from "./DataNode/ValueType/StringType";
import { DropListType } from "./DataNode/ValueType/DropListType";
import { FolderNode } from "./FolderNode";
import { FuncType } from "./DataNode/ValueType/FunctionType";
import { Vector2Type } from "./DataNode/VectorType/Vector2Type";
import { Vector3Type } from "./DataNode/VectorType/Vector3Type";
import { Vector4Type } from "./DataNode/VectorType/Vector4Type";
import { Color3Type } from "./DataNode/ColorType/Color3Type";
import { ColorRGBType } from "./DataNode/ColorType/ColorRGB";
import { Object3DType } from "./DataNode/Three/Object3DType";
import { MeshStandardMaterialType } from "./DataNode/Three/Material/MaterialType";
import { DirectionalLightType } from "./DataNode/Three/Light/DirectionalLight";
import { AmbientLightType } from "./DataNode/Three/Light/AmbientLightType";

var UniformType =  {
    "folder":FolderNode,
    "number":NumberType,
    "boolean":BooleanType,
    "string":StringType,
    "drop":DropListType,
    'function':FuncType,

    "vec2":Vector2Type,
    "vec3":Vector3Type,
    "vec4":Vector4Type,

    "color3":Color3Type,
    "colorRGB":ColorRGBType,
    "none":NoneType,

    "obj":Object3DType,

    "meshStandardMaterial":MeshStandardMaterialType,


    "directionalLight":DirectionalLightType,
    "ambientLight":AmbientLightType,
}

function getTypeofObj(uniform)
{
    if(uniform.isDrop) return "drop";
    const vt = typeof(uniform.value);
    if(vt === "number") return vt;
    if(vt === 'boolean') return vt;
    if(vt === 'string') return vt;
    if(vt === 'function')return vt;
    const obj = uniform.value;
    //颜色
    if(uniform.isColor){
        if(obj.isVector3) return 'color3';
        // if(obj.isVector4) return 'color4';
    }
    //矢量
    if(obj.isVector2) return 'vec2';
    if(obj.isVector3) return 'vec3';
    if(obj.isVector4) return 'vec4';
    if(obj.isColor) return "colorRGB";

    //3D
    if(obj.isDirectionalLight) return "directionalLight";
    if(obj.isAmbientLight) return "ambientLight";
    if(obj.isObject3D) return 'obj';

    //Material
    if(obj.isMeshStandardMaterial) return "meshStandardMaterial"


    // //摄像机
    // if(obj.isPerspectiveCamera) return 'perspectiveCameraType';
    // if(obj.isOrthographicCamera) return 'orthographicCamera';
    
    // //JS变量
    // if() return 'jsColor';

    // //材质
    // if(obj.isMeshLambertMaterial) return "meshLambertMaterial";
    // if(obj.isMeshStandardMaterial) return "meshStandardMaterial";


    // //对象
    // if(obj instanceof Array) return 'array';
    
    console.log(vt);
    console.log('未识别类型:',uniform);
    return "none";
}

export{UniformType,getTypeofObj};