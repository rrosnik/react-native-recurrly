import { Input } from '@/components/ui/input';
import React from 'react';

type EmailInputProps = React.ComponentProps<typeof Input>;

export default function EmailInput(props: EmailInputProps) {

    return (
        <Input
            {...props}
            textContentType='emailAddress'
            keyboardType='email-address'
            autoCapitalize="none"
        />
    )
}