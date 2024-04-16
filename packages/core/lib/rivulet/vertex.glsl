#version 300 es
precision mediump float;

in vec2 position;
out vec2 surfacePosition;

void main() {
    surfacePosition = position;  // 将屏幕空间坐标直接传递到片段着色器
    gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);  // 将顶点位置转换到裁剪空间
}
