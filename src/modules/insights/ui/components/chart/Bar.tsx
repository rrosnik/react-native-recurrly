import { colors } from '@/constants/theme'
import React, { useEffect } from 'react'
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated'

import { Rect } from "react-native-svg"

type Props = {
    height: number
    width: number
    x: number
    y: number
    borderRadius?: number
}

const AnimatedRect = Animated.createAnimatedComponent(Rect)

export default function Bar({ height, width, x, y, borderRadius = 10 }: Props) {
    const animatedHeight = useSharedValue(0)

    const animatedProps = useAnimatedProps(() => {
        return {
            height: animatedHeight.value,
            y: y - animatedHeight.value
        }
    })

    useEffect(() => {
        animatedHeight.value = withSpring(height, { stiffness: 50 })
    }, [])

    return (
        <AnimatedRect animatedProps={animatedProps} width={width} x={x - width / 2} fill={colors.primary} rx={borderRadius} ry={borderRadius} />
    )
}