import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { useDeleteSubscription } from './useSubscriptionQueries';

export const useCancelSubscription = () => {

    const { mutateAsync, isPending } = useDeleteSubscription();
    const [open, setOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);


    const onCancelSubscription = async (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setOpen(true);
    };



    return {
        cancelSubscription: onCancelSubscription,
        CancelDialog: () => {

            const handleConfirm = async () => {
                if (!selectedSubscription) return;
                try {
                    await mutateAsync(selectedSubscription.id);
                } catch (e) {
                    // swallow - upstream error handling can show a toast
                } finally {
                    setOpen(false);
                    setSelectedSubscription(null);
                }
            };

            return (
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent className='rounded-4xl'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {selectedSubscription ? `Cancel ${selectedSubscription.name}?` : 'Cancel subscription'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {selectedSubscription ? (
                                    <>
                                        <Text className='mt-3 text-muted-foreground text-left'>
                                            This action cannot be undone. Whether you will retain access until the end of the current billing period or not depends on the subscription terms.
                                        </Text>
                                    </>
                                ) : (
                                    <Text>This action cannot be undone. This will remove the subscription from your list.</Text>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='mt-5'>
                            <AlertDialogCancel>
                                <Text>Keep subscription</Text>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild onPress={handleConfirm} disabled={isPending} className='bg-destructive active:bg-destructive/80  rounded-full'>
                                <Button>

                                    <Text className='text-white font-sans-bold'>{isPending ? 'Cancelling…' : 'Cancel subscription'}</Text>
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        }
    }


}