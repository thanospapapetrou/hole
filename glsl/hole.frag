#version 300 es

precision lowp float;

uniform vec3 color;
uniform vec3 lightAmbient;
uniform vec3 lightDirectionalColor;
uniform vec3 lightDirectionalDirection;

in vec3 vertexNormal;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vec4(color, 1.0);
    fragmentColor.rgb *= lightAmbient + lightDirectionalColor * max(dot(normalize(vertexNormal),
            normalize(-lightDirectionalDirection)), 0.0);
}
