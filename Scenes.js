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
            // генератор призов

        })

        promocode.on('text', async (ctx) => {

            const promocodeText = ctx.message.text;
            let index = promocodeText[4] + promocodeText[5] + promocodeText[11] + promocodeText[12] + promocodeText[13]
            ctx.session.state = { promo: index }
            console.log('entered promocode text', promocodeText.length);

            if (promocodeText == "↩️ Назад") {
                await ctx.scene.leave();
                await showMainMenu(ctx)
            }

            if (promocodeText.length !== 14) {
                ctx.reply('Неправильная длина промокода')
                await ctx.scene.leave();
                await showMainMenu(ctx)
            }

            if (isNaN(index)) {
                ctx.reply('Неверный формат промокода')
                ctx.scene.leave();
                showMainMenu(ctx)
            }

            if (promocodeText.length == 14) {
                console.log('promocode text length entered correct');



                if (index > 0 && index < 9001) {
                    promocodeCheckRequest(ctx);
                }
                else if (index < 1 | index > 9000) {
                    ctx.reply('Промокод истек или еще не добавлен в базу');
                    ctx.scene.leave();
                    showMainMenu(ctx)
                }
            }

            await ctx.scene.leave();

        })

        return promocode

    }

}

function promocodeCheckRequest(ctx) {

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
            let a = await client.query(`SELECT * FROM eggs WHERE promocode = ${ctx.session.state.promo}`);
            await ctx.reply(`Ваш выигрыш: ${a.rows[0].prize}`)
            if (a.rows[0].prize !== 'Нет выигрыша') { await ctx.reply(`Для получения выигрыша обратитесь по номеру\n+998-94-606-46-46`) }
            await ctx.scene.leave();
            await showMainMenu(ctx);
        })
        .catch(err => console.error('Error', err))
        .finally(() => {
            client.end();
            ctx.session.state = {}
            console.log(ctx.session.state)
            console.log('PostgreSQL connection end')
        }
        );

}

module.exports = SceneGenerator


// просмотр значений в таблице
// .then(async () => {
//     let a = await client.query(`SELECT * FROM eggs WHERE promocode < 3000`);
//     console.log(a.rows)
//     let result = a.rows.filter(x => x.prize == 5000).length
//     console.log(result)
// })

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

//Генератор призов
// const rows = [];
// for (let i = 1; i <= 3000; i++) {
//     const promocode = i;
//     const prize = generatePrizeFirst();
//     // rows.push(`(${promocode}, '${prize}')`);
//     rows.push({ promocode: promocode, prize: prize });
// }
// for (let i = 3001; i <= 6000; i++) {
//     const promocode = i;
//     const prize = generatePrizeSecond();
//     // rows.push(`(${promocode}, '${prize}')`);
//     rows.push({ promocode: promocode, prize: prize });
// }
// for (let i = 6001; i <= 9000; i++) {
//     const promocode = i;
//     const prize = generatePrizeSecond();
//     // rows.push(`(${promocode}, '${prize}')`);
//     rows.push({ promocode: promocode, prize: prize });
// }
// function generatePrizeFirst() {
//     const prizeChance = Math.random();
//     if (prizeChance > 0.5) { return '1000' }
//     else if (prizeChance > 0.17 && prizeChance < 0.5) { return '5000' }
//     else if (prizeChance < 0.003) { return '100000' }
//     else if (prizeChance > 0.003 && prizeChance < 0.01134) { return '50000' }
//     else if (prizeChance > 0.01134 && prizeChance < 0.025007) { return '25000' }
//     else return 'Нет выигрыша'
// }
// function generatePrizeSecond() {
//     const prizeChance = Math.random();
//     if (prizeChance > 0.75) { return '1000' }
//     else if (prizeChance > 0.583 && prizeChance < 0.75) { return '5000' }
//     else if (prizeChance < 0.002) { return '100000' }
//     else if (prizeChance > 0.002 && prizeChance < 0.006) { return '50000' }
//     else if (prizeChance > 0.006 && prizeChance < 0.015) { return '25000' }
//     else return 'Нет выигрыша'
// }
// console.log(JSON.stringify(rows))
// console.log(rows.filter(x => x.prize == 1000).length, 1000)
// console.log(rows.filter(x => x.prize == 5000).length, 5000)
// console.log(rows.filter(x => x.prize == 25000).length, 25000)
// console.log(rows.filter(x => x.prize == 50000).length, 50000)
// console.log(rows.filter(x => x.prize == 100000).length, 100000)

// Запрос приза из базы по промокоду
// .then(async () => {
//     console.log(ctx.session.state.promo)
//     let a = await client.query(`SELECT * FROM eggs WHERE promocode = ${ctx.session.state.promo}`);
//     await ctx.reply(`Ваш выигрыш: ${a.rows[0].prize}`)
//     if (a.rows[0].prize !== 'Нет выигрыша') { await ctx.reply(`Для получения выигрыша обратитесь по номеру +998 94 606 46 46`) }
//     await ctx.scene.leave();
//     await showMainMenu(ctx);
// })