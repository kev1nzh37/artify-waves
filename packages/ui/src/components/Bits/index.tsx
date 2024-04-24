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
    width = '480px',
    height = '320px',
    children = null,
    className = '',
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<BitsClient | null>(null)

  const init = () => {
    if (!dom.current || client !== null) return
    const c = new BitsClient({
      dom: dom.current,
      backgroundColor,
      timeScale,
    })
    setClient(c)
  }

  useEffect(() => {
    init();

    return () => {
      console.log(client);
      client?.destroy();
    };
  }, [client]);

  useEffect(() => {
    client?.refresh({
      backgroundColor,
      timeScale,
    });
  }, [backgroundColor, timeScale]);

  return (
    <div
      className={[
        'wave-client',
        'wave-bits-client',
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
