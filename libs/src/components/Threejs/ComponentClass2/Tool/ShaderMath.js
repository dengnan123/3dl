


var ShaderMath =
{
    vertexShader:
        [`
        varying vec2 vUv;
        void main()
        {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `].join('\n'),
    lerpFloat:
        `
        float lerp(float a,float b,float t)
        {
            return a * (1.0 - t) + b * t;
        }
    `,
    lerpVec2:
        `
        vec2 lerp(vec2 a,vec2 b,float t)
        {
            return a * (1.0 - t) + b * t;
        }
    `,
    lerpVec3:
        `
        vec3 lerp(vec3 a,vec3 b,float t)
        {
            return a * (1.0 - t) + b * t;
        }
    `,
    lerpVec4:
        `
        vec4 lerp(vec4 a,vec4 b,float t)
        {
            return a * (1.0 - t) + b * t;
        }
    `,
    besierVec2:
        `
        vec2 CalBezier(vec2 p0,vec2 p1,vec2 p2, float t)
        {
            return p0*pow((1.0-t),2.0)+2.0*p1*t*(1.0-t)+p2*t*t;
        }
    `,
    ellipseR:
        `
        vec4 GetEllipseR(vec3 center,vec3 abAngle,vec2 uvPos,float Rscale,float wdh)
        {
            //长轴
            float a = abAngle.x * abAngle.y * Rscale;
            //短轴
            float b = abAngle.x * Rscale;
            //离圆心的方向
            vec2 dir = uvPos - center.xy;
            dir.x*=wdh;
            //离圆心距离
            float dis = length(dir);
            //角度
            float angle = atan(dir.y,dir.x) + abAngle.z/180.0*PI;
            // float aa = mod(angle/2.0/PI,1.0);
            // float aa = (sin(angle)+1.0)/2.0;

            // angle = mod(angle,PI*2.0);
            //边界离圆心的距离
            float edgeDis = length(vec2(a*cos(angle),b*sin(angle)));

            vec4 o = vec4(dis,edgeDis,0.0,0.0);

            float dde = dis/edgeDis;
            o.z = step(dde,1.0);
            float w = smoothstep(0.0,1.0,lerp(dde,1.0,1.0 - o.z));
            o.w = 1.0-w;
            return o;
        }
    `,
    getPointsR:
        function (len) {
            var str =
                `
        vec4 getPointsR(vec4[${len}] ps1,vec4[${len}] ps2,float gRScale,float wdh)
        {
            vec4 vol = vec4(1.0,1.0,0.0,0.0);
            
            for(int i=0;i<${len};i++)
            {
                vec4 p = ps1[i];
                vec4 ps = ps2[i];
                if(p.w==1.0)
                {
                    vec4 value = GetEllipseR(p.xyz,ps.xyz,vUv,gRScale,wdh);
                    vol.z = lerp(vol.z,max(vol.z,value.z),p.w);
                    vol.w = lerp(vol.w,max(vol.w,value.w),p.w);
                }
            }
            return vol;
        }
        `
            return str;
        },
    noiseWithSizePower:
        `
    float getNoiseWithSizePower(vec3 noise,vec2 vUv,float wdh,float value)
    {
        vec2 times = vec2(noise.x,noise.x/wdh);
        vec2 uv = floor(vUv*times)/times;
        float scale = (rand(uv)-0.5)*2.0;
        return value*(1.0+scale*noise.y)+scale*noise.z;
    }
    `,
    calBezier1:
        `
    float CalBezier(vec2 p0,vec2 p1,vec2 p2, float t)
    {
        vec2 v2 = p0*pow((1.0-t),2.0)+2.0*p1*t*(1.0-t)+p2*t*t;
        return v2.y;
    }
    `,
    calBezier4P:
        `
    float CalBezier(vec2 p0,vec2 p1,vec2 p2,vec2 p3, float t)
    {
        vec2 v2 = p0*(1.0-t)*(1.0-t)*(1.0-t);
        v2 += 3.0*p1*(1.0-t)*(1.0-t)*t;
        v2 += 3.0*p2*(1.0-t)*t*t;
        v2 += p3*t*t*t;
        return v2.y;
    }
    `,
    smoothStepFadeMove:
        `
        float smoothStepFadeMove(vec4 ss,float v)
        {
            vec2 ss1 = vec2(ss.x-ss.y,ss.x+ss.y);
            vec2 ss2 = ss.zw;
            float ssv = ss2.x*(sin(ss2.y*time.x/50.0)+0.5);
            ss1.x/=(1.0+ssv);
            ss1.x = max(ss1.x,0.0001);
            ss1.y*=(1.0+ssv);
            return smoothstep(ss1.x,ss1.y,v);
        }
    `,
    floorFade:
        `
      float floorFade(float v,vec3 stepSetting,float ti)
      {
        float t = v;
        //指数值
        float et = pow(t,stepSetting.y);
        //时间
        float tv = mod(ti,1.0/stepSetting.x);
        //floor
        float fl = floor((et+tv)*stepSetting.x)/stepSetting.x-tv;
        return fl;
      }
    `,
    historyRange:
        `
      float historyRange(vec2 setting,float v)
      {
        return v*setting.y+setting.x;
      }
    `,
    levelsFlowNormal2: function (num) {
        var str =
            `
        vec2 levelsFlowNormal2(vec2 uv,vec4 globalSetting,vec2 setting,vec4 uvSetting,sampler2D norTex1,sampler2D norTex2,float ti)
        {
            vec2 luv = (uv-0.5)*2.0;
            luv = luv*uvSetting.z/10.0+uvSetting.xy;
            vec2 g_dir = normalize(globalSetting.xy);
            float g_Power = globalSetting.w;
            float s_Speed = setting.x;
            float s_Power = setting.y;
            luv = luv - g_dir * s_Speed*ti/20.0;

            vec2 nor1 = texture2D(norTex1,luv).xy;
            vec2 nor2 = texture2D(norTex2,luv).xy;
            vec2 nor = (lerp(nor1,nor2,uvSetting.w)-0.5)*2.0*g_Power*s_Power;

            return nor;
        }
        `;
        return str;
    }


};

export { ShaderMath };