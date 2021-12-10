
function MeshStandardBuildSplitPatch(uniforms){
    const uni = uniforms;
    // const patch = {
    //     compile:function(shader,plugin,object){
    //         console.log("shader");
    //         console.log(shader);
    //         console.log(plugin);
    //         console.log(object);
          
    //         // THREE.patchShader(shader, {
              
    //         //   uniforms: {
    //         //   },
              
              
    //         //   vertex: {
    //         //   },
    //         //   fragment: {
    //         //   }
    
    //         // });
    //     },
    //     render:function(object,uniforms,context){
    //         console.log("Render");
    //     }
    // };
    this.patch = function(shader,render){
        //塞uniforms
        for(var key in uni){
            // if(!shader.uniforms[key]){
            //     shader.uniforms[key] = uni[key];
            // }
            shader.uniforms[key] = uni[key];
        }
        //塞vertexShader
        let vertShader = ""+shader.vertexShader;
        var varying = `
        #include <clipping_planes_pars_vertex>
        uniform vec4 floorData;
        attribute vec2 texcoord_2;
        `;

        vertShader = vertShader.replace("#include <clipping_planes_pars_vertex>",varying);

        var startMain = `
        #include <begin_vertex>
        float isUp = step(floorData.y/floorData.x,texcoord_2.y);
        transformed.y+=isUp*floorData.z*floorData.w;
        `;

        

        vertShader = vertShader.replace("#include <begin_vertex>",startMain);
       
        shader.vertexShader = vertShader;
        
        // console.log(shader);
        


    };
}


export {MeshStandardBuildSplitPatch};



  



