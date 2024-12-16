import { toast } from 'react-toastify';
import { NotificationTypeEnum } from '@/types/notification';

export function getNotification(text: string, type = 'success'): void {
  toast[type as NotificationTypeEnum](text);
}
