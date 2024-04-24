import { MandalaClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"
import { GlobalProps } from "../utils/global-props"

import '../../styles/global.scss'

export interface Props extends GlobalProps {
  backgroundColor?: string
  timeScale?: number
}

export const Mandala: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props) => {

  const {
    backgroundColor,
    timeScale,
    width = '480px',
    height = '320px',
    children = null,
    className = ''
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<MandalaClient | null>(null)

  const init = () => {
    if (!dom.current) return
    const c = new MandalaClient({
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
        'wave-mandala-client',
        children ? 'wave-client-fullscreen' : '',
        className
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
