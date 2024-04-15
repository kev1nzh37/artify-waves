import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import vert from './vertex.glsl';
import frag from './fragment.glsl';
import { parseColor } from '../utils/color';

interface ShadorClientOptions {
  dom: HTMLDivElement;
  color?: string;
  luminance?: number;
  amplitude?: number;
}

export class ShadorClient {
  private program: Program;
  private gl: Renderer["gl"];
  private dom: HTMLDivElement;
  private renderer: Renderer;
  private mesh: Mesh;
  private color: string;
  private luminance: number;
  private amplitude: number;
  private animateId: number = 0;
  private boundResize;

  constructor({
    dom,
    color = 'rgb(103, 28, 215)',
    luminance = 0.5,
    amplitude = 0.3,
  }: ShadorClientOptions) {
    this.dom = dom;
    this.color = color;
    this.luminance = luminance;
    this.amplitude = amplitude;

    this.renderer = new Renderer();
    this.gl = this.renderer.gl;
    this.gl.clearColor(1, 1, 1, 1);

    const { r, g, b } = parseColor(this.color);
    const geometry = new Triangle(this.gl);
    this.program = new Program(this.gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(r, g, b) },
        luminance: { value: this.luminance },
        amplitude: { value: this.amplitude },
      },
    });

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
    this.animateId = requestAnimationFrame(this.update);
    this.boundResize = this.resize.bind(this);
    window.addEventListener('resize', this.boundResize, false);
    this.resize();
    this.dom.appendChild(this.gl.canvas);
  }

  public update = (t: number): void => {
    this.program.uniforms.uTime.value = t * 0.001;
    this.renderer.render({ scene: this.mesh });
    this.animateId = requestAnimationFrame(this.update);
  }

  private resize = (): void => {
    const width = this.dom.offsetWidth;
    const height = this.dom.offsetHeight;

    this.gl.canvas.width = width;
    this.gl.canvas.height = height;

    this.gl.canvas.style.width = `${width}px`;
    this.gl.canvas.style.height = `${height}px`;

    this.renderer.setSize(width, height);
  }

  public refresh = ({ color, luminance, amplitude }: {
    color?: string;
    luminance?: number;
    amplitude?: number;
  }): void => {
    if (color) {
      this.color = color;
      const { r, g, b } = parseColor(this.color);
      this.program.uniforms.uColor.value = new Color(r, g, b);
    }
    if (luminance !== undefined) {
      this.luminance = luminance;
      this.program.uniforms.luminance.value = this.luminance;
    }
    if (amplitude !== undefined) {
      this.amplitude = amplitude;
      this.program.uniforms.amplitude.value = this.amplitude;
    }
  }

  public destroy = (): void => {
    console.log('销毁函数进来了')
    cancelAnimationFrame(this.animateId);
    window.removeEventListener('resize', this.boundResize, false);
    this.dom.removeChild(this.renderer.gl.canvas);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    console.log('destroy')
  }
}
