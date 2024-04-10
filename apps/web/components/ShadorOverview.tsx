import { Shador } from "@repo/ui"
import { useState } from "react"
import { Radio } from 'antd';


export const ShadorOverview = () => {
  const [colors] = useState<string[]>([
    'rgb(103, 28, 215)',
    'RGB(170, 204, 102)',
    'RGB(150, 150, 150)',
    'RGB(255, 99, 71)',
    'RGB(255, 182, 193)',
  ])
  const [luminances] = useState<number[]>([0.1, 0.3, 0.5, 0.7, 0.9])
  const [amplitudes] = useState<number[]>([0.1, 0.3, 0.5, 0.7, 0.9])
  const [color, setColor] = useState<string>(colors[0])
  const [luminance, setLuminance] = useState<number>(luminances[2])
  const [amplitude, setAmplitude] = useState<number>(amplitudes[1])


  return (
    <div className="wave">
      <div className="wave-ret">
        <Shador color={color} luminance={luminance} amplitude={amplitude} />
      </div>
      {/* <div className="wave-config">
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

      <div className="wave-config">
        <label>Luminance</label>
        <div className="wave-config-color">
          <Radio.Group
            value={luminance}
            onChange={(e) => setLuminance(Number(e.target.value))}
            buttonStyle="solid"
            style={{ width: '100%' }}
          >
            {
              luminances.map((c) => (
                <Radio.Button value={c} key={c}>{c}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
      </div>

      <div className="wave-config">
        <label>Amplitude</label>
        <div className="wave-config-color">
          <Radio.Group
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            buttonStyle="solid"
            style={{ width: '100%' }}
          >
            {
              amplitudes.map((c) => (
                <Radio.Button value={c} key={c}>{c}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
      </div> */}
    </div>

  )
}
