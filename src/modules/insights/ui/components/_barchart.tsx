import { colors } from '@/constants/theme';
import { Text, View } from 'react-native';
import { WEEK_DAYS } from '../../hooks/useInsights';

const CHART_H = 140; // height of the bar area
const PILL_SPACE = 40; // space above bars for the floating pill label
const BAR_W = 10; // bar width in dp

export function BarChart({
    bars,
    highlightIndex,
    highlightValue,
}: {
    bars: number[];
    highlightIndex: number;
    highlightValue: string;
}) {
    const maxBar = Math.max(...bars, 1); // avoid divide-by-zero

    return (
        <View className="rounded-2xl bg-muted p-3">
            {/* Bar columns */}
            <View
                style={{ height: CHART_H + PILL_SPACE }}
                className="flex-row justify-between"
            >
                {bars.map((v, i) => {
                    const barH = v > 0 ? Math.max(10, Math.round((v / maxBar) * CHART_H)) : 8;
                    const isHL = i === highlightIndex;

                    return (
                        <View
                            key={i}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                height: CHART_H + PILL_SPACE,
                                justifyContent: 'flex-end',
                            }}
                        >
                            {/* Pill label – only on the highlighted column */}
                            {isHL && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        alignItems: 'center',
                                        zIndex: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: colors.accent,
                                            borderRadius: 20,
                                            paddingHorizontal: 9,
                                            paddingVertical: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 11,
                                                fontWeight: '700',
                                                lineHeight: 14,
                                            }}
                                        >
                                            {highlightValue}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* The bar itself */}
                            <View
                                style={{
                                    height: barH,
                                    width: BAR_W,
                                    borderRadius: 6,
                                    backgroundColor: isHL ? colors.accent : colors.foreground,
                                }}
                            />
                        </View>
                    );
                })}
            </View>

            {/* Day labels */}
            <View className="flex-row justify-between mt-2">
                {WEEK_DAYS.map((day) => (
                    <View key={day} style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{day}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
