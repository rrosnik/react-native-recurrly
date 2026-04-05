import { icons } from '@/constants/icons';
import { posthog } from '@/modules/posthog/config';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (subscription: Subscription) => void;
}

type Frequency = 'Monthly' | 'Yearly';

const CATEGORIES = ['Entertainment', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'Cloud', 'Music', 'Other'] as const;

const CATEGORY_COLORS: Record<string, string> = {
    'Entertainment': '#ff6b6b',
    'AI Tools': '#b8d4e3',
    'Developer Tools': '#e8def8',
    'Design': '#f5c542',
    'Productivity': '#a8e6cf',
    'Cloud': '#a8d8ff',
    'Music': '#c9b1e6',
    'Other': '#d4c5b9',
};

export default function CreateSubscriptionModal({ visible, onClose, onSubmit }: CreateSubscriptionModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('Monthly');
    const [category, setCategory] = useState<typeof CATEGORIES[number]>('Other');
    const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

    const validateForm = () => {
        const newErrors: { name?: string; price?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Subscription name is required';
        }

        const priceNum = parseFloat(price);
        if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const now = dayjs();
        const renewalDate = frequency === 'Monthly'
            ? now.add(1, 'month').toISOString()
            : now.add(1, 'year').toISOString();

        const subscription: Subscription = {
            id: `sub_${Date.now()}`,
            name: name.trim(),
            price: parseFloat(price),
            category: category,
            status: 'active',
            startDate: now.toISOString(),
            renewalDate: renewalDate,
            icon: icons.wallet,
            billing: frequency,
            color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'],
            currency: 'USD',
        };

        onSubmit(subscription);

        posthog.capture("subscription_created", {
            subscription_name: name,
            subscription_price: parseFloat(price),
            subscription_category: category,
            subscription_frequency: frequency,
        });

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setFrequency('Monthly');
        setCategory('Other');
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const isFormValid = name.trim() && price.trim() && !isNaN(parseFloat(price)) && parseFloat(price) > 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            presentationStyle="overFullScreen"
            onRequestClose={handleClose}
            
        >
            <View className="modal-overlay">
                <Pressable
                    className="flex-1"
                    onPress={handleClose}
                />

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="modal-container">
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
                            <View className="auth-field">
                                <Text className="auth-label">Subscription Name</Text>
                                <TextInput
                                    className={clsx(
                                        'auth-input',
                                        errors.name && 'auth-input-error'
                                    )}
                                    placeholder="e.g., Netflix"
                                    value={name}
                                    onChangeText={setName}
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                />
                                {errors.name && <Text className="auth-error">{errors.name}</Text>}
                            </View>

                            {/* Price Field */}
                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    className={clsx(
                                        'auth-input',
                                        errors.price && 'auth-input-error'
                                    )}
                                    placeholder="e.g., 9.99"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="decimal-pad"
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                />
                                {errors.price && <Text className="auth-error">{errors.price}</Text>}
                            </View>

                            {/* Frequency Toggle */}
                            <View className="auth-field">
                                <Text className="auth-label">Billing Frequency</Text>
                                <View className="picker-row">
                                    {(['Monthly', 'Yearly'] as const).map((freq) => (
                                        <Pressable
                                            key={freq}
                                            onPress={() => setFrequency(freq)}
                                            className={clsx(
                                                'picker-option',
                                                frequency === freq && 'picker-option-active'
                                            )}
                                        >
                                            <Text
                                                className={clsx(
                                                    'picker-option-text',
                                                    frequency === freq && 'picker-option-text-active'
                                                )}
                                            >
                                                {freq}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Category Chips */}
                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {CATEGORIES.map((cat) => (
                                        <Pressable
                                            key={cat}
                                            onPress={() => setCategory(cat)}
                                            className={clsx(
                                                'category-chip',
                                                category === cat && 'category-chip-active'
                                            )}
                                        >
                                            <Text
                                                className={clsx(
                                                    'category-chip-text',
                                                    category === cat && 'category-chip-text-active'
                                                )}
                                            >
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Submit Button */}
                            <Pressable
                                onPress={handleSubmit}
                                disabled={!isFormValid}
                                className={clsx(
                                    'auth-button',
                                    !isFormValid && 'auth-button-disabled'
                                )}
                            >
                                <Text className="auth-button-text">Create Subscription</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
