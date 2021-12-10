var PPSTool = 
{
    loadUniformFromPropsAndEffects:function(props,effects)
    {
        if (!props) {
            return;
        }
        if (!props.uniformsDic) {
            return;
        }
        for(var key in props.uniformsDic)
        {
            var effect = effects[key];
            if (!effect) 
            {
                return;
            }
            var pUniforms = props.uniformsDic[key];
            var oldUniforms = effect.uniforms;
        }
    }
}

export {PPSTool};