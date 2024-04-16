#version 300 es
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(void) {
    vec2 p = (gl_FragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
    for (int i = 1; i < 5; i++) {
        p += sin(p.yx * vec2(1.6, 1.1) * float(i + 11) + iTime * float(i) * vec2(3.4, 0.5) / 10.0) * 0.1;
    }
    float c = (abs(sin(p.y + iTime) + sin(p.x + iTime))) * 0.5;
    fragColor = vec4(vec3(c), 1.0);
}