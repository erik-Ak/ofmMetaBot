export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      botToken: process.env.BOT_TOKEN,
      webhookUrl: process.env.WEBHOOK_URL
    }
  },
  serverHandlers: [
    { route: '/api/telegram', handler: '~/server/api/telegram.ts' }
  ]
});
