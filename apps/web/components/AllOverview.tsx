import { Bits, Cloudy, Distance, Erosion, Gems, Haze, Procedural, Ray, Rivulet, Shador } from "@repo/ui"
import { useRouter } from 'next/router';

export const AllOverview = () => {
    const router = useRouter();
    const libs = [
        {
            name: 'Shador',
            component: Shador,
            url: '/shador'
        },
        {
            name: 'Bits',
            component: Bits,
            url: '/bits'
        },
        {
            name: 'Cloudy',
            component: Cloudy,
            url: '/cloudy'
        },
        {
            name: 'Procedural',
            component: Procedural,
            url: '/procedural'
        },
        {
            name: 'Distance',
            component: Distance,
            url: '/distance'
        },
        {
            name: 'Gems',
            component: Gems,
            url: '/gems'
        },
        {
            name: 'Haze',
            component: Haze,
            url: '/haze'
        },
        {
            name: 'Erosion',
            component: Erosion,
            url: '/erosion'
        },
        {
            name: 'Rivulet',
            component: Rivulet,
            url: '/rivulet'
        },
        {
            name: 'Ray',
            component: Ray,
            url: '/ray'
        },

    ]

    return (
        <div className="wave-all">
            {
                libs.map((lib) => {
                    return (
                        <div key={lib.url} className="wave-item" onClick={() => router.push(`/docs/waves/${lib.url}`)}>
                            <div className="wave-item__view"><lib.component /></div>
                            <span className="wave-item__name">{`<${lib.name} />`} </span>
                        </div>
                    )
                })
            }
        </div>
    )
}
