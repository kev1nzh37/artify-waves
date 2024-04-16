#version 300 es
precision mediump float;

uniform float iTime;
uniform vec2 resolution;
in vec2 surfacePosition;  // 在 WebGL 中使用 'in' 替换 'varying'
out vec4 fragColor;       // 在 WebGL 中使用 'out' 替换 'gl_FragColor'

vec4 textureRND2D(vec2 uv) {
    uv = floor(fract(uv) * 1000.0);
    float v = uv.x + uv.y * 1000.0;
    return fract(100000.0 * sin(vec4(v * 0.01, (v + 1.0) * 0.01, (v + 1000.0) * 0.01, (v + 1001.0) * 0.01)));
}

float noise(vec2 p) {
    vec2 f = fract(p * 1000.0);
    vec4 r = textureRND2D(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
}

float cloud(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.50000;
    v += noise(p * 2.0) * 0.25000;
    v += noise(p * 4.0) * 0.12500;
    v += noise(p * 8.0) * 0.06250;
    v += noise(p * 16.0) * 0.03125;
    return v * v * v;
}

void main(void) {
    vec2 p = surfacePosition * 0.05 + 0.5;
    vec3 c = vec3(0.0, 0.0, 0.2);
    c.rgb += vec3(0.6, 0.6, 0.8) * cloud(p * 0.3 + iTime * 0.0002) * 0.6;
    c.gbr += vec3(0.8, 0.8, 1.0) * cloud(p * 0.2 + iTime * 0.0002) * 0.8;
    c.grb += vec3(1.0, 1.0, 1.0) * cloud(p * 0.1 + iTime * 0.0002) * 1.0;
    fragColor = vec4(c, 1.0);
}
