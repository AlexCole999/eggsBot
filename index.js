const Telegraf = require('telegraf')
const { Extra, Markup, Stage, session } = Telegraf
const https = require('https');
const config = require('config')
const axios = require('axios');
const SceneGenerator = require('./Scenes')
const { Client } = require('pg');

const bot = new Telegraf(config.get('token'), {
  telegram: {
    agent: new https.Agent({ keepAlive: false }),
  },
})

const curScene = new SceneGenerator()
const promocodeScene = curScene.GenTestimonialScene()

const stage = new Stage([promocodeScene])

bot.use(session())
bot.use(stage.middleware())

bot.telegram.options.agent = false;

bot.catch((err, ctx) => {
  console.error(`Error in bot:`, err);
});


function showMainMenu(ctx) {
  console.log('main menu opened')
  ctx.reply('Открыто главное меню',
    Markup.keyboard([
      ['Меню'],
      ['Проверить промокод']
    ]).resize().extra()
  );
}

function showTestimonialsMenu(ctx) {
  console.log('testimonial menu opened')
  ctx.reply('Введите промокод для проверки',
    Markup.keyboard([
      ['↩️ Назад']
    ]).resize().extra()
  );
}

bot.start(async (ctx) => { showMainMenu(ctx); })


bot.hears(['Проверить промокод'],
  (ctx) => {
    console.log('click Проверить промокод');
    ctx.scene.enter('testimonials');
    showTestimonialsMenu(ctx);
  }
);

bot.hears('↩️ Назад', (ctx) => { console.log('click Назад'); showMainMenu(ctx); });

bot.launch()
