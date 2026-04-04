import { Input } from '@/components/ui/input';
import React from 'react';

type PasswordInputProps = React.ComponentProps<typeof Input>;

export default function PasswordInput(props: PasswordInputProps) {

    return (
        <Input
            {...props}
            textContentType='password'
            secureTextEntry={true}
            autoCapitalize="none"
        />
    )
}
