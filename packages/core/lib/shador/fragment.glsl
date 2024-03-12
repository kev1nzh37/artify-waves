precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform float luminance;
uniform float amplitude;

varying vec2 vUv;

void main() {
    gl_FragColor.rgb = luminance + amplitude * cos(vUv.xyx + uTime) + uColor;
    gl_FragColor.a = 1.0;
}