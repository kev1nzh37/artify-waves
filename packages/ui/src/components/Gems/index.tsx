import { GemsClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"
import { GlobalProps } from "../utils/global-props"

import '../../styles/global.scss'

export interface Props extends GlobalProps {

}

export const Gems: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props) => {

  const {
    width = '480px',
    height = '320px',
    children = null,
    className = ''
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<GemsClient | null>(null)

  const init = () => {
    if (!dom.current || client !== null) return
    const c = new GemsClient({
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
        'wave-gems-client',
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
