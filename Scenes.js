const Scene = require('telegraf/scenes/base')
const Telegraf = require('telegraf')
const { Markup } = Telegraf
const { Client } = require('pg');

function showMainMenu(ctx) {
    ctx.reply('Открыто главное меню',
        Markup.keyboard([
            ['Меню'],
            ['Проверить промокод']
        ]).resize().extra()
    );
}

class SceneGenerator {

    GenTestimonialScene() {

        const testimonials = new Scene('testimonials')

        testimonials.enter((ctx) => {
            console.log('Testimonials scene enter')
        })

        testimonials.on('text', async (ctx) => {

            const testimonial = ctx.message.text;
            console.log('entered testimonian text');

            if (testimonial !== "↩️ Назад") {
                console.log('testimonial text entered');
                // Конфигурация подключения
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
                    .catch(err => console.error('Connection error', err));

                // const code = '99'; // Задайте нужный код здесь
                // const query = 'SELECT * FROM "tabletest"';
                // client.query(query)
                //   .then(result => console.table(JSON.stringify(result.rows)))
                //   .finally(() => { client.end() })

                client.query(`SELECT * FROM "tabletest" WHERE code = $1`, [ctx.message.text])
                    .then(async result => {
                        const rows = result.rows;
                        const jsonData = JSON.stringify(rows);
                        console.table('-------------------------');
                        console.table(rows);
                        console.log(rows[0].code, rows[0].prize);
                        await ctx.reply(
                            `Ваш код:${rows[0].code}\n` +
                            `Ваш выигрыш:${rows[0].prize}`
                        );

                        console.table('-------------------------');
                    })
                    .catch(err => console.error('Error querying table', err))
                    .finally(async () => {
                        client.end();
                        await ctx.scene.leave();
                        await showMainMenu(ctx);
                    });
                // await showMainMenu(ctx)
                // ctx.session.state = {}
                // await ctx.scene.leave()
            }

            else {
                console.log('click testimonial назад');
                ctx.session.state = {}
                await ctx.scene.leave();
                await showMainMenu(ctx);
            }
        })

        return testimonials

    }

}

module.exports = SceneGenerator