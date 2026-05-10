'use strict';

class VertexBufferObject {
    #vbo;

    constructor(gl, type, data) {
        this.#vbo = gl.createBuffer();
        gl.bindBuffer(type, this.#vbo);
        gl.bufferData(type, data, WebGLRenderingContext.STATIC_DRAW);
        gl.bindBuffer(type, null);
    }

    get vbo() {
        return this.#vbo;
    }
}
