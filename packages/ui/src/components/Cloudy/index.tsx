import { CloudyClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"
import { GlobalProps } from "../utils/global-props"

import '../../styles/global.scss'

export interface Props extends GlobalProps {

}

export const Cloudy: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props) => {

  const {
    width = '100%',
    height = '100%',
    children = null,
    className = '',
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<CloudyClient | null>(null)

  const init = () => {
    if (!dom.current || client !== null) return
    const c = new CloudyClient({
      dom: dom.current,
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

  return (
    <div
      className={[
        'wave-client',
        'wave-cloudy-client',
        children ? 'wave-client-fullscreen' : '',
        className,
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
