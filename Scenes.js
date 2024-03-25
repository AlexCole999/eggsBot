const Scene = require('telegraf/scenes/base')
const Telegraf = require('telegraf')
const { Markup } = Telegraf
const { Client } = require('pg');

function showMainMenu(ctx) {
    ctx.reply('Открыто главное меню',
        Markup.keyboard([
            ['Проверить промокод']
        ]).resize().extra()
    );
}

class SceneGenerator {

    GenPromocodeScene() {

        const promocode = new Scene('promocode')

        promocode.enter((ctx) => {
            console.log('Promocode scene enter')
        })

        promocode.on('text', async (ctx) => {

            const testimonial = ctx.message.text;
            console.log('entered promocode text');


            if (testimonial !== "↩️ Назад") {
                console.log('testimonial text entered');

                if (testimonial > 0 && testimonial < 10001) {
                    promocodeCheckRequest(ctx);
                }
                else if (testimonial < 1 | testimonial > 10000) {
                    console.log('Введен неправильный код');
                    ctx.reply('только номера от 1 до 10000');
                    ctx.scene.leave();
                    showMainMenu(ctx)
                }
            }

            else {
                console.log('click testimonial назад');
            }

            await ctx.scene.leave();
        })

        return promocode

    }

}

function promocodeCheckRequest(ctx) {
    // Конфигурация подключения
    const client = new Client({
        user: 'testuser',
        host: '212.86.101.37',
        database: 'testdb',
        password: 'test',
        port: 5432,
    });

    client.connect()
        .then(() => console.log('Connected to PostgreSQL database'))
        .then(() => {
            console.log('tables exist check')
        })
        .then(async () => {
            console.log(ctx.message.text)
            let a = await client.query(`SELECT * FROM eggs WHERE promocode = ${ctx.message.text}`);
            // console.log(a.rows[0].promocode)
            // console.log(a.rows[0].prize)
            ctx.reply(`Вы ввели промокод ${a.rows[0].promocode}\nВаш выигрыш:${a.rows[0].prize}`)
            await ctx.scene.leave();
            await showMainMenu(ctx);
        })
        .catch(err => console.error('Error', err))
        .finally(() => client.end());

}

module.exports = SceneGenerator


// удаление таблицы
// .then(async () => {
//     let tableName = 'eggs'
//     let a = await client.query(`DROP TABLE IF EXISTS ${tableName}`);
//     console.log(a)
// })

// удаление значений таблицы
// client.query('DELETE FROM "table"')
//     .then(() => console.log('All rows deleted'))
//     .catch(err => console.error('Error deleting rows', err))
//     .finally(() => client.end());

// просмотр таблиц
// .then(() => {
//     return client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
// })
// .then((result) => {
//     console.log('Tables in the database:');
//     result.rows.forEach(row => {
//         console.log(row.table_name);
//     });
// })

// создание таблицы
// try {
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS eggs (
//         id SERIAL PRIMARY KEY,
//         promocode INTEGER,
//         prize VARCHAR(50)
//       )
//     `);
//     console.log(`Table eggs created successfully`);
// } catch (error) {
//     console.error('Error creating table:', error);
// }
//         })


// генератор призов
// const rows = [];
// for (let i = 1; i <= 10000; i++) {
//     const promocode = i;
//     const prize = generatePrize();
//     rows.push(`(${promocode}, '${prize}')`);
// }
// function generatePrize() {
//     const prizeChance = Math.random();
//     if (prizeChance < 0.25) {
//         let valueChance = Math.random();
//         if (valueChance < 0.05) { return '50%' }
//         if (valueChance > 0.05 && valueChance < 0.1) { return "40%" }
//         if (valueChance > 0.1 && valueChance < 0.2) { return "30%" }
//         if (valueChance > 0.2 && valueChance < 0.4) { return "20%" }
//         if (valueChance > 0.4 && valueChance < 0.6) { return "15%" }
//         if (valueChance > 0.6) { return "10%" }
//     } else if (prizeChance > 0.96) {
//         let valueChance = Math.random();
//         if (valueChance < 0.25) { return 'High level' }
//         if (valueChance > 0.25 && valueChance < 0.5) { return "Mid level" }
//         if (valueChance > 0.5 && valueChance < 1) { return "Low level" }
//     }
//     else return 'Нет выигрыша'
// }