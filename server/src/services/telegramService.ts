import dotenv from 'dotenv';
import { config } from '../config';

export interface TelegramSendResult {
  success: boolean;
  messageId?: number;
  reason?: string;
  error?: string;
}

/**
 * Dynamically resolve the Telegram Bot Token (re-reads .env if needed)
 */
export const getTelegramBotToken = (): string => {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN.trim().length > 0) {
    return process.env.TELEGRAM_BOT_TOKEN.trim();
  }
  // Re-read .env in case user just saved the token
  dotenv.config({ override: true });
  return (process.env.TELEGRAM_BOT_TOKEN || config.TELEGRAM_BOT_TOKEN || '').trim();
};

/**
 * Check if the server has a Telegram Bot Token configured
 */
export const isTelegramConfigured = (): boolean => {
  return getTelegramBotToken().length > 0;
};

/**
 * Send a generic message to a specific Telegram Chat ID
 */
export const sendTelegramMessage = async (
  chatId: string,
  text: string,
  options?: { parse_mode?: 'HTML' | 'Markdown' }
): Promise<TelegramSendResult> => {
  const token = getTelegramBotToken();
  if (!token) {
    console.log('[TelegramService] Telegram bot token not configured in .env. Skipping message.');
    return { success: false, reason: 'BOT_TOKEN_NOT_CONFIGURED' };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text,
        parse_mode: options?.parse_mode || 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = (await response.json()) as any;

    if (!response.ok || !data.ok) {
      console.warn(`[TelegramService] Telegram API error (${response.status}): ${data.description || 'Unknown error'}`);
      return {
        success: false,
        error: data.description || `HTTP ${response.status}`,
      };
    }

    console.log(`[TelegramService] Successfully delivered message to Chat ID ${chatId} (Message ID: ${data.result?.message_id})`);
    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (error: any) {
    console.error(`[TelegramService] Network error sending Telegram message:`, error);
    return {
      success: false,
      error: error.message || 'Network failure communicating with Telegram API',
    };
  }
};

/**
 * Send a formatted reminder alert to a user's Telegram chat
 */
export const sendTelegramReminder = async (
  chatId: string,
  reminder: { id: string; title: string; description?: string | null; remindAt: Date | string }
): Promise<TelegramSendResult> => {
  const formattedTime = new Date(reminder.remindAt).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = [
    `⚡ <b>JARVIS DIRECTIVE ALERT</b> ⚡`,
    ``,
    `📌 <b>Reminder:</b> ${escapeHtml(reminder.title)}`,
    `⏰ <b>Scheduled Time:</b> ${formattedTime}`,
    reminder.description ? `📝 <i>${escapeHtml(reminder.description)}</i>\n` : ``,
    `🤖 <i>Delivered via JARVIS Autonomous Voice & Alert Engine</i>`,
  ].join('\n');

  return sendTelegramMessage(chatId, message, { parse_mode: 'HTML' });
};

/**
 * Send a test / verification alert to confirm the Telegram connection
 */
export const verifyTelegramConnection = async (chatId: string): Promise<TelegramSendResult> => {
  const message = [
    `⚡ <b>JARVIS SYSTEM LINKED</b> ⚡`,
    ``,
    `✅ Your Telegram device is now connected to <b>JARVIS AI Assistant</b>!`,
    `You will receive instant, real-world alerts for all scheduled directives and reminders on this chat.`,
    ``,
    `⏱ <i>Timestamp: ${new Date().toLocaleTimeString()}</i>`,
  ].join('\n');

  return sendTelegramMessage(chatId, message, { parse_mode: 'HTML' });
};

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
