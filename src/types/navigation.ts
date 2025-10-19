// mobile/src/utils/notifications.ts
import * as Notifications from 'expo-notifications';

export const scheduleTransferReminder = async (clientRef: string, step: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'معاملة قيد الانتظار',
      body: `معاملتك ${clientRef} لا تزال في الخطوة ${step}. اضغط لاستئناف العملية.`,
      data: { clientRef, type: 'transfer_reminder' },
    },
    trigger: { seconds: 3600 }, // بعد ساعة
  });
};

export const cancelTransferReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};