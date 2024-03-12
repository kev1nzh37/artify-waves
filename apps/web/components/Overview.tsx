import { Shador } from "@repo/ui"
import { useState } from "react"

export const Overview = () => {

  const [color, setColor] = useState('#ccc')
  return (
    <div>
      <input value={color} onChange={(e: any) => setColor(e.target.value)} />

      <Shador color={color} />
    </div>
  )
}
