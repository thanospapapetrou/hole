'use strict';

class VertexBufferObject {
    #vbo;
    #size;

    constructor(gl, type, size, data) {
        this.#vbo = gl.createBuffer();
        gl.bindBuffer(type, this.#vbo);
        gl.bufferData(type, data, WebGLRenderingContext.STATIC_DRAW);
        gl.bindBuffer(type, null);
        this.#size = size;
    }

    get vbo() {
        return this.#vbo;
    }

    get size() {
        return this.#size;
    }
}
