"use client"

import Stripe from '@/components/stripe/Stripe'
import styles from './about.module.css'
import {Anonymous_Pro} from 'next/font/google'

const inter = Anonymous_Pro(
    {
        subsets: ['latin'],
        weight: '400'
    }
)


const About = () => {

    return (
        <div>
            <label className={styles.mainText} style={inter.style}>О проекте
            </label>
            <Stripe/>
            <div className={styles.formContainer}>
                <div className={styles.container} style={{ height: 'auto'}}>
                    <p className={styles.text} style={{ height: 'auto'}}>
                        Продовольствие является одним из важнейших ресурсов. Согласно статистике, около трети расходов
                        населения составляют расходы на продовольствие. <br />
                        Целью работы стало применение современных технологий, в частности нейронных сетей, для
                        прогнозирования потребления, производства импорта и экспорта 20 видов продуктов. <br />
                        Прогнозы строятся на основании социальных и экономических параметров, в дополнение к данному
                        функционалу, реализована возможность прогнозировать социальные параметры.
                    </p>
                    <p className={styles.text} style={{ height: 'auto'}}>
                        Среднее значение ошибки MAPE для моделей при прогнозировании: <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Потребления - 0,13 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Производства - 0,24 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Импорта - 0,6 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Экспорта - 0,65 <br />
                        Ошибка при прогнозировании входных параметров: <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Коэффициент изменения температуры поверхности - 0,004 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;ВВП - 0,044 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Коэффициент Джинни - 0,01 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Индекс ориентации правительства на сельское хозяйство - 0,14 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Продолжительность жизни - 0.028 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Численность населения - 0,0014 <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Безработица - 0,08 <br />
                        Тестирование проводилось на данных с 2015 по 2020 года. <br />
                    </p>
                    <p className={styles.text} style={{ height: 'auto'}}>
                        На данном этапе, сервис полностью функционирует, а его разработка продолжается.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About