#version 300 es
precision highp float;

// Attributes
in vec2 position;

// Pass to fragment shader
out vec2 vUv;

void main() {
    vUv = position * 0.5 + 0.5;  // Transforming the position to [0,1] range
    gl_Position = vec4(position, 0.0, 1.0);  // Output position
}
