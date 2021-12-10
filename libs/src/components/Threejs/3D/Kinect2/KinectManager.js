import {Texture } from 'three';
import * as THREE from 'three';

function KinectManager(data) 
{
    console.log(1);
    data = data||{};
    const kinectronServerIpAddress = data['IP']||'127.0.0.1';
    this.kinectron = new window.Kinectron(kinectronServerIpAddress);
    var kinectron = this.kinectron;
    kinectron.setKinectType("windows");

    kinectron.makeConnection();
    var isAlreadySetType = false;
    
    console.log(kinectron);

    this.receiveData = {};
    var receiveData = this.receiveData;
    this.frameIndex = {value:0};
    var frameIndex = this.frameIndex;

 
    var srcToTexture = this.srcToTexture;
    this.refreshTypes = function(types)
    {
        kinectron.stopAll();
        types = types||[];
        console.log(types)
        for(var key in types)
        {
            var name = types[key];
            receiveData[name] = receiveData[name]||{value:null};
            if (name == 'color'||name == 'depth') 
            {
                receiveData[name].value = new Texture(new Image());
                receiveData[name].value.minFilter = THREE.NearestFilter;
            }
            else
            {
                receiveData[name].value = null;
            }
        }
        if (types.length!=0) 
        {
            kinectron.startMultiFrame(types,onReceiveValueChange);
        }
    }
    var refreshTypes = this.refreshTypes;
    function  onReceiveValueChange(rcdata) 
    {
        for(var name in rcdata)
        {
            var t = receiveData[name];
            if(name == 'color'||name == 'depth')
            {
                t.value.image.src = rcdata[name];
                t.value.needsUpdate = true;
                continue;
            }
            if (name == 'body')
            {
                t.value = rcdata[name];
                continue;
            }
            console.log(name);
        }

    }

    refreshTypes(data.infos);
    console.log(receiveData);

   

}


export {KinectManager};