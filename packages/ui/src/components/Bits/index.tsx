import { BitsClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"
import { GlobalProps } from "../utils/global-props"

import '../../styles/global.scss'

export interface Props extends GlobalProps {
  backgroundColor?: string
  timeScale?: number
}

export const Bits: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props) => {

  const {
    backgroundColor,
    timeScale,
    width = '100%',
    height = '100%',
    children = null
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<BitsClient | null>(null)

  const init = () => {
    if (!dom.current) return
    const c = new BitsClient({
      dom: dom.current,
      backgroundColor,
      timeScale,
    })
    setClient(c)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (client) {
      client.refresh({
        backgroundColor,
        timeScale,
      });
    }
    return () => {
      if (client) {
        client.destroy()
      }
    }
  }, [backgroundColor, timeScale]);

  return (
    <div
      className={[
        'wave-client',
        'wave-bits-client',
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
