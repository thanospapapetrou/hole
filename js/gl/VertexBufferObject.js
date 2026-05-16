'use strict';

class VertexBufferObject {
    static #ERROR_UNSUPPORTED = (data) => `Unsupported type ${data.constructor.name}`;

    #vbo;
    #size;
    #type;

    static #getType(gl, data) {
        if (data instanceof Uint16Array) {
            return gl.UNSIGNED_SHORT;
        } else if (data instanceof Float32Array) {
            return gl.FLOAT;
        } else {
            throw new Error(VertexBufferObject.#ERROR_UNSUPPORTED(data));
        }
    }

    constructor(gl, type, size, data) {
        this.#vbo = gl.createBuffer();
        gl.bindBuffer(type, this.#vbo);
        gl.bufferData(type, data, WebGLRenderingContext.STATIC_DRAW);
        gl.bindBuffer(type, null);
        this.#size = size;
        this.#type = VertexBufferObject.#getType(gl, data);
    }

    get vbo() {
        return this.#vbo;
    }

    get size() {
        return this.#size;
    }

    get type() {
        return this.#type;
    }
}
