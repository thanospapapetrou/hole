'use strict';

class Hole {
    // TODO distance, azimuth, elevation
    // TODO second cube
    // TODO move
    // TODO setters for attributes and uniforms
    // TODO use VAO
    // TODO lights in shaders, uniform color etc
    static #CLEAR = {color: [0.0, 0.0, 0.0, 1.0], depth: 1.0};
    static #DATA_COLORS = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0];
    static #DATA_INDICES = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    static #DATA_POSITIONS = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];
    static #CONTEXT = 'webgl2';
    static #MS_PER_S = 1000;
    static #PROJECTION = {fieldOfView: 0.78539816339, z: {near: 0.1, far: 100.0}};
    static #SELECTOR_CANVAS = 'canvas#hole';
    static #SELECTOR_FPS = 'span#fps';
    static #SHADER_FRAGMENT = './glsl/hole.frag';
    static #SHADER_VERTEX = './glsl/hole.vert';
    static #UNIFORM_PROJECTION = 'projection';
    static #UNIFORM_VIEW = 'view';
    static #UNIFORM_MODEL = 'model';

    #gl;
    #program;
    #positions;
    #colors;
    #indices;
    #rotation; // TODO replace with azimuth, elevation, distance
    #time;

    static async main() {
        const gl = document.querySelector(Hole.#SELECTOR_CANVAS).getContext(Hole.#CONTEXT);
        const hole = await new Hole(gl);
        requestAnimationFrame(hole.render.bind(hole));
    }

    constructor(gl) {
        this.#gl = gl;
        return (async () => {
            this.#program = new Program(this.#gl,
                    await new Shader(this.#gl, this.#gl.VERTEX_SHADER, Hole.#SHADER_VERTEX),
                    await new Shader(this.#gl, this.#gl.FRAGMENT_SHADER, Hole.#SHADER_FRAGMENT),
                    [Hole.#UNIFORM_PROJECTION, Hole.#UNIFORM_VIEW, Hole.#UNIFORM_MODEL],
                    ['aVertexPosition', 'aVertexColor']); // TODO
            this.#positions = new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, new Float32Array(Hole.#DATA_POSITIONS));
            this.#colors = new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, new Float32Array(Hole.#DATA_COLORS));
            this.#indices = new VertexBufferObject(this.#gl, this.#gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Hole.#DATA_INDICES));
            this.#rotation = 0.0;
            this.#time = 0;
            this.#gl.clearColor(...Hole.#CLEAR.color);
            this.#gl.clearDepth(Hole.#CLEAR.depth);
            this.#gl.depthFunc(this.#gl.LEQUAL);
            this.#gl.enable(this.#gl.DEPTH_TEST);
            this.#gl.cullFace(this.#gl.BACK);
            this.#gl.enable(this.#gl.CULL_FACE);
            return this;
        })();
    }

    set fps(fps) {
        document.querySelector(Hole.#SELECTOR_FPS).firstChild.nodeValue = fps;
    }

    render(time) {
        this.idle(time);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
        this.#gl.useProgram(this.#program.program);
        this.#gl.uniformMatrix4fv(this.#program.uniforms.projection, false, this.#projection);
        this.#gl.uniformMatrix4fv(this.#program.uniforms.view, false, this.#view);
        this.#gl.uniformMatrix4fv(this.#program.uniforms.model, false, this.#model);
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positions.vbo);
        this.#gl.vertexAttribPointer(this.#program.attributes.aVertexPosition, 3, this.#gl.FLOAT, false, 0, 0);
        this.#gl.enableVertexAttribArray(this.#program.attributes.aVertexPosition);
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#colors.vbo);
        this.#gl.vertexAttribPointer(this.#program.attributes.aVertexColor, 4, this.#gl.FLOAT, false, 0, 0);
        this.#gl.enableVertexAttribArray(this.#program.attributes.aVertexColor);
        this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, this.#indices.vbo);
        this.#gl.drawElements(this.#gl.TRIANGLES, 36, this.#gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(this.render.bind(this));
    }

    idle(time) {
        const dt = (time - this.#time) / Hole.#MS_PER_S;
        this.#time = time;
        this.fps = 1 / dt;
        this.#rotation += dt; // TODO
    }

    get #projection() {
        const projection = mat4.create();
        mat4.perspective(projection, Hole.#PROJECTION.fieldOfView,
                this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight, Hole.#PROJECTION.z.near,
                Hole.#PROJECTION.z.far);
        return projection;
    }

    get #view() {
        const view = mat4.create();
        mat4.lookAt(view, vec3.fromValues(0.0, 0.0, 6.0), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0));
        return view;
    }

    get #model() {
        const model = mat4.create();
        mat4.rotateX(model, model, this.#rotation * 0.3);
        mat4.rotateY(model, model, this.#rotation * 0.7);
        mat4.rotateZ(model, model, this.#rotation);
        return model;
    }
}
