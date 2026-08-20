import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { config } from '../config';
import { z } from 'zod';
import { sendPushNotificationToUser } from '../services/pushNotification';

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  }),
  userAgent: z.string().optional(),
});

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

export const pushController = {
  /**
   * Return VAPID Public Key so frontend can subscribe with PushManager
   */
  async getPublicKey(req: Request, res: Response) {
    res.json({
      data: {
        publicKey: config.VAPID_PUBLIC_KEY,
      },
    });
  },

  /**
   * Register or update a browser push subscription for the authenticated user
   */
  async subscribe(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const { subscription, userAgent } = subscribeSchema.parse(req.body);

      const savedSub = await prisma.pushSubscription.upsert({
        where: { endpoint: subscription.endpoint },
        update: {
          userId,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent: userAgent || req.headers['user-agent'] || null,
        },
        create: {
          userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent: userAgent || req.headers['user-agent'] || null,
        },
      });

      console.log(`[PushController] Saved push subscription ${savedSub.id} for user ${userId}`);
      res.status(201).json({ data: { success: true, id: savedSub.id } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid subscription payload', details: error.errors } });
      }
      console.error('[PushController] Subscribe error:', error);
      res.status(500).json({ error: { message: 'Failed to save push subscription' } });
    }
  },

  /**
   * Remove a push subscription when user disables notifications or browser unsubscribes
   */
  async unsubscribe(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const { endpoint } = unsubscribeSchema.parse(req.body);

      await prisma.pushSubscription.deleteMany({
        where: {
          endpoint,
          userId,
        },
      });

      console.log(`[PushController] Removed push subscription for endpoint: ${endpoint}`);
      res.json({ data: { success: true } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid payload', details: error.errors } });
      }
      console.error('[PushController] Unsubscribe error:', error);
      res.status(500).json({ error: { message: 'Failed to remove push subscription' } });
    }
  },

  /**
   * Send an immediate test notification to verify device push
   */
  async sendTest(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const result = await sendPushNotificationToUser(userId, {
        title: 'JARVIS System Test',
        body: 'Device-level Web Push is active and functioning properly.',
        url: '/reminders',
        tag: 'jarvis-test-notification',
      });

      res.json({ data: { success: true, result } });
    } catch (error) {
      console.error('[PushController] Test notification error:', error);
      res.status(500).json({ error: { message: 'Failed to send test push' } });
    }
  },
};
