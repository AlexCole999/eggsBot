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

// const transporter = nodemailer.createTransport({
//   host: 'smtp.elasticemail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'myata.platinum.tashkent@gmail.com',
//     pass: '560DE1217307AA88717ADD4C4823F6D13ACA'
//   }
// })
//6593497942:AAEXvOthtull92Zzq2-Iurpjlojxf4vPsdQ


// bot.hears('1', async (ctx) => {
//   let some = await transporter.sendMail({
//     from: 'myata.platinum.tashkent@gmail.com',
//     to: 'leonid.samograew@gmail.com',
//     subject: 'telegram testimonial'
//   })
//   console.log(some)
// });

const stage = new Stage([testimonialScene])

bot.use(session())
bot.use(stage.middleware())

bot.telegram.options.agent = false;

bot.catch((err, ctx) => {
  console.error(`Error in bot:`, err);
  // You can handle the error here, for example, you may want to send a message to yourself or to the user
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

function showContactOptions(ctx) {
  console.log('contacts opened')
  ctx.reply('Выберите контакт', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Instagram', url: 'https://www.instagram.com/myata_platinum_tashkent' }, { text: 'Telegram', url: 'https://t.me/myataplatinum_uz' }],
        [{ text: 'Youtube', url: 'https://www.youtube.com/@myata_uz' }, { text: 'Web Site', url: 'https://taplink.cc/platinummyata' }]
      ],
    },
  });
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

async function getToken() {
  console.log('start getting iiko token')
  const url = "https://api-ru.iiko.services/api/1/access_token";
  const body = { apiLogin: "74913501-9de" };
  const headers = { Timeout: "60" };
  let token = await axios.post(url, body, { headers });
  console.log('finish getting iiko token')
  return token
}

bot.on("contact", async (ctx) => {
  console.log(`contact requested with phone:${ctx.message.contact.phone_number}`)
  const url = "https://api-ru.iiko.services/api/1/loyalty/iiko/customer/info";
  const body = { phone: `${ctx.message.contact.phone_number}`, type: "phone", organizationId: "bbb98635-9a82-47d6-ac11-70e949865385", };
  const headers = { "Authorization": "", "Timeout": "60", "Content-Type": "application/json", };
  const token = await getToken()
  headers.Authorization = `Bearer ${token?.data?.token}`;
  try {
    let result = await axios.post(url, body, { headers });
    console.log('contact succesfully getted')
    await ctx.reply(`Номер карты: ${result?.data?.phone}\nБаланс на счету: ${result?.data?.walletBalances[0]?.balance ? result?.data?.walletBalances[0]?.balance : '0'}`)
  } catch { console.log('contact didnt finded or doesnt exist'); ctx.reply(`Номер счета не найден в системе`) }
});

bot.hears('Кешбэк', (ctx) => { console.log('click Кешбэк'); ctx.reply('Предоставить номер телефона:', Markup.keyboard([Markup.contactRequestButton('Отправить номер')]).resize().extra()); });

bot.hears('Меню', (ctx) => { console.log('click Меню'); ctx.reply('https://taplink.cc/platinummyata'); });

bot.hears('Акции', async (ctx) => { console.log('click Акции'); ctx.reply(`${clientText.actions}`) })

bot.hears(['Контакты'], (ctx) => { console.log('click Контакты'); showContactOptions(ctx); });

bot.hears(['Оставить отзыв'], (ctx) => { console.log('click Оставить отзыв'); ctx.scene.enter('testimonials'); showTestimonialsMenu(ctx); });

bot.hears('Главное меню', (ctx) => { console.log('click Главное меню'); showMainMenu(ctx); });

bot.hears('↩️ Назад', (ctx) => { console.log('click Назад'); showMainMenu(ctx); });

bot.launch()
