#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float timeScale;
uniform vec3 backgroundColor;

out vec4 FragColor;

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord.xy * sin(fragCoord.xy)) * 2.0 / iResolution.xy;
    vec3 col;

    float scaledTime = iTime * timeScale;
    float loopTime = mod(scaledTime, 10.0);

    float r = (sin(uv.x * 60.0 + loopTime * 4.0) * cos(uv.x * 10.0) - sin(uv.y));
    float g = 1.0 - uv.y * uv.y * (sin(uv.x * 10.0 - (loopTime * 0.2)));
    g = g * uv.y * uv.y * abs(tanh(uv.x * 2.0 - (loopTime * 0.5)));
    float b = abs(sin(uv.x * 60.0 + loopTime * 4.0)) * cos(uv.x * 20.0 + 1.0) - sin(uv.y);
    r = r * 2.0 * uv.x * uv.x * (tan(uv.y * 10.0 - (loopTime * 0.1)));
    col = vec3(r * g * sin(loopTime * 0.5), g * r * r * 0.01, b * g * r);

    col = mix(backgroundColor, col, col);

    FragColor = vec4(col,1.0);
}