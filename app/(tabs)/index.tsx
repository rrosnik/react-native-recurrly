import "@/app/global.css";
import { SafeAreaView } from '@/components/SafeAreaView';
import { Link } from 'expo-router';
import { Text } from "react-native";



export default function App() {
  return (
    <SafeAreaView className='flex-1 bg-background p-5'>
      <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link href="/onboarding" className='mt-4 font-sans-bold rounded-xl bg-primary text-white p-4'>
        Go to Onboarding
      </Link>

      <Link href="/(auth)/sign-in" className='mt-4 font-sans-bold rounded-xl bg-primary text-white p-4'>
        Go to Sign in
      </Link>

      <Link href="/(auth)/sign-up" className='mt-4 font-sans-bold rounded-xl bg-primary text-white p-4'>
        Go to Sign up
      </Link>


    </SafeAreaView>
  );
}