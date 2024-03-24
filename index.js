const Telegraf = require('telegraf')
const { Extra, Markup, Stage, session } = Telegraf
const https = require('https');
const config = require('config')
const axios = require('axios');
const { clientText } = require('./clientText.js');
const SceneGenerator = require('./Scenes')
const nodemailer = require('nodemailer')

const bot = new Telegraf(config.get('token'), {
  telegram: {
    agent: new https.Agent({ keepAlive: false }),
  },
})

const curScene = new SceneGenerator()
const testimonialScene = curScene.GenTestimonialScene()

const stage = new Stage([testimonialScene])

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
      [{ text: "Кешбэк", request_contact: true, }, 'Меню'],
      ['Акции', 'Контакты'],
      ['Оставить отзыв']
    ]).resize().extra()
  );
}

function showTestimonialsMenu(ctx) {
  console.log('testimonial menu opened')
  ctx.reply('Благодарим за ваш выбор! Пожалуйста, оцените качество сервиса и продукта от 1 до 5.',
    Markup.keyboard([
      ["🤩 Все чудесно, спасибо, 5⭐️⭐️⭐️⭐️⭐️"],
      ["😏 Все хорошо, но на 4⭐️⭐️⭐️⭐️"],
      ["😐 Удовлетворительно, на 3⭐️⭐️⭐️"],
      ["😒 Не понравилось, на 2⭐️⭐️"],
      ["😡 Оставить жалобу, 1⭐️"],
      ['↩️ Назад']
    ]).resize().extra()
  );
}

bot.start(async (ctx) => { showMainMenu(ctx); })

bot.hears('Кешбэк', (ctx) => { console.log('click Кешбэк'); ctx.reply('Предоставить номер телефона:', Markup.keyboard([Markup.contactRequestButton('Отправить номер')]).resize().extra()); });

bot.hears(['Оставить отзыв'], (ctx) => { console.log('click Оставить отзыв'); ctx.scene.enter('testimonials'); showTestimonialsMenu(ctx); });

bot.hears('Главное меню', (ctx) => { console.log('click Главное меню'); showMainMenu(ctx); });

bot.hears('↩️ Назад', (ctx) => { console.log('click Назад'); showMainMenu(ctx); });

bot.launch()
