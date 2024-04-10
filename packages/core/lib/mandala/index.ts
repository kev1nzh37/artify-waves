import { Renderer, Program, Mesh, Color, Camera, Geometry } from "ogl";
import vert from "./vertex.glsl";
import frag from "./fragment.glsl";

// https://www.shadertoy.com/view/dlGcDV

export class MandalaClient {
  private program: Program;
  private gl: Renderer["gl"];
  private dom: HTMLDivElement;
  private renderer: Renderer;
  private mesh: Mesh;
  private camera: Camera;
  private backgroundColor: string;
  private timeScale: number;
  private animateId: number = 0;

  constructor({
    dom,
    backgroundColor = 'black',
    timeScale = 1,
  }: {
    dom: HTMLDivElement;
    backgroundColor?: string;
    timeScale?: number;
  }) {
    this.dom = dom;
    this.backgroundColor = backgroundColor;
    this.timeScale = timeScale;
    this.renderer = new Renderer({ dpr: window.devicePixelRatio, alpha: true });
    this.gl = this.renderer.gl;
    this.camera = new Camera(this.gl, { fov: 45 });
    this.camera.position.z = 1;

    const geometry = new Geometry(this.gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
    });

    this.program = new Program(this.gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iResolution: { value: [this.gl.canvas.width, this.gl.canvas.height] },
        iTime: { value: 0 },
        backgroundColor: { value: new Color(this.backgroundColor) },
        timeScale: { value: this.timeScale }
      },
    });

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();
    this.dom.appendChild(this.gl.canvas);
    this.animateId = requestAnimationFrame(this.update.bind(this));
  }

  public update(t: number): void {
    this.program.uniforms.iTime.value = t * 0.001;
    this.renderer.render({ scene: this.mesh, camera: this.camera });
    this.animateId = requestAnimationFrame(this.update.bind(this));
  }

  private resize(): void {
    const width = this.dom.offsetWidth;
    const height = this.dom.offsetHeight;

    this.gl.canvas.width = width;
    this.gl.canvas.height = height;

    this.gl.canvas.style.width = `${width}px`;
    this.gl.canvas.style.height = `${height}px`;

    this.program.uniforms.iResolution.value = [width, height];
    this.renderer.setSize(width, height);
  }

  public refresh({ backgroundColor, timeScale }: {
    backgroundColor?: string | null;
    timeScale?: number;
  }): void {
    if (backgroundColor) {
      this.backgroundColor = backgroundColor;
      this.program.uniforms.backgroundColor.value = new Color(backgroundColor);
    }
    if (timeScale !== undefined) {
      this.timeScale = timeScale;
      this.program.uniforms.timeScale.value = timeScale;
    }
  }
  public destroy(): void {
    cancelAnimationFrame(this.animateId);
    window.removeEventListener("resize", this.resize.bind(this), false);
    this.program.remove();
    this.mesh.geometry.remove();

    this.dom.removeChild(this.renderer.gl.canvas);
  }
}