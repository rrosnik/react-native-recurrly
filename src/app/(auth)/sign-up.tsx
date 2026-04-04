import { SafeAreaView } from '@/components/SafeAreaView'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InputDesc } from '@/components/ui/input-description'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'
import CodeInput from '@/modules/auth/components/CodeInput'
import EmailInput from '@/modules/auth/components/EmailInput'
import PasswordInput from '@/modules/auth/components/PasswordInput'
import { useSignup } from '@/modules/auth/hooks/useSignup'
import { signUpSchema, verifyCodeSchema } from '@/modules/auth/schema.ts'
import { useAuth } from '@clerk/expo'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { CircleAlert } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

export default function Page() {
    const { isSignedIn } = useAuth()
    const { signUp, error, isFetching, status, reset, resendCode, verifyCode } = useSignup()
    const router = useRouter()


    const signupForm = useForm({
        defaultValues: {
            emailAddress: '',
            password: '',
        },
        resolver: zodResolver(signUpSchema)
    });
    const verifyForm = useForm({
        defaultValues: {
            code: '',
        },
        resolver: zodResolver(verifyCodeSchema)
    });



    if (status === 'verifyEmailCode') {
        return (
            <ScrollView className='flex-1 bg-background'>
                <SafeAreaView className='flex-1 bg-background gap-12 p-5'>
                    <View className='flex-row gap-2 justify-center mt-10'>
                        <View className='bg-accent size-18 rounded-tr-4xl rounded-bl-4xl justify-center items-center'>
                            <Text className='text-white text-4xl font-sans-bold'>R</Text>
                        </View>
                        <View className='justify-center gap-1.5'>
                            <Text className='font-sans-bold text-3xl'>Recurrly</Text>
                            <Text className='text-sm uppercase text-muted-foreground'>Subscriptions</Text>
                        </View>
                    </View>

                    <View className='items-center gap-3'>
                        <Text className='text-2xl font-bold'>Verify your email</Text>
                        <Text className='text-center text-muted-foreground text-lg text-balance'>Enter the verification code sent to {signupForm.getValues().emailAddress}</Text>
                    </View>
                    <Card className='max-w-lg w-full mx-auto'>
                        <CardContent>
                            <Controller
                                name='code'
                                control={verifyForm.control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field, fieldState: { error, } }) => (
                                    <View className='gap-2'>
                                        <Label htmlFor='code-id' className='text-base font-sans-semibold'>Verification code</Label>
                                        <CodeInput
                                            id='code-id'
                                            placeholder="Enter verification code"
                                            onBlur={field.onBlur}
                                            onChangeText={field.onChange}
                                            value={field.value}
                                            aria-invalid={!!error}
                                            isValid={error ? false : undefined}
                                        />
                                        {error && <InputDesc variant={"destructive"}>{error.message}</InputDesc>}
                                    </View>
                                )}
                            />
                            <View className='flex-row gap-1 items-center'>
                                <Text className='text-sm text-muted-foreground'>Didn't receive the code?</Text>
                                <Button
                                    variant={'link'}
                                    className='text-accent'
                                    onPress={() => resendCode()}
                                >
                                    <Text>Resend</Text>
                                </Button>
                            </View>
                             {error && (
                                <Alert icon={CircleAlert} variant={"destructive"} className='border-destructive'>
                                    <AlertTitle>Error!</AlertTitle>
                                    <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                            )}
                            <Button
                                onPress={verifyForm.handleSubmit((data) => verifyCode(data.code))}
                                disabled={!verifyForm.formState.isValid || isFetching}
                                variant={"accent"}
                            >
                                <Text className="">Verify</Text>

                            </Button>
                            <Button
                                onPress={() => reset()}
                                variant={"ghost"}
                                className='mt-2'
                            >
                                <Text className="">Cancel</Text>

                            </Button>
                        </CardContent>
                    </Card>
                </SafeAreaView>
            </ScrollView >
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
                        <Text className='text-sm uppercase text-muted-foreground'>Subscriptions</Text>
                    </View>
                </View>

                <View className='items-center gap-3'>
                    <Text className='text-2xl font-bold'>Create your account</Text>
                    <Text className='text-center text-muted-foreground text-lg text-balance'>Start tracking your subscriptions and never miss a payment</Text>
                </View>
                <View className='gap-5'>
                    <Card className='max-w-lg w-full mx-auto'>
                        <CardContent className='gap-5'>
                            <Controller
                                name="emailAddress"
                                control={signupForm.control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
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
                            />

                            <Controller
                                name="password"
                                control={signupForm.control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
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
                            />


                            {error && (
                                <Alert icon={CircleAlert} variant={"destructive"} className='border-destructive'>
                                    <AlertTitle>Error!</AlertTitle>
                                    <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onPress={signupForm.handleSubmit(signUp)}
                                disabled={!signupForm.formState.isValid || isFetching}
                                variant={"accent"}
                            >
                                <Text className="">Sign up</Text>
                            </Button>


                        </CardContent>
                    </Card>
                    <View className='flex-row items-center justify-center'>
                        <Text>Already have an account? </Text>
                        <Link href="/sign-in">
                            <Text className='text-accent'>Sign in</Text>
                        </Link>
                    </View>
                </View>
                <View nativeID="clerk-captcha" />

            </SafeAreaView>
        </ScrollView>
    )
}
