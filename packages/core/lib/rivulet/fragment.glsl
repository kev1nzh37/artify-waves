#version 300 es
precision mediump float;

uniform float iTime;
in vec2 surfacePosition; // "varying" 关键字在 WebGL 2 中用 "in" 替换
out vec4 fragColor; // 在 WebGL 2 中用 "out" 替换 "gl_FragColor"

#define MAX_ITER 4

void main(void) {
    vec2 sp = surfacePosition; // vec2(.4, .7);
    vec2 p = sp * 5.0 - vec2(10.0);
    vec2 i = p;
    float c = 1.0;
    float inten = 0.01;

    for (int n = 0; n < MAX_ITER; n++) {
        float t = iTime * 0.1 * (11.0 - (3.0 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }
    c /= float(MAX_ITER);
    c = 1.5 - sqrt(c);
    fragColor = vec4(vec3(c * c * c * c), 1.0) + vec4(0.0, 0.3, 0.5, 1.0);
}
