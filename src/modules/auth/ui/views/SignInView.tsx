import { SafeAreaView } from '@/components/SafeAreaView'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputDesc } from '@/components/ui/input-description'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import EmailInput from '@/modules/auth/components/EmailInput'
import PasswordInput from '@/modules/auth/components/PasswordInput'
import { useLogin } from '@/modules/auth/hooks/useLogin'
import { signInSchema, verifyCodeSchema } from '@/modules/auth/schema.ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from 'expo-router'
import { CircleAlert } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function SignInView() {
    const { login, error, isFetching, status, reset, resendCode, verifyCode } = useLogin();

    const form = useForm({
        defaultValues: {
            emailAddress: "",
            password: ""
        },
        resolver: zodResolver(signInSchema)
    });

    const otpForm = useForm({
        defaultValues: {
            code: ""
        },
        resolver: zodResolver(verifyCodeSchema)
    });


    if (status === 'needs_client_trust') {
        return (
            <View>
                <Text >
                    Verify your account
                </Text>

                <Controller
                    name='code'
                    control={otpForm.control}
                    rules={{
                        required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <View className='gap-2'>
                            <Label htmlFor='code-id' className='text-base font-sans-semibold'>Verification code</Label>
                            <Input
                                value={field.value}
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="Enter your verification code"
                                placeholderTextColor="#666666"
                                keyboardType="numeric"
                                className='border border-[#ccc] rounded-lg p-3 text-base bg-white'

                            />
                        </View>
                    )}
                />


                <Button
                    onPress={otpForm.handleSubmit(({ code }) => verifyCode(code))}
                    disabled={isFetching}
                    className={cn(
                        "bg-accent h-14 rounded-2xl mt-2",
                        "active:bg-accent active:opacity-70"
                    )}
                >
                    <Text className="text-white font-sans-semibold text-lg">Verify</Text>
                </Button>
                <Button
                    onPress={() => resendCode()}
                    className={cn(
                        "bg-transparent h-14 rounded-2xl mt-2",
                        "active:bg-transparent active:opacity-70"
                    )}
                >
                    <Text className='text-[#0a7ea4] font-sans-semibold'>I need a new code</Text>
                </Button>
                <Button
                    onPress={() => reset()}
                    className={cn(
                        "bg-transparent h-14 rounded-2xl mt-2",
                        "active:bg-transparent active:opacity-70"
                    )}
                >
                    <Text className='text-[#0a7ea4] font-sans-semibold'>Start over</Text>
                </Button>
            </View>
        )
    }


    return (
        <ScrollView className='flex-1 bg-background'>
            <SafeAreaView className='flex-1 bg-background gap-12 p-5'>
                <View className='flex-row gap-2 justify-center mt-10'>
                    <View className='bg-accent size-18 rounded-tr-4xl rounded-bl-4xl justify-center items-center'>
                        <Text className='text-white text-4xl font-sans-bold'>R</Text>
                    </View>
                    <View className='justify-center gap-1.5'>
                        <Text className='font-sans-bold text-3xl'>Recurrly</Text>
                        <Text className='text-lg uppercase text-muted-foreground'>Smart Billing</Text>
                    </View>
                </View>

                <View className='items-center gap-3'>
                    <Text className='text-2xl font-bold'>Welcome back</Text>
                    <Text className='text-center text-muted-foreground text-lg text-balance'>Sign in to continue manging your subscription</Text>
                </View>
                <View className='gap-5'>
                    <Card >
                        <CardContent className='gap-5'>
                            <Controller
                                control={form.control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                    <View className='gap-2'>
                                        <Label htmlFor='email-id' className='text-base font-sans-semibold'>Email</Label>
                                        <EmailInput
                                            id='email-id'
                                            placeholder="First name"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        {error && <InputDesc variant={"destructive"}>{error.message}</InputDesc>}
                                    </View>
                                )}
                                name="emailAddress"
                            />

                            <Controller
                                control={form.control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                    <View className='gap-2'>
                                        <Label htmlFor='password-id' className='text-base font-sans-semibold'>Password</Label>
                                        <PasswordInput
                                            id='password-id'
                                            placeholder="Enter password"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        {error && <InputDesc variant={"destructive"}>{error.message}</InputDesc>}
                                    </View>
                                )}
                                name="password"
                            />

                            {error && (
                                <Alert icon={CircleAlert} variant={"destructive"} className='border-destructive'>
                                    <AlertTitle>Error!</AlertTitle>
                                    <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onPress={form.handleSubmit(login)}
                                disabled={!form.formState.isValid || isFetching}
                                variant={"accent"}
                            >
                                <Text className="">Continue</Text>
                            </Button>
                        </CardContent>
                    </Card>
                    <View className='flex-row gap-1 justify-center'>
                        <Text>Don't have an account? </Text>
                        <Link href="/(auth)/sign-up">
                            <Text className='text-accent'>Sign up</Text>
                        </Link>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({


    button: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },





})