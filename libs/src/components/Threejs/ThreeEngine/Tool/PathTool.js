var PathTool = {
    getFileName:function(path){
        return path.substring(path.lastIndexOf("/")+1);
    },
    getFileNameWithoutExt:function(path){
        let fileName = this.getFileName(path);
        if(fileName.includes(".")){
            fileName = fileName.substring(0,fileName.indexOf('.'));
        }
        return fileName;
    },
    getParentFolderName:function(path){
        return path.substring(0,path.lastIndexOf('/'));
    }
}


export{PathTool};