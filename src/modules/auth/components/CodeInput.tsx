import { Input } from '@/components/ui/input';
import React from 'react';

type CodeInputProps = React.ComponentProps<typeof Input> & {
    isValid?: boolean;
};

export default function CodeInput({ isValid, ...props }: CodeInputProps) {

    return (
        <Input
            {...props}
            textContentType='oneTimeCode'
            keyboardType='number-pad'
            autoCapitalize="none"
            maxLength={6}
        />
    )
}