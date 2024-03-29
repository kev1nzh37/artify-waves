import { Renderer, Program, Color, Mesh, Triangle } from "ogl"
import vert from "./vertex.glsl"
import frag from "./fragment.glsl"
import { parseColor } from "../utils/color"
export class ShadorClient {
  private dom: HTMLDivElement | null = null
  private renderer: Renderer | null = null
  private animateId: number = 0
  private program: Program | null = null
  private mesh: Mesh | null = null
  private gl: Renderer["gl"] | null = null
  private primaryColor: string | null = null
  private width: string | number = '100%'
  private height: string | number = '100%'

  constructor({
    dom,
    color,
    width,
    height,
  }: {
    dom: HTMLDivElement
    color: string
    width: string | number
    height: string | number
  }) {
    if (dom === null) {
      throw new Error("DOM element is null")
    }
    this.dom = dom
    this.primaryColor = color
    if (width) this.width = width
    if (height) this.height = height
    this.initRenderer()
  }

  private initRenderer = (): void => {
    this.renderer = new Renderer()
    this.gl = this.renderer.gl
    this.gl.clearColor(1, 1, 1, 1)

    window.addEventListener("resize", this.resize, false)
    this.resize()

    const geometry = new Triangle(this.gl)
    if (this.primaryColor === null) {
      throw new Error("Primary color is null")
    }
    const { r, g, b } = parseColor(this.primaryColor)

    this.program = new Program(this.gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(r, g, b) },
        luminance: { value: 0.5 },
        amplitude: { value: 0.3 },
      },
    })

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    this.animateId = requestAnimationFrame(this.update)

    const width = this.dom?.offsetWidth || 100;
    const height = this.dom?.offsetHeight || 150;

    // 将这些尺寸应用到WebGL的canvas元素上
    // this.gl.canvas.width = width;
    // this.gl.canvas.height = height;
    this.gl.canvas.style.width = width + 'px';
    this.gl.canvas.style.height = height + 'px';

    // 在WebGL上下文中设置视口大小，这一步确保WebGL渲染在新尺寸下正确

    this.dom?.appendChild(this.gl.canvas)


  }

  private resize = (): void => {
    if (this.dom === null || this.renderer === null) {
      throw new Error("DOM element or renderer is null")
    }
    // this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight)
  }

  private update = (t: number): void => {
    if (this.program === null || this.renderer === null || this.mesh === null) {
      throw new Error("Program or renderer is null")
    }

    this.animateId = requestAnimationFrame(this.update)
    this.program.uniforms.uTime.value = t * 0.001
    this.renderer.render({ scene: this.mesh })
  }

  public refresh(color: string): void {
    // 更新 primaryColor 属性
    this.primaryColor = color;

    // 解析新颜色值
    if (this.primaryColor === null) {
      throw new Error("Primary color is null");
    }
    const { r, g, b } = parseColor(this.primaryColor);
    console.log(r, g, b)
    // 确保 program 存在
    if (this.program === null) {
      throw new Error("Program is null");
    }

    // 更新 program 的 uColor uniform
    this.program.uniforms.uColor.value = new Color(r, g, b);

    // 可选：如果你希望立即看到颜色变化的效果，可以在这里调用渲染函数
    // 如果你的渲染循环已经在持续运行，这可能不是必需的
    // this.render();
  }
}
// 0.5: 这个值是基础亮度值，确保最终颜色不会太暗。它提供了一个固定的起点，确保颜色值在至少是中等亮度。

// 0.3 * cos(vUv.xyx + uTime): 这部分是动态变化的颜色分量，用于创建随时间变化的视觉效果。

// 0.3 是振幅（Amplitude），它控制着颜色变化幅度的大小。增大这个值会使颜色变化更明显，而减小它会让颜色变化更微妙。
// cos(...) 是一个周期函数，用于生成随着时间变化的重复模式。它的结果在-1到1之间变化，这样乘以振幅后就能产生正负波动。
// vUv.xyx + uTime 中 vUv.xyx 创造了一个基于纹理坐标的向量，其中xyx意味着使用纹理的x坐标两次和y坐标一次，创建一个特殊的变化效果。uTime 是随时间增加的值，确保了这个波动是动态的。
// uColor: 这是一个从外部传入的颜色向量，用于定义基础色彩。这个颜色直接加到上述计算的结果上，允许定制化效果的主色调。