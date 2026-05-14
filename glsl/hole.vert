#version 300 es

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

in vec4 aVertexPosition;
in vec4 aVertexColor;

out vec4 vColor;

void main(void) {
    gl_Position = projection * view * model * aVertexPosition;
    vColor = aVertexColor;
}
