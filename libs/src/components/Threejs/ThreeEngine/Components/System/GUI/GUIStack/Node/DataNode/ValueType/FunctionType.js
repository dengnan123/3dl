function FuncType(data)
{
    const name = data['name']||data['key'];
    const uniform = data.uniform;
    const args = uniform.args;
    // console.log(uniform);
    this.drawGUI = function(folder,style)
    {
        var item;
        if(args){
            item =  folder.add({value:()=>{uniform.value(args)}},'value').name(name);
        }else{
            item =  folder.add(uniform,'value').name(name);
        }
        FuncStyle(item,style);
        return item;
    }
    this.updateGUI = function()
    {
        
    }
    this.getData=function(){
       
    }
    this.setData=function(data){
       
    }
}

function FuncStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;


    // const toggler = item.domElement.querySelector(`input[type = "checkbox"]`).style;
    // toggler.color = `#FF0000`;
    // toggler.backgroundColor = '#00FF00';

    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }
}

export{FuncType};