'use strict';

class Hole {
    // TODO move
    // TODO setters for attributes and uniforms
    // TODO use VAO
    // TODO lights in shaders, uniform color etc
    static #ATTRIBUTES = ['aVertexPosition', 'aVertexColor'];
    static #AZIMUTH = {min: 0.0, max: 2 * Math.PI, velocity: Math.PI / 2};
    static #CLEAR = {color: [0.0, 0.0, 0.0, 1.0], depth: 1.0};
    static #DATA = {
        colors: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
        indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
        positions: [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0]
    };
    static #DISTANCE = {min: 5.0, max: 100.0, velocity: 10.0};
    static #ELEVATION = {min: -Math.PI / 2, max: Math.PI / 2, velocity: Math.PI / 2};
    static #CONTEXT = 'webgl2';
    static #MS_PER_S = 1000;
    static #PROJECTION = {fieldOfView: 0.78539816339, z: {near: 0.1, far: 250.0}};
    static #SELECTORS = {azimuth: 'span#azimuth', canvas: 'canvas#hole', distance: 'span#distance',
            elevation: 'span#elevation', fps: 'span#fps'};
    static #SHADERS = {fragment: './glsl/hole.frag', vertex: './glsl/hole.vert'};
    static #UNIFORMS = ['projection', 'view', 'model'];

    #gl;
    #program;
    #positions;
    #colors;
    #indices;
    #velocity;
    #time;

    static async main() {
        const gl = document.querySelector(Hole.#SELECTORS.canvas).getContext(Hole.#CONTEXT);
        const hole = await new Hole(gl);
        requestAnimationFrame(hole.render.bind(hole));
    }

    constructor(gl) {
        this.#gl = gl;
        return (async () => {
            this.#program = new Program(this.#gl,
                    await new Shader(this.#gl, this.#gl.VERTEX_SHADER, Hole.#SHADERS.vertex),
                    await new Shader(this.#gl, this.#gl.FRAGMENT_SHADER, Hole.#SHADERS.fragment),
                    Hole.#UNIFORMS, Hole.#ATTRIBUTES);
            this.#positions = new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, new Float32Array(Hole.#DATA.positions));
            this.#colors = new VertexBufferObject(this.#gl, this.#gl.ARRAY_BUFFER, new Float32Array(Hole.#DATA.colors));
            this.#indices = new VertexBufferObject(this.#gl, this.#gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Hole.#DATA.indices));
            this.#velocity = {azimuth: 0.0, elevation: 0.0, distance: 0.0};
            this.#time = 0;
            this.azimuth = Hole.#AZIMUTH.min;
            this.elevation = (Hole.#ELEVATION.max + Hole.#ELEVATION.min) / 2;
            this.distance = Hole.#DISTANCE.min;
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

    get azimuth() {
        return Number(document.querySelector(Hole.#SELECTORS.azimuth).firstChild.nodeValue);
    }

    set azimuth(azimuth) {
        document.querySelector(Hole.#SELECTORS.azimuth).firstChild.nodeValue =
                ((azimuth % Hole.#AZIMUTH.max) + Hole.#AZIMUTH.max) % Hole.#AZIMUTH.max;
    }

    get elevation() {
        return Number(document.querySelector(Hole.#SELECTORS.elevation).firstChild.nodeValue);
    }

    set elevation(elevation) {
        return document.querySelector(Hole.#SELECTORS.elevation).firstChild.nodeValue =
                Math.min(Math.max(elevation, Hole.#ELEVATION.min), Hole.#ELEVATION.max);
    }

    get distance() {
        return Number(document.querySelector(Hole.#SELECTORS.distance).firstChild.nodeValue);
    }

    set distance(distance) {
        document.querySelector(Hole.#SELECTORS.distance).firstChild.nodeValue =
                Math.min(Math.max(distance, Hole.#DISTANCE.min), Hole.#DISTANCE.max);
    }

    set fps(fps) {
        document.querySelector(Hole.#SELECTORS.fps).firstChild.nodeValue = fps;
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
        this.#gl.uniformMatrix4fv(this.#program.uniforms.model, false, this.#model2);
        this.#gl.drawElements(this.#gl.TRIANGLES, 36, this.#gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(this.render.bind(this));
    }

    keyboard(event) {
        this.#velocity = {azimuth: 0.0, elevation: 0.0, distance: 0.0};
        if (event.type == Event.KEY_DOWN) {
            switch (event.code) {
            case KeyCode.F:
                this.#velocity.azimuth = Hole.#AZIMUTH.velocity;
                break;
            case KeyCode.S:
                this.#velocity.azimuth = -Hole.#AZIMUTH.velocity;
                break;
            case KeyCode.E:
                this.#velocity.elevation = Hole.#ELEVATION.velocity;
                break;
            case KeyCode.D:
                this.#velocity.elevation = -Hole.#ELEVATION.velocity;
                break;
            case KeyCode.PAGE_UP:
                this.#velocity.distance = Hole.#DISTANCE.velocity;
                break;
            case KeyCode.PAGE_DOWN:
                this.#velocity.distance = -Hole.#DISTANCE.velocity;
                break;
            }
        }
    }


    idle(time) {
        const dt = (time - this.#time) / Hole.#MS_PER_S;
        this.#time = time;
        this.fps = 1 / dt;
        this.azimuth += this.#velocity.azimuth * dt;
        this.elevation += this.#velocity.elevation * dt;
        this.distance += this.#velocity.distance * dt;
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
        mat4.lookAt(view, vec3.fromValues(Math.sin(this.azimuth) * Math.cos(this.elevation) * this.distance,
                Math.sin(this.elevation) * this.distance,
                Math.cos(this.azimuth) * Math.cos(this.elevation) * this.distance),
                vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0));
        return view;
    }

    get #model() {
        const model = mat4.create();
        return model;
    }

    get #model2() {
            const model = mat4.create();
            mat4.translate(model, model, vec3.fromValues(10.0, 0.0, 0.0));
            return model;
        }
}
