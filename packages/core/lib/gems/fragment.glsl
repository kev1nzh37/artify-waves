#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
in vec2 vUv;
out vec4 fragColor;

void main() {
    vec4 o = vec4(0.0);
    vec2 R = iResolution;
    vec2 u = vUv * R;
    u = 13.0 * (u + u - R) / R.y + iTime + 24.0 * ceil(0.4 * iTime);
    
    for (float i; i++<30.; o += 1.-sin(vec4(.15,.1,.15,1)*u.xyyy))        
        u *= 1.06 * mat2(cos(i - vec4(0,11,33,0))),
        u += .5/i * o.yx * sin(u );
        
    o = 1.0 - exp(-5e-5 * o * o * o.x);
    o = exp(0.5 - 4.2 * o * o * o.a * o.x);
    
    fragColor = o;
}