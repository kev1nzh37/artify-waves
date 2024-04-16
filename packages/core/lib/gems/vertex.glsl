#version 300 es
precision highp float;

in vec2 position; // 属性位置从缓冲区获取
out vec2 vUv; // 传递到片段着色器的 UV 坐标

void main() {
    vUv = position * 0.5 + 0.5; // 转换为 [0, 1] 范围
    gl_Position = vec4(position, 0.0, 1.0); // 输出位置，直接映射
}