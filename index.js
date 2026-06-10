const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('8996142007:AAHx1NhnirVOBHo-xP2GTGoz5CuzJl5mrDY');

bot.start((ctx) => {
  ctx.reply(
    'Что там ДИ 👋 Пашалим?!',
    Markup.inlineKeyboard([
      Markup.button.webApp(
        'GO BRO!',
        'https://roothat-admin.github.io/good_exam/'
      )
    ])
  );
});

bot.launch();
console.log('Bot started');