import { Telegraf, Context } from 'telegraf';
import fs from 'fs';
import fetch from 'node-fetch';
import crypto from 'crypto';

export const downloadFile = async (
  ctx: Context,
  fileId: string,
  filePath: string
): Promise<void> => {
  const fileLink = await ctx.telegram.getFileLink(fileId);
  const response = await fetch(fileLink.href);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  const buffer = await response.buffer();
  fs.writeFileSync(filePath, buffer);
};

export const getFileHash = (filePath: string): string => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

export const setWebhook = async (
  bot: Telegraf<Context>,
  webhookUrl: string
): Promise<void> => {
  await bot.telegram.setWebhook(webhookUrl);
};