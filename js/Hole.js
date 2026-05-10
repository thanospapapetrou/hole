'use strict';

class Hole {
    static #ATTRIBUTE_NORMAL = 'normal';
    static #ATTRIBUTE_POSITION = 'position';
    static #CONTEXT = 'webgl2';
    static #CLEAR = {color: [0.0, 0.0, 0.0, 1.0], depth: 1.0};
    static #MS_PER_S = 1000;
    static #SELECTOR_CANVAS = 'canvas#hole';
    static #SELECTOR_FPS = 'span#fps';
    static #SHADER_FRAGMENT = './glsl/hole.frag';
    static #SHADER_VERTEX = './glsl/hole.vert';
    static #UNIFORM_MODEL = 'model';
    static #UNIFORM_PROJECTION = 'projection';
    static #UNIFORM_VIEW = 'view';

    #gl;
    #program;
    #positions;
    #normals;
    #vao;
    #time;

    static async main() {
        const gl = document.querySelector(Hole.#SELECTOR_CANVAS).getContext(Hole.#CONTEXT);
        const hole = await new Hole(gl);
        requestAnimationFrame(hole.render.bind(hole));
    }

    constructor(gl) {
        this.#gl = gl;
        return (async () => {
            this.#program = await new Program(this.#gl,
                await new Shader(this.#gl, this.#gl.VERTEX_SHADER, Hole.#SHADER_VERTEX),
                await new Shader(this.#gl, this.#gl.FRAGMENT_SHADER, Hole.#SHADER_FRAGMENT),
                [Hole.#UNIFORM_PROJECTION, Hole.#UNIFORM_VIEW, Hole.#UNIFORM_MODEL],
                [Hole.#ATTRIBUTE_POSITION, Hole.#ATTRIBUTE_NORMAL]);
            this.#positions = new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, [
                0.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0
            ]);
            this.#normals = new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0
            ]);
            this.#vao = new VertexArrayObject(this.#gl, [{vbo: this.#positions}, {vbo: this.#normals}],
                new VertexBufferObject(this.#gl, this.#gl.ELEMENT_ARRAY_BUFFER, new Uint32Array([
                    0, 1, 2
                ])));
            this.#time = 0;
            this.#gl.clearColor(...Hole.#CLEAR.color);
            this.#gl.clearDepth(Hole.#CLEAR.depth);
            this.#gl.depthFunc(this.#gl.LEQUAL);
            this.#gl.enable(this.#gl.DEPTH_TEST);
            this.#gl.cullFace(this.#gl.BACK);
            this.#gl.enable(this.#gl.CULL_FACE);
            this.#gl.canvas.addEventListener(Event.KEY_DOWN, this.keyboard.bind(this));
            this.#gl.canvas.addEventListener(Event.KEY_UP, this.keyboard.bind(this));
            this.#gl.canvas.focus();
            return this;
        })();
    }

    set fps(fps) {
        document.querySelector(Hole.#SELECTOR_FPS).firstChild.nodeValue = fps;
    }

    keyboard(event) {
        if (event.type == Event.KEY_DOWN) {
            switch (event.code) {
            case KeyCode.PAGE_UP:
                break;
            case KeyCode.PAGE_DOWN:
                break;
            case KeyCode.A:
                break;
            case KeyCode.D:
                break;
            case KeyCode.S:
                break;
            }
        }
    }

    render(time) {
        this.idle(time);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
        this.#gl.useProgram(this.#program.program);
        this.#gl.bindVertexArray(this.#vao.vao);
        this.#gl.drawElements(this.#gl.TRIANGLES, this.#vao.count, this.#gl.UNSIGNED_INT, 0);
        requestAnimationFrame(this.render.bind(this));
    }

    idle(time) {
        const dt = (time - this.#time) / Hole.#MS_PER_S;
        this.#time = time;
        this.fps = 1 / dt;
    }
}
