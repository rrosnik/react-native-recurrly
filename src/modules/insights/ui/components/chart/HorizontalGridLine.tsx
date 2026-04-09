import { styled } from 'nativewind';
import React from 'react';
import { Line, Text } from 'react-native-svg';

type Props = {
    y: number
    width: number
    textWidth: number
    padding: number
    text: string
}

const StyledLine = styled(Line);

export default function HorizontalGridLine({ y, width, textWidth, padding, text }: Props) {
    return (
        <>
            {/* @ts-ignore */}
            <StyledLine x1={0 + padding + textWidth} y1={y} x2={width - padding} y2={y} strokeDasharray={[5, 5]} className="stroke-primary/10 stroke-2" />
            {/* <Rect x={padding} y={y - padding} width={textWidth + padding} height={20}  /> */}
            {/* @ts-ignore */}
            <Text x={padding} y={y} className="fill-purple-400">{text}</Text>
        </>
    )
}