'use strict';

class Program {
    static #ERROR_LINKING = (vertex, fragment, info) => `Error linking program (${vertex}, ${fragment}): ${info}`;

    #program;
    #uniforms;
    #attributes;

    constructor(gl, vertex, fragment, uniforms, attributes) {
        return (async () => {
            this.#program = gl.createProgram();
            gl.attachShader(this.#program, (((vertex instanceof String) || ((typeof vertex) === Type.STRING))
                    ? await (new Shader(gl, gl.VERTEX_SHADER, vertex))
                    : vertex).shader);
            gl.attachShader(this.#program, (((fragment instanceof String) || ((typeof fragment) === Type.STRING))
                    ? await (new Shader(gl, gl.FRAGMENT_SHADER, fragment))
                    : fragment).shader);
            gl.linkProgram(this.#program);
            if (!gl.getProgramParameter(this.#program, gl.LINK_STATUS)) {
                const info = gl.getProgramInfoLog(this.#program);
                gl.deleteProgram(this.#program);
                throw new Error(Program.#ERROR_LINKING(vertex, fragment, info));
            }
            for (let uniform of uniforms) {
                const location = gl.getUniformLocation(this.#program, uniform);
                Object.defineProperty(this, uniform, {set: function (value) {
                    gl.uniformMatrix4fv(location, false, value);
                }});
            }
            for (let attribute of attributes) {
                const location = gl.getAttribLocation(this.#program, attribute);
                Object.defineProperty(this, attribute, {set: function (vbo) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vbo);
                    gl.vertexAttribPointer(location, vbo.size, vbo.type, false, 0, 0);
                    gl.enableVertexAttribArray(location);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }});
            }
            return this;
        })();
    }

    get program() {
        return this.#program;
    }
}
