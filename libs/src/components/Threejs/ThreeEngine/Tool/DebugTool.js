import { message } from "antd";
import { Three3DTool } from "./Three3DTool"

var DebugTool = {
    logObject3DChildren:function(obj){
        const dealSon = (son)=>{
            console.log(son);
        }
        const list = Three3DTool.getObject3DChildrenNameTree(obj);
        // console.log(JSON.stringify(list, null, 2));
        console.log(list);
    },
    logObjectParentPath:function(obj){
        return GetParentName(obj) +obj.name;
        function GetParentName(obj){
            if(obj.parent){
                return GetParentName(obj.parent)+obj.parent.name+"/";
            }
            return "";
        }
    },
    pasteToClipboard:function(obj){
        try {
            var jsonString = JSON.stringify(obj, null, 2);
            const el = document.createElement('textarea');
            el.value = jsonString;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
  
            message.success('配置成功复制到剪切板');
          } catch (error) {
            message.error(error.message);
          }
    }
}

export {DebugTool}