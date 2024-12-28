import ffmpeg from 'fluent-ffmpeg';

export const processVideo = (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters([
        'eq=brightness=0.1:contrast=1.2:gamma=1.0',
        'unsharp=5:5:1.0'
      ])
      .outputOptions('-c:a copy')
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
};
