import { Renderer, Program, Mesh, Triangle } from "ogl"

export class BaseWave {
    public program: Program | null = null
    public gl: Renderer["gl"] | null = null
    public dom: HTMLDivElement | null = null
    public renderer: Renderer | null = null
    public mesh: Mesh | null = null
    public animateId: number = 0
    public update: (t: number) => void = (t) => { }

    constructor({
        dom,
    }: {
        dom: HTMLDivElement
    }) {
        if (dom === null) {
            throw new Error("DOM element is null")
        }
        this.dom = dom
    }

    public initRenderer = (programConfig: any): void => {
        if (programConfig === null) {
            throw new Error("Program Config is null")
        }
        this.renderer = new Renderer()
        this.gl = this.renderer.gl
        this.gl.clearColor(1, 1, 1, 1)

        window.addEventListener("resize", this.resize, false)
        this.resize()

        const geometry = new Triangle(this.gl)

        this.program = new Program(this.gl, programConfig)
        this.mesh = new Mesh(this.gl, { geometry, program: this.program })
        this.animateId = requestAnimationFrame(this.update)

        const width = this.dom?.offsetWidth || 100;
        const height = this.dom?.offsetHeight || 150;
        this.gl.canvas.style.width = width + 'px';
        this.gl.canvas.style.height = height + 'px';

        this.dom?.appendChild(this.gl.canvas)
    }

    private resize = (): void => {
        if (this.dom === null || this.renderer === null) {
            throw new Error("DOM element or renderer is null")
        }
    }
}