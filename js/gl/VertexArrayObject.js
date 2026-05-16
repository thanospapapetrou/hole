'use strict';

class VertexArrayObject {
    #gl;
    #vao;
    #count;
    #type;

    constructor(gl, program, attributes, indices) {
        this.#gl = gl;
        this.#vao = this.#gl.createVertexArray();
        this.#gl.bindVertexArray(this.#vao);
        for (let attribute in attributes) {
            program[attribute] = attributes[attribute];
        }
        this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, indices.vbo);
        this.#gl.bindVertexArray(null);
        this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, null);
        this.#count = indices.count;
        this.#type = indices.type;
    }

    render() {
        this.#gl.bindVertexArray(this.#vao);
        this.#gl.drawElements(this.#gl.TRIANGLES, this.#count, this.#type, 0);
        this.#gl.bindVertexArray(null);
    }
}
