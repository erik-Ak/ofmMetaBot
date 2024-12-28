import { Telegraf, Context } from 'telegraf';
import { processVideo } from './processor';
import { downloadFile, getFileHash } from '../utils/utils';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const processedFiles: Set<string> = new Set();

const processedFilesPath = path.join(__dirname, '../../processed_files.json');
if (fs.existsSync(processedFilesPath)) {
  const data = fs.readFileSync(processedFilesPath, 'utf-8');
  const ids: string[] = JSON.parse(data);
  ids.forEach((id) => processedFiles.add(id));
}

export const handlers = (bot: Telegraf<Context>) => {
  bot.start(async (ctx) => {
    await ctx.reply('Привет! Отправь мне видео, и я изменю его параметры.');
  });

  bot.help(async (ctx) => {
    await ctx.reply(
      'Отправь мне видео, и я изменю его параметры (яркость, резкость, температура, контраст, гамма).'
    );
  });

  bot.on('video', async (ctx) => {
    const fileId = ctx.message.video.file_id;
    const fileName = ctx.message.video.file_name || 'input_video.mp4';
    const filePath = path.join('/tmp', `${uuidv4()}_${fileName}`);

    try {
      await downloadFile(ctx, fileId, filePath);
      const fileHash = getFileHash(filePath);
      if (processedFiles.has(fileHash)) {
        fs.unlinkSync(filePath);
        await ctx.reply('Этот файл уже был обработан.');
        return;
      }
      processedFiles.add(fileHash);

      fs.writeFileSync(processedFilesPath, JSON.stringify(Array.from(processedFiles)));

      await ctx.reply('Файл получен! Начинаю обработку...');
      const outputPath = path.join('/tmp', `output_${uuidv4()}_${fileName}`);
      await processVideo(filePath, outputPath);
      await ctx.replyWithVideo({ source: fs.createReadStream(outputPath) });
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    } catch (error) {
      console.error('Error processing video:', error);
      await ctx.reply('Произошла ошибка при обработке видео.');
    }
  });
};
