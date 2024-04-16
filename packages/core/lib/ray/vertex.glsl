#version 300 es
precision mediump float;

in vec2 position;
out vec2 surfacePosition;

void main() {
    surfacePosition = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}