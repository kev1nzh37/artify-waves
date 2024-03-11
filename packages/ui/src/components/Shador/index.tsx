import { ShadorClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"

export const Shador = () => {
  const dom = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<ShadorClient | null>(null)

  const init = () => {
    if (!dom.current) return
    const c = new ShadorClient(dom.current)
    setClient(c)
  }

  useEffect(() => {
    init()
  }, [])

  return <div ref={dom}></div>
}
