function folderType(data)
{
    const isOpen = data['isOpen']||false;
    const isHide = data['isHide']||false;
    const name = data['name']||data.key;
    const _style = data.style;
    this.drawGUI = function(folder,parentStyle)
    {
        const f = folder.addFolder(name);
        const style = _style||parentStyle||{};
        folderStyle(f,style);
        if(isOpen) f.open();
        if(isHide) f.hide();
        return f;
    }
}


function folderStyle(item,style)
{
    // const folder = item.domElement.querySelector(`class[type = "folder"]`);
    // console.log(folder);
    // if(style&&!style.noPadding){
    //     item.__ul.style.paddingLeft=`5px`
    // }
    // console.log(item.__ul);
    // console.log();
    if(!style||JSON.stringify(style)=='{}')return;
    const title = item.domElement.querySelector(`ul > li[class = "title"]`);
    // console.log(title)    
    // console.log(item);

    // console.log(item);
    if(style.fontColor)
    {
        item.__ul.style.color = style.fontColor;
        item.__ul.style.borderLeftColor = style.fontColor;
    }
    if(style.backColor)
    {
        // item.__ul.style.backgroundColor = style.backColor;
        title.style.backgroundColor = style.backColor;
        // console.log(item);
    }
}

function NoneType(data) {
    this.drawGUI = function(folder)
    {

    }
    this.updateGUI = function()
    {
    }
    this.getData=function(){
        return [];
    }
    this.setData=function(data){
    }
}
export {folderType,NoneType,folderStyle}