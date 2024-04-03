import { Color } from "ogl"
import vert from "./vertex.glsl"
import frag from "./fragment.glsl"
import { parseColor } from "../utils/color"
import { BaseWave } from "../utils/wave"

export class ShadorClient extends BaseWave {
  private color: string = 'rgb(103, 28, 215)'
  private luminance: number = 0.5
  private amplitude: number = 0.3

  constructor({
    dom,
    color,
    luminance,
    amplitude,
  }: {
    dom: HTMLDivElement
    color?: string
    luminance?: number | null
    amplitude?: number | null
  }) {
    super({ dom })
    this.initConfig({ color, luminance, amplitude })
    const { r, g, b } = parseColor(this.color)
    this.initRenderer({
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(r, g, b) },
        luminance: { value: this.luminance },
        amplitude: { value: this.amplitude },
      },
    })
  }

  private initConfig = ({
    color,
    luminance,
    amplitude,
  }: {
    color?: string
    luminance?: number | null
    amplitude?: number | null
  }) => {
    if (color) this.color = color
    if (luminance) this.luminance = luminance
    if (amplitude) this.amplitude = amplitude
  }

  public update = (t: number): void => {
    if (this.program === null || this.renderer === null || this.mesh === null) {
      throw new Error("Program or renderer is null")
    }

    this.animateId = requestAnimationFrame(this.update)
    this.program.uniforms.uTime.value = t * 0.001
    this.renderer.render({ scene: this.mesh })
  }

  public refresh({ color, luminance, amplitude }: {
    color?: string | null
    luminance?: number | null
    amplitude?: number | null
  }): void {
    if (this.program === null) return

    if (color) {
      this.color = color;
      const { r, g, b } = parseColor(this.color);
      this.program.uniforms.uColor.value = new Color(r, g, b);
    }
    if (luminance) {
      this.luminance = luminance;
      this.program.uniforms.luminance.value = luminance;
    }
    if (amplitude) {
      this.amplitude = amplitude;
      this.program.uniforms.amplitude.value = amplitude;
    }
  }
}

// 0.5: 这个值是基础亮度值，确保最终颜色不会太暗。它提供了一个固定的起点，确保颜色值在至少是中等亮度。

// 0.3 * cos(vUv.xyx + uTime): 这部分是动态变化的颜色分量，用于创建随时间变化的视觉效果。

// 0.3 是振幅（Amplitude），它控制着颜色变化幅度的大小。增大这个值会使颜色变化更明显，而减小它会让颜色变化更微妙。
// cos(...) 是一个周期函数，用于生成随着时间变化的重复模式。它的结果在-1到1之间变化，这样乘以振幅后就能产生正负波动。
// vUv.xyx + uTime 中 vUv.xyx 创造了一个基于纹理坐标的向量，其中xyx意味着使用纹理的x坐标两次和y坐标一次，创建一个特殊的变化效果。uTime 是随时间增加的值，确保了这个波动是动态的。
// uColor: 这是一个从外部传入的颜色向量，用于定义基础色彩。这个颜色直接加到上述计算的结果上，允许定制化效果的主色调。

