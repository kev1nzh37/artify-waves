#version 300 es
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(void) {
    vec2 uPos = (gl_FragCoord.xy / iResolution.xy);
    uPos.x -= 0.5;
    uPos.y -= 0.5;

    vec3 color = vec3(0.0);
    float vertColor = 0.0;

    for (float i = 0.0; i < 10.0; ++i) {
        float t = iTime * (0.11);

        uPos.y += sin(uPos.x * (i + 1.0) + t + i / 2.0) * 0.1;
        float fTemp = abs(1.0 / uPos.y / 100.0);
        vertColor += fTemp;
        color += vec3(fTemp * (10.0 - i) / 10.0, fTemp * i / 10.0, pow(fTemp, 0.99) * 1.5);
    }

    fragColor = vec4(color, 1.0);
}
