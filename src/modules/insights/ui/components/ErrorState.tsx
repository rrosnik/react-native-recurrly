import { SafeAreaView } from '@/components/SafeAreaView'
import { Text } from '@/components/ui/text'
import React from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'

export default function ErrorState() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerClassName='flex-1' refreshControl={<RefreshControl refreshing={true} onRefresh={() => { }} />}>
                <View className='flex-1 items-center justify-center'>
                    <Text variant="h4" className="text-center mb-2 text-foreground ">
                        Failed to load insights
                    </Text>
                    <Text className="text-muted-foreground text-center text-sm">
                        Pull to refresh or restart the app.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}