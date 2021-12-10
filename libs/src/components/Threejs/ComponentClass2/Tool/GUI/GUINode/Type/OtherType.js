import {folderStyle} from '../Style';
function folderType(data)
{
    let isOpen = data['isOpen']||false;
    let isHide = data['isHide']||false;
    let displayName = data['displayName']||data.key;
    const style = data.style||{};
    this.drawGUI = function(folder)
    {
        const f = folder.addFolder(displayName);
        folderStyle(f,style);
        if(isOpen) f.open();
        if(isHide) f.hide();
        return f;
    }
}

function funcType(data)
{
    const displayName = data['displayName']||data['key'];
    const uniform = data.uniform;
    // console.log(uniform);
    this.drawGUI = function(folder)
    {
        return folder.add(uniform,'value').name(displayName);
    }
    this.updateGUI = function()
    {
        
    }
}


export{folderType,funcType}