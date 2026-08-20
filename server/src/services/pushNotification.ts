import webpush from 'web-push';
import { prisma } from '../db/prisma';
import { config } from '../config';

// Configure Web Push with VAPID credentials
webpush.setVapidDetails(
  config.VAPID_SUBJECT,
  config.VAPID_PUBLIC_KEY,
  config.VAPID_PRIVATE_KEY
);

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
}

export interface PushSendResult {
  sent: number;
  failed: number;
  total: number;
  reason?: string;
}

/**
 * Send Web Push notification to all registered devices/browsers for a user.
 * Automatically cleans up invalid/expired (404/410) subscriptions.
 */
export const sendPushNotificationToUser = async (
  userId: string,
  payload: PushPayload
): Promise<PushSendResult> => {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      console.log(`[WebPush] User ${userId} has 0 registered push subscriptions.`);
      return { sent: 0, failed: 0, total: 0, reason: 'NO_SUBSCRIPTIONS' };
    }

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/reminders',
      tag: payload.tag || 'jarvis-reminder',
      icon: payload.icon || '/favicon.svg',
      badge: payload.badge || '/favicon.svg',
      data: payload.data || {},
    });

    let sent = 0;
    let failed = 0;

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscriptionObj = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscriptionObj, payloadString, {
            TTL: 86400, // 24 hours
            urgency: 'high',
          });
          return { success: true, id: sub.id };
        } catch (error: any) {
          const statusCode = error.statusCode || error.status;
          console.warn(`[WebPush] Push failed for sub ${sub.id} (Status: ${statusCode}): ${error.message}`);

          // 404 or 410 indicates the subscription has expired or unsubscribed
          if (statusCode === 404 || statusCode === 410) {
            console.log(`[WebPush] Pruning expired subscription ${sub.id} from database.`);
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }

          throw error;
        }
      })
    );

    for (const res of results) {
      if (res.status === 'fulfilled') {
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`[WebPush] Sent ${sent}/${subscriptions.length} push notifications to user ${userId}`);
    return { sent, failed, total: subscriptions.length };
  } catch (error: any) {
    console.error(`[WebPush] Critical error sending push to user ${userId}:`, error);
    return { sent: 0, failed: 0, total: 0, reason: error.message };
  }
};
