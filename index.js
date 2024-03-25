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
const promocodeScene = curScene.GenPromocodeScene()

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
      ['Проверить промокод'],
      // ['custom']
    ]).resize().extra()
  );
}

function showTestimonialsMenu(ctx) {
  console.log('promocode menu opened')
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
    ctx.scene.enter('promocode');
    showTestimonialsMenu(ctx);
  }
);

bot.hears('↩️ Назад', (ctx) => { console.log('click Назад'); showMainMenu(ctx); });



bot.hears('custom', (ctx) => {
  console.log('custom');
  const client = new Client({
    user: 'testuser',
    host: '212.86.101.37',
    database: 'testdb',
    password: 'test',
    port: 5432,
  });

  // Подключение к базе данных
  client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .then(() => { })
    .catch(err => console.error('Connection error', err))
    .finally(() => setTimeout(() => { client.end(); console.log('ended') }, 2000))
}
);




bot.launch()
