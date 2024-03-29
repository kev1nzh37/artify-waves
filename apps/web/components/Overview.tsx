import { Shador } from "@repo/ui"
import { useState } from "react"


export const Overview = () => {
  const [colors] = useState<string[]>([
    'RGB(64, 123, 167)',
    'RGB(170, 204, 102)',
    'RGB(150, 150, 150)',
    'RGB(255, 99, 71)',
    'RGB(255, 182, 193)',
  ])
  const [color, setColor] = useState<string>(colors[0])


  return (
    <div className="wave">
      <div className="wave-ret">
        <Shador color={color} />
      </div>
      <div className="wave-config">
        <label>Color</label>
        <div className="wave-config-color">
          {
            colors.map((c) => (
              <div
                className={[
                  'wave-config-color__item',
                  color === c ? 'wave-config-color__item--active' : ''
                ].join(' ')}
                onClick={() => setColor(c)}
                key={c}
                style={{ backgroundColor: c }}
              ></div>
            ))
          }
        </div>

      </div>
    </div>

  )
}
