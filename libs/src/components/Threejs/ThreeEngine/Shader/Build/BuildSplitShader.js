import { MeshStandardMaterial, Vector3, Vector4 } from "three";

function CreateBuildSplitShader(oldMat){
    const uniforms = {
        floorData:{value:new Vector4()},
        mainTex:{value:null},
        color:{value:new Vector3(1,1,1)},

    }
    var testMat = new MeshStandardMaterial();
    console.log(oldMat);
    copyUniforms(oldMat);
    const vertexShader = getVertexShader();
    const fragmentShader = getFragmentShader();

    return {uniforms,vertexShader,fragmentShader};
    function getVertexShader(){
        var vs = 
        [
            `
                precision mediump float;
                precision mediump int;


                attribute vec2 texcoord_2;

                uniform vec4 floorData;

                varying vec2 vUv;
                varying vec2 vUv2;
                void main()
                {
                    vUv = uv;
                    vUv2 = texcoord_2;
                    float v2Y = vUv2.y;
                    float isUp = step(floorData.y/floorData.x,v2Y);


                    vec3 pos = position;
                    pos.y+=isUp*floorData.z*floorData.w;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0 );
                }
            `
        ].join('\n')
        return vs;
    }

    function getFragmentShader(){
        var fs = 
        [
            `
            precision mediump float;
			precision mediump int;

            uniform vec4 floorData;
            uniform sampler2D mainTex;
            uniform vec3 color;
			varying vec2 vUv;
			varying vec2 vUv2;
            
			void main()	
            {
                // vec3 _col = vec3(1.0,0.0,0.0);
                vec4 mainTexCol = texture2D(mainTex,vUv);
                float isExist = step(0.00001,mainTexCol.a);
                vec3 mainCol = isExist*mainTexCol.xyz+(1.0-isExist)*color;
                vec3 _col = vec3(1.0,1.0,1.0);
                _col = mainCol*0.5;

				gl_FragColor = vec4(_col,1.0);

			}
            `

        ].join('\n');
        return fs; 
    }

    function copyUniforms(){
        
        if(!oldMat)return;
        uniforms['mainTex'].value = oldMat.map||null;
        const col = oldMat.color;
        if(col){
            uniforms['color'].value.set(col.r,col.g,col.b);
        }
    }
}


export {CreateBuildSplitShader}