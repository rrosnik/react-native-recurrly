import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ListHeadingProps = {
    title: string;
    actionTitle?: string;
    onActionPress?: () => void;
}

const ListHeading = ({ title, actionTitle = 'View All', onActionPress }: ListHeadingProps) => {
    return (
        <View className='list-head'>
            <Text className='list-title'>{title}</Text>
            {
                actionTitle && onActionPress && (
                    <TouchableOpacity className='list-action' onPress={onActionPress}>
                        <Text className='list-action-text'>{actionTitle}</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default ListHeading;