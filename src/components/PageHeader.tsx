import { cn } from '@/lib/utils'
import { ChevronLeftIcon, MoreHorizontalIcon } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { Button } from './ui/button'
import { Icon } from './ui/icon'


type ActionIconProps = {
    icon: React.ComponentProps<typeof Icon>['as'];
}
const ActionIcon: React.FC<React.ComponentProps<typeof Button> & ActionIconProps> = ({ icon, ...props }) => {
    return (
        <Button variant={"outline"} className='border border-gray-400 size-14 rounded-full items-center justify-center' {...props}>
            <Icon as={icon} size={30} className='text-muted-foreground' />
        </Button>
    )
}

type PageHeaderProps = {
    title: string;
}

export default function PageHeader({ title, className, ...props }: React.ComponentProps<typeof View> & PageHeaderProps) {
    return (
        <View  {...props} className={cn('flex-row items-center justify-between', className)}>
            <ActionIcon icon={ChevronLeftIcon} />
            <View>
                <Text className='text-2xl font-bold text-foreground'>{title}</Text>
            </View>
            <ActionIcon icon={MoreHorizontalIcon} />
        </View >
    )
}