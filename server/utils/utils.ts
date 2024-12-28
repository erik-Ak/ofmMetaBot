import { Telegraf, Context } from 'telegraf';
import fs from 'fs';
import fetch from 'node-fetch';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
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
