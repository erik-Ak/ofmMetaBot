import { defineEventHandler, readBody } from 'h3';
import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import { handlers } from '../bot/handlers';
import { setWebhook } from '../utils/utils';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!BOT_TOKEN || !WEBHOOK_URL) {
  throw new Error('BOT_TOKEN and WEBHOOK_URL must be set in .env');
}

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const bot = new Telegraf<Context>(BOT_TOKEN);

handlers(bot);

setWebhook(bot, WEBHOOK_URL);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await bot.handleUpdate(body);
  return { status: 'ok' };
});
