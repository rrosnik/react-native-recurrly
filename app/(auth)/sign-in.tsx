import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const SignIn = () => {
    const router = useRouter();

    router.push("/(tabs)")
    return (
        <View>
            <Text>SignIn</Text>
            <Link href={"/(auth)/sign-up"}>Create Account</Link>
        </View>
    )
}

export default SignIn;