import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { z } from 'zod';
import {
  isTelegramConfigured,
  verifyTelegramConnection,
  sendTelegramMessage,
} from '../services/telegramService';

const settingsSchema = z.object({
  telegramChatId: z.string().trim().optional().nullable(),
  telegramEnabled: z.boolean(),
});

const testSchema = z.object({
  telegramChatId: z.string().trim().optional(),
});

export const telegramController = {
  /**
   * Get the current user's Telegram integration settings & bot status
   */
  async getStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const preference = await prisma.userPreference.findUnique({
        where: { userId },
      });

      res.json({
        data: {
          isBotConfigured: isTelegramConfigured(),
          telegramChatId: preference?.telegramChatId || '',
          telegramEnabled: preference?.telegramEnabled || false,
        },
      });
    } catch (error) {
      console.error('[TelegramController] Error fetching status:', error);
      res.status(500).json({ error: { message: 'Failed to fetch Telegram settings' } });
    }
  },

  /**
   * Update the user's Telegram Chat ID and notification toggle
   */
  async updateSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const { telegramChatId, telegramEnabled } = settingsSchema.parse(req.body);

      const preference = await prisma.userPreference.upsert({
        where: { userId },
        update: {
          telegramChatId: telegramChatId || null,
          telegramEnabled,
        },
        create: {
          userId,
          telegramChatId: telegramChatId || null,
          telegramEnabled,
        },
      });

      console.log(`[TelegramController] Updated Telegram settings for user ${userId}: ChatId=${telegramChatId}, Enabled=${telegramEnabled}`);
      res.json({
        data: {
          success: true,
          telegramChatId: preference.telegramChatId,
          telegramEnabled: preference.telegramEnabled,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      console.error('[TelegramController] Error updating settings:', error);
      res.status(500).json({ error: { message: 'Failed to update Telegram settings' } });
    }
  },

  /**
   * Send an immediate test message to the specified (or saved) Telegram chat ID
   */
  async sendTest(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      if (!isTelegramConfigured()) {
        return res.status(400).json({
          error: {
            message: 'TELEGRAM_BOT_TOKEN is not configured in server/.env. Please provide a bot token first.',
          },
        });
      }

      const body = testSchema.parse(req.body);
      let targetChatId = body.telegramChatId;

      if (!targetChatId) {
        const preference = await prisma.userPreference.findUnique({ where: { userId } });
        targetChatId = preference?.telegramChatId || undefined;
      }

      if (!targetChatId) {
        return res.status(400).json({
          error: { message: 'Please enter a valid Telegram Chat ID before testing.' },
        });
      }

      const result = await verifyTelegramConnection(targetChatId);

      if (!result.success) {
        return res.status(400).json({
          error: {
            message: result.error || 'Failed to deliver Telegram message. Please check your Chat ID and make sure you started the bot.',
          },
        });
      }

      res.json({
        data: {
          success: true,
          messageId: result.messageId,
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      console.error('[TelegramController] Error sending test alert:', error);
      res.status(500).json({ error: { message: error.message || 'Failed to send test Telegram alert' } });
    }
  },
};
