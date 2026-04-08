import LoadingState from '@/components/LoadingState';
import { onBoardingStore } from '@/modules/onboarding/hooks/useOnBoardingStorage';
import OnBoardingViews from '@/modules/onboarding/ui/views/OnBoardingViews';
import { useRouter } from 'expo-router';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const OnBoardingPage = () => {
    const router = useRouter();
    const { isLoading, setSeen } = useStore(onBoardingStore, useShallow(state => ({
        isLoading: state.isLoading,
        setSeen: state.setSeen,
    })));

    const handleDone = async () => {
        try {
            await setSeen();
        } catch (e) {
            console.error('Failed to set onboarding seen:', e);
        }
        router.replace('/(tabs)');
    };

    if (isLoading) return <LoadingState />;
    return (
        <OnBoardingViews onSkip={handleDone} onComplete={handleDone} />
    );
};

export default OnBoardingPage;