'use strict';

class Program {
    static #ERROR_LINKING = (vertex, fragment, info) => `Error linking program (${vertex}, ${fragment}): ${info}`;

    #program;
    #uniforms;
    #attributes;

    constructor(gl, vertex, fragment, uniforms, attributes) {
        this.#program = gl.createProgram();
        gl.attachShader(this.#program, vertex.shader);
        gl.attachShader(this.#program, fragment.shader);
        gl.linkProgram(this.#program);
        if (!gl.getProgramParameter(this.#program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this.#program);
            gl.deleteProgram(this.#program);
            throw new Error(Program.#ERROR_LINKING(vertex, fragment, info));
        }
        for (let uniform of uniforms) {
            Object.defineProperty(this, uniform, {set: function (value) {
                gl.uniformMatrix4fv(gl.getUniformLocation(this.#program, uniform), false, value);
            }});
        }
        this.#attributes = {};
        for (let attribute of attributes) {
            this.#attributes[attribute] = gl.getAttribLocation(this.#program, attribute);
        }
    }

    get program() {
        return this.#program;
    }

    get attributes() {
        return this.#attributes;
    }
}
