import { ShadorClient } from "@repo/core"
import { useEffect, useRef, useState } from "react"

export const Shador = () => {
  const dom = useRef<HTMLDivElement>(null)
  const [val, setVal] = useState(0)
  const init = () => {
    if (!dom.current) return
    console.log(222222222)
    const client = new ShadorClient(dom.current)
    console.log(client.show())
    setVal(client.show())
  }

  useEffect(() => {
    init()
  }, [])

  return <div ref={dom}>ShadordddP{val}</div>
}
