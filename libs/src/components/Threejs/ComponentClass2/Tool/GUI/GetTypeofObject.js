import {noneType,numberType,booleanType,stringType,dropList} from './GUINode/Type/ValueType';
import {folderType,funcType} from './GUINode/Type/OtherType';
import { object3DType,perspectiveCameraType } from './GUINode/Type/ObjectType';
import {arrayType} from './GUINode/Type/ArrayType';
import { Vector2Type,Vector3Type,Vector4Type,Color3Type,Color4Type } from './GUINode/Type/VectorType';


function getTypeofObj(obj)
{
    const vt = typeof(obj);
    if(vt === "number") return vt;
    if(vt === 'boolean') return vt;
    if(vt === 'string') return vt;
    if(vt === 'function')return vt;

    if(obj.isVector2) return 'vec2';
    if(obj.isVector3) return 'vec3';
    if(obj.isVector4) return 'vec4';
    if(obj.isPerspectiveCamera) return 'perspectiveCameraType';
    if(obj.isObject3D) return 'obj';
    if(obj instanceof Array) return 'array';
    
    console.log(vt);
    console.log('未识别类型:',obj);
    return null;
}

const typeDic = 
{
    'none':noneType,

    'isFolder':folderType,
    'folder':folderType,

    'function':funcType,
    'func':funcType,

    'number':numberType,
    'num':numberType,
    'float':numberType,

    'boolean':booleanType,
    'bool':booleanType,

    'string':stringType,
    
    'drop':dropList,
    'dropList':dropList,

    'vec2':Vector2Type,
    'vector2':Vector2Type,
    'Vector2':Vector2Type,

    'vec3':Vector3Type,
    'vector3':Vector3Type,
    'Vector3':Vector3Type,

    'vec4':Vector4Type,
    'vector4':Vector4Type,
    'Vector4':Vector4Type,

    'color':Color3Type,
    'color3':Color3Type,
    'color4':Color4Type,

    'object':object3DType,
    'obj':object3DType,
    
    'array':arrayType,
    'perspectiveCameraType':perspectiveCameraType,
}

export {getTypeofObj,typeDic};