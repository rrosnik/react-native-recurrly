import { Input } from '@/components/ui/input';
import { InputDesc } from '@/components/ui/input-description';
import { icons } from '@/constants/icons';
import { posthog } from '@/lib/posthog/config';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useCreateSubscription } from '../../hooks/useSubscriptionQueries';
import { subscriptionFormSchema } from '../../schema';
import { Subscription_Form } from '../../types';

interface CreateSubscriptionModalProps {
  onClose: () => void;
}

type Frequency = 'Monthly' | 'Yearly';

const CATEGORIES = ['Entertainment', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'Cloud', 'Music', 'Other'] as const;

const CATEGORY_COLORS: Record<Subscription_Insert["category"], string> = {
  'Entertainment': '#ff6b6b',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  'Design': '#f5c542',
  'Productivity': '#a8e6cf',
  'Cloud': '#a8d8ff',
  'Music': '#c9b1e6',
  'Other': '#d4c5b9',
};
export default function SubscriptionCreateView({ onClose }: CreateSubscriptionModalProps) {
  const { error, mutateAsync: createSubscription } = useCreateSubscription();

  const form = useForm({
    defaultValues: { name: "", price: "", category: undefined, billing: undefined },
    resolver: zodResolver(subscriptionFormSchema)
  })



  const handleSubmit = form.handleSubmit((data) => {

    const now = dayjs();
    const renewalDate = data.billing === 'Monthly'
      ? now.add(1, 'month').toISOString()
      : now.add(1, 'year').toISOString();

    const subscription: Subscription_Insert = {
      name: data.name?.trim(),
      price: parseFloat(data.price),
      category: data.category,
      renewalDate: renewalDate,
      billing: data.billing,
      status: 'active',
      startDate: now.toISOString(),
      icon: icons.wallet,
      color: CATEGORY_COLORS[data.category] || CATEGORY_COLORS['Other'],
      currency: 'CAD',
    };


    createSubscription(subscription).then(createdSubscription => {
      console.log("Created Subscription:", createdSubscription);
      posthog.capture("subscription_created", {
        subscription_name: data.name,
        subscription_price: parseFloat(data.price),
        subscription_category: data.category,
        subscription_frequency: data.billing,
      });
      resetForm();
      onClose();
    }).catch(err => {
      console.error("Error creating subscription:", err);
    });



  });

  const resetForm = () => {
    form.reset({ name: "", price: "", category: undefined, billing: undefined });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };



  console.log("Form Errors:", form.getValues());
  return (
    <View className="flex-1 bg-background" >
      <KeyboardAvoidingView behavior="padding" className="flex-1" >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable onPress={handleClose} className="modal-close">
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View className="modal-body">
            {/* Name Field */}
            <Controller
              control={form.control}
              name="name"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                return (<View className="auth-field">
                  <Text className="auth-label">Subscription Name</Text>
                  <Input
                    isvalid={error ? false : undefined}
                    placeholder="e.g., Netflix"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {error && <InputDesc variant={"destructive"}>{error.message}</InputDesc>}
                </View>
                )
              }}

            />
            {/* Price Field */}
            <Controller
              control={form.control}
              name="price"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                return (
                  <View className="auth-field">
                    <Text className="auth-label">Price</Text>
                    <Input
                      placeholder="e.g., 9.99"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                    />
                    {error && <InputDesc variant={"destructive"}>{error.message}</InputDesc>}
                  </View>
                )
              }}
            />

            {/* Frequency Toggle */}
            <Controller
              control={form.control}
              name="billing"
              render={({ field: { value, onChange }, fieldState: { error, invalid, isTouched } }) => {
                return (<View className="auth-field">
                  <Text className="auth-label">Billing Frequency</Text>
                  <Text className="text-sm text-muted-foreground">Select a billing frequency for your subscription.</Text>
                  {invalid && isTouched && <InputDesc variant={"destructive"}>{error?.message}</InputDesc>}
                  <View className="picker-row">
                    {(['Monthly', 'Yearly'] as Subscription_Form["billing"][]).map((freq) => (
                      <Pressable
                        key={freq}
                        onPress={() => onChange(value === freq ? undefined : freq)}
                        className={clsx(
                          'picker-option',
                          value === freq && 'picker-option-active'
                        )}
                      >
                        <Text
                          className={clsx(
                            'picker-option-text',
                            value === freq && 'picker-option-text-active'
                          )}
                        >
                          {freq}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>)
              }}
            />
            {/* Category Chips */}
            <Controller
              control={form.control}
              name="category"
              render={({ field: { value, onChange }, fieldState: { error, invalid, isTouched, } }) => {
                return (<View className="gap-2">
                  <Text className="auth-label">Category</Text>
                  <Text className="text-sm text-muted-foreground">Select a category that best fits your subscription.</Text>
                  {invalid && isTouched && <InputDesc variant={"destructive"}>{error?.message}</InputDesc>}
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => onChange(value === cat ? null : cat)}
                        className={clsx(
                          'category-chip',
                          value === cat && 'category-chip-active'
                        )}
                      >
                        <Text
                          className={clsx(
                            'category-chip-text',
                            value === cat && 'category-chip-text-active'
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>)
              }}

            />


            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={!form.formState.isValid}
              className={clsx(
                'auth-button',
                !form.formState.isValid && 'auth-button-disabled'
              )}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View >
  )
}