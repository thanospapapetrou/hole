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
            program[attribute] = (attributes[attribute] instanceof VertexBufferObject) ? attributes[attribute]
                : new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, attributes[attribute].size, attributes[attribute].data);
        }
        const _indices = ((indices instanceof VertexBufferObject) ? indices
                : new VertexBufferObject(this.#gl, this.#gl.ELEMENT_ARRAY_BUFFER, indices.size, indices.data))
        this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, _indices.vbo);
        this.#gl.bindVertexArray(null);
        this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, null);
        this.#count = _indices.count;
        this.#type = _indices.type;
    }

    render() {
        this.#gl.bindVertexArray(this.#vao);
        this.#gl.drawElements(this.#gl.TRIANGLES, this.#count, this.#type, 0);
        this.#gl.bindVertexArray(null);
    }
}
