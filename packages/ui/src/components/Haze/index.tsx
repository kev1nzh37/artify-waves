import { HazeClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"
import { GlobalProps } from "../utils/global-props"

import '../../styles/global.scss'

export interface Props extends GlobalProps {

}

export const Haze: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props) => {

  const {
    width = '100%',
    height = '100%',
    children = null
  } = props

  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<HazeClient | null>(null)

  const init = () => {
    if (!dom.current || client !== null) return
    const c = new HazeClient({
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
        'wave-scales-client',
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
