// textData.js
let actions =
  "* 20% скидка именинникам (до и после 3х дней)\n\n" +

  "* Твой сумасшедший день рождения\n" +
  "1.000.000 сум  на 6 персон\n" +
  "2 кальяна, сет квартет, пицца, лимонад, фруктовое ассорти, чай, 2 салата, хлеб\n\n" +

  "* 30 % скидка для женских компаний\n" +
  "действует с воскресенья по четверг от 3х человек\n\n" +

  "* Кешбэк:\n" +
  "До 500.000 сум - 1 %\n" +
  "500.000 - 1.500.000 сум - 3 %\n" +
  "1.500.000 - 3.000.000 сум - 5 %\n" +
  "3.000.000 - 5.000.000 сум - 7 %\n" +
  "5.000.00 и выше - 10 %\n"

let TestimonialMsg =
  `Благодарим вас за обратную связь.\nМы очень ценим, что у нас есть отзывчивые и благодарные гости, как вы. Не хотели бы вы оставить отзыв про нас в наших платформах?\n
<a href="https://www.google.com/maps/place/Мята+Platinum+Seoul+Mun,+1%2F1+Улица+Баходира,+Tashkent+100000/data=!4m2!3m1!1s0x38ae8b63d2fd1653:0xb3ec36b2e22b0b2a?utm_source=mstt_1&entry=gps&lucs=47068615,,47075915&g_ep=CAESCjExLjEwMS4xMDIYACCIJyoSNDcwNjg2MTUsLDQ3MDc1OTE1QgJVWg%3D%3D">Google</a>
<a href="https://www.tripadvisor.ru/Restaurant_Review-g293968-d26545722-Reviews-Myata_Platinum_Seoul_Mun-Tashkent_Tashkent_Province.html">Tripadvisor</a>
<a href="https://2gis.uz/tashkent/firm/70000001080995918">2gis</a>
<a href="https://yandex.uz/maps/org/240485800004/?ll=69.246831%2C41.298951&z=17">Yandex</a>
`

const clientText = {
  actions: actions,
  TestimonialMsg: TestimonialMsg
};

module.exports = {
  clientText
};