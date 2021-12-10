function GUINode(infos){
    const key = infos.key;
    const isFolder = infos.isFolder;
    let sons = {};

    this.AddValue = function(data){
        var node = getNode(data);
       return node;

    }
    this.addFolder = function(data){
        var folder = getFolder(data);
    }
    this.Clear = function(){

        sons = {};
    }

    function getNode(data){
        if(!data){
            console.error("data为空");
        }
        const key = data['key'];
        const uniform = data['uniform'];
        if(!key||!uniform){
            console.error("key或uniform为空");
        }
        const order = data['order']||0;
    }
    function getFolder(data){
        if(!data){
            console.error("data为空");
        }
        const key = data['key'];
        if(!key){
            console.error("key为空");
        }
        const order = data['order']||0;
    }
}

export {GUINode}