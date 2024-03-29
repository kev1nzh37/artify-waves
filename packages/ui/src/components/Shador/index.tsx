import { ShadorClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"

export interface ShadorProps {
  color?: string
  width?: number | string
  height?: number | string
}

export const Shador: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ShadorProps
> = (props) => {

  const {
    color,
    width = '100%',
    height = '100%'
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<ShadorClient | null>(null)
  const primaryColor = `rgb(103, 28, 215)`

  const init = () => {
    if (!dom.current) return
    const c = new ShadorClient({
      dom: dom.current,
      color: color || primaryColor,
      width,
      height
    })
    setClient(c)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (client) {
      console.log(color)
      client.refresh(color || primaryColor);
    }
  }, [color]);

  return <div ref={dom} style={{ width, height }}></div>
}
