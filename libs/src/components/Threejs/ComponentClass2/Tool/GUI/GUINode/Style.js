function numberStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;

    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
        item.__input.style.color = style.fontColor;
    }
    if(style.inputBackColor)
    {
        item.__input.style.backgroundColor = style.inputBackColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }

}

function sliderStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;

    const inputStyle = item.domElement.querySelector('div > input[type="text"]').style;

    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.textShadow = "none";
        item.__li.style.borderLeftColor = style.fontColor;
        item.__foreground.style.backgroundColor = style.fontColor;
        inputStyle.color = style.fontColor;
    }
    if(style.inputBackColor)
    {
        item.__background.style.backgroundColor = style.inputBackColor;
        inputStyle.backgroundColor = style.inputBackColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }
}

function booleanStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;


    const toggler = item.domElement.querySelector(`input[type = "checkbox"]`).style;
    toggler.color = `#FF0000`;
    toggler.backgroundColor = '#00FF00';

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

function folderStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;


    console.log(item);
    if(style.fontColor)
    {
        item.__ul.style.color = style.fontColor;
        item.__ul.style.borderLeftColor = style.fontColor;
    }
    if(style.backColor)
    {
        item.__ul.style.backgroundColor = style.backColor;
    }
}

function stringStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;

    
    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
        item.__input.style.color = style.fontColor;
    }
    if(style.inputBackColor)
    {
        item.__input.style.backgroundColor = style.inputBackColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }
}

function dropperStyle(item,style)
{
    if(JSON.stringify(style)=='{}')return;
    
    const selectStyle = item.domElement.querySelector('select').style;
    

    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
        selectStyle.color = style.fontColor;
    }
    if(style.optionColor)
    {
        selectStyle.color = style.optionColor;
    }
    if(style.inputBackColor)
    {
        selectStyle.backgroundColor = style.inputBackColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }








}


function colorStyle(item,style)
{
    const inputStyle = item.domElement.querySelector('div > input[type="text"]').style;
    inputStyle.height = '20px';
    if(JSON.stringify(style)=='{}')return;
    
    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.textShadow = "none";
        item.__li.style.borderLeftColor = style.fontColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }
}

export {numberStyle,sliderStyle,booleanStyle,stringStyle,dropperStyle,colorStyle,folderStyle};