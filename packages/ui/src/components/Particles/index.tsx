import { ParticlesClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"

export interface Props {
  color?: string
  width?: number | string
  height?: number | string
  luminance?: number,
  amplitude?: number,
}

export const Particles: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props) => {

  const {
    color,
    width = '100%',
    height = '100%',
    luminance = null,
    amplitude = null,
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<ParticlesClient | null>(null)

  const init = () => {
    if (!dom.current) return
    const c = new ParticlesClient({
      dom: dom.current,
      color,
      luminance,
      amplitude,
    })
    setClient(c)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (client) {
      console.log(color)
      client.refresh({
        color,
        luminance,
        amplitude,
      });
    }
  }, [color, luminance, amplitude]);

  return <div ref={dom} style={{ width, height }}></div>
}
