'use strict';

class Hole {
    static #CONTEXT = 'webgl2';
    static #CLEAR = {color: [0.0, 0.0, 0.0, 1.0], depth: 1.0};
    static #MS_PER_S = 1000;
    static #SELECTOR_CANVAS = 'canvas#hole';
    static #SELECTOR_FPS = 'span#fps';

    #gl;
    #time;

    static async main() {
        const gl = document.querySelector(Hole.#SELECTOR_CANVAS).getContext(Hole.#CONTEXT);
        const hole = await new Hole(gl);
        requestAnimationFrame(hole.render.bind(hole));
    }

    constructor(gl) {
        this.#gl = gl;
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
        requestAnimationFrame(this.render.bind(this));
    }

    idle(time) {
        const dt = (time - this.#time) / Hole.#MS_PER_S;
        this.#time = time;
        this.fps = 1 / dt;
    }
}
