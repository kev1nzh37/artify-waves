import { ShadorClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"
import { GlobalProps } from "../utils/global-props"

export interface ShadorProps extends GlobalProps {
  color?: string
  luminance?: number,
  amplitude?: number,
}

export const Shador: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ShadorProps
> = (props) => {

  const {
    color,
    width = '100%',
    height = '100%',
    luminance,
    amplitude,
    children = null
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<ShadorClient | null>(null)

  const init = () => {
    if (!dom.current) return
    const c = new ShadorClient({
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

  return (
    <div
      className={[
        'wave-client',
        'wave-shador-client',
        children ? 'wave-client-fullscreen' : ''
      ].join(' ')}
      ref={dom}
      style={{ width, height }}
    >
      {
        children ? <div className="wave-client-children">{children}</div> : null
      }
    </div>
  )

}
