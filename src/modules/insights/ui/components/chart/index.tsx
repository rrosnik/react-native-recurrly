import useInsights from '@/modules/insights/hooks/useInsights'
import React, { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import SVG from 'react-native-svg'
import Bar from './Bar'
import HorizontalGridLine from './HorizontalGridLine'





export default function Chart() {
    const { bars } = useInsights();
    const containerRef = React.useRef<View>(null)
    const [show, setShow] = React.useState(false);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    const padding = 20;
    const hlh = 20; // horizontal legend line height
    const vlw = 30; // vertical legend width
    const vgspace = useMemo(() => (height - 3 * padding - hlh) / 4, [height]);
    const barPadding = 20;
    const barWidth = 20;
    const barSpacing = useMemo(() => (width - 2 * barPadding - barWidth - 2 * padding - vlw) / (bars.length - 1), [width, bars.length]);

    // --- Measure the container size on mount to set the SVG dimensions -----------------------------------------------
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure((x, y, w, h) => {
                setWidth(w)
                setHeight(h)
                setShow(true)
            })
        }
    }, []);


    // convert the originate of the circle from top-left to bottom-right
    const X = (x: number) => x;
    const Y = (y: number) => height - y;
    const DX = (x: number) => x + padding + vlw;
    const DY = (y: number) => height - hlh - padding - y;


    console.log(bars)
    return (
        <View ref={containerRef} className='flex-1 h-[30vh] bg-muted items-center justify-center'>
            {
                show && (
                    <SVG viewBox={`0 0 ${width} ${height}`} className='fill-accent'>
                        {
                            Array.from({ length: 5 }).map((_, i) => (
                                <HorizontalGridLine y={DY(i * vgspace)} width={width} textWidth={vlw} padding={padding} text={(Math.round(i * vgspace / 10) * 10).toString()} />

                            ))
                        }
                        {
                            bars.map((bar, i) => (
                                <Bar key={i} height={bar} width={barWidth} x={DX(i * barSpacing + barPadding + barWidth / 2)} y={DY(0)} />
                            ))
                        }
                    </SVG>
                )
            }




        </View>
    )
}