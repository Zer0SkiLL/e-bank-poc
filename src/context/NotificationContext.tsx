import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  dismissable?: boolean;
  timestamp: number;
}

export interface ShowNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  dismissable?: boolean;
}

export interface NotificationContextValue {
  notifications: Notification[];
  show: (params: ShowNotificationParams) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
  isVisible: boolean;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const DEFAULT_DURATION = 4000;
const MAX_NOTIFICATIONS = 5;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const show = useCallback((params: ShowNotificationParams): string => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const notification: Notification = {
      id,
      type: params.type,
      title: params.title,
      message: params.message,
      duration: params.duration ?? DEFAULT_DURATION,
      dismissable: params.dismissable ?? true,
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      const updated = [notification, ...prev];
      return updated.length > MAX_NOTIFICATIONS ? updated.slice(0, MAX_NOTIFICATIONS) : updated;
    });

    const duration = notification.duration ?? DEFAULT_DURATION;
    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
        timersRef.current.delete(id);
      }, duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  const value: NotificationContextValue = {
    notifications,
    show,
    dismiss,
    clearAll,
    isVisible: notifications.length > 0,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
