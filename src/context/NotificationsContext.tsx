'use client';

import { createContext, useContext, useState } from 'react';

type NotificationsContextType = {
  notifications: string[];
  addNotification: (message: string) => void;
  removeNotifcation: (index: number) =>void;
};

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev]);
  };

  const removeNotifcation = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  }
  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, removeNotifcation }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationsProvider');
  }
  return context;
}