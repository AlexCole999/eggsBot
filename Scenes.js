const Scene = require('telegraf/scenes/base')
const Telegraf = require('telegraf')
const { Markup } = Telegraf

function showMainMenu(ctx) {
    ctx.reply('Открыто главное меню',
        Markup.keyboard([
            [{ text: "Кешбэк", request_contact: true, }, 'Меню'],
            ['Акции', 'Контакты'],
            ['Оставить отзыв']
        ]).resize().extra()
    );
}

class SceneGenerator {

    GenTestimonialScene() {

        const testimonials = new Scene('testimonials')

        testimonials.enter(async (ctx) => {
            console.log('Testimonials scene enter')
        })

        testimonials.hears("🤩 Все чудесно, спасибо, 5⭐️⭐️⭐️⭐️⭐️", async (ctx) => {
            ctx.session.state = { ...ctx?.session?.state, rating: '5' };
            console.log('testimonials click 5');
            ctx.reply('Вы поставили оценку 5!\nПожалуйста, напишите нам, что вы думаете о нас!')
        })

        testimonials.on('text', async (ctx) => {

            const testimonial = ctx.message.text;
            console.log('entered testimonian text');

            if (testimonial !== "↩️ Назад") {
                console.log('testimonial text entered');
                await showMainMenu(ctx)
                ctx.session.state = {}
                await ctx.scene.leave()
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