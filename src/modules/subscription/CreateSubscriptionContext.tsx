import React, { createContext, useState, ReactNode } from 'react';

interface CreateSubscriptionContextType {
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  onSubmit: (subscription: Subscription) => void;
  setOnSubmit: (callback: (subscription: Subscription) => void) => void;
}

export const CreateSubscriptionContext = createContext<CreateSubscriptionContextType | undefined>(undefined);

export const CreateSubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [onSubmit, setOnSubmit] = useState<(subscription: Subscription) => void>(() => {});

  return (
    <CreateSubscriptionContext.Provider
      value={{
        isModalVisible,
        openModal: () => setIsModalVisible(true),
        closeModal: () => setIsModalVisible(false),
        onSubmit,
        setOnSubmit,
      }}
    >
      {children}
    </CreateSubscriptionContext.Provider>
  );
};

export const useCreateSubscription = () => {
  const context = React.useContext(CreateSubscriptionContext);
  if (!context) {
    throw new Error('useCreateSubscription must be used within CreateSubscriptionProvider');
  }
  return context;
};
