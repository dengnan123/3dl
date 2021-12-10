var StringTake = {
    takeGLTFNodeName:(name)=>{
        const start_ = name.indexOf('_');
        const end_ = name.lastIndexOf('_');
        return name.substring(start_+1,end_);
    },
    removeClone:(name)=>{
        const end_ = name.indexOf("(Clone)");
        return name.substring(0,end_);
    },
    removeNameClone:(obj)=>{
        const name = obj.name;
        const end_ = name.indexOf("(Clone)");
        if(end_===-1)return;
        obj.name = name.substring(0,end_);
    }
}
export {StringTake};