import React from 'react';
import type { Notification as NotificationType } from '../../../types/gameTypes';

interface NotificationProps {
  notification: NotificationType | null;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow-2xl text-sm font-semibold ${
      notification.type === 'success' ? 'bg-green-500' :
      notification.type === 'error' ? 'bg-red-500' :
      notification.type === 'breakthrough' ? 'bg-purple-500' : 'bg-blue-500'
    } text-white`}>
      {notification.message}
    </div>
  );
};