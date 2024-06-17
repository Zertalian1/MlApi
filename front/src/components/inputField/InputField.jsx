"use client"
import React, { useState } from 'react';
import styles from "./input.module.css"
import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const infoData = [
  {
    key: 'Численность населения',
    value: 'Численность населения — один из демографических показателей. Постоянно изменяется вследствие рождения, смертей, миграции, измеряется и оценивается по состоянию на определённый момент времени. В данном случае используется численность населения на начало года.'

  },
  {
    key: 'AOI',
    value: 'AOI-Индекс ориентации правительства на сельское хозяйство характеризует уровень внимания, отдаваемого правительством развитию сельского хозяйства.\nЕсли значение индекса AOI превышает 1, то это говорит о высокой ориентации на сельскохозяйственный сектор, затраты на который превышают его вклад в экономическую добавленную стоимость. Значение AOI меньше 1 отражает более низкую ориентацию на сельское хозяйство, тогда как AOI, равный 1, показывает нейтралитет в ориентации правительства на сельскохозяйственный сектор.'
  },
  {
    key: 'ВВП',
    value: 'Валовой внутренний продукт (ВВП)  — макроэкономический показатель, отражающий рыночную стоимость всех конечных товаров и услуг (то есть предназначенных для непосредственного употребления, использования или применения), произведённых за год во всех отраслях экономики на территории конкретного государства для потребления, экспорта и накопления, вне зависимости от национальной принадлежности использованных факторов производства.\nСистема использует значение ВВП на душу населения в долларах США.'
  },
  {
    key: 'Изменение температуры',
    value: 'Глобальное изменение средней приземной температуры в результате совокупных выбросов в стране или регионе трех газов – углекислого газа, метана и оксида азота за год.'
  },
  {
    key: 'Коэффициент Джинни',
    value: 'Коэффициент Джини - статистический показатель степени расслоения общества данной страны или региона по какому-либо изучаемому признаку.\nИспользуется для оценки экономического неравенства. \nКоэффициент Джини может варьироваться между 0 и 1. Чем больше егозначение отклоняется от нуля и приближается к единице, тем в большей степени доходы сконцентрированы в руках отдельных групп населения.'
  },
  {
    key: 'Средняя продолжительность жизни',
    value: 'Средняя продолжительность жизни – статистический показатель смертности населения, выражаемый числом лет, которое в среднем предстоит прожить лицам, родившимся или достигшим определённого возраста в данном календарном году, если предположить, что на всем протяжении их жизни смертность в каждой возрастной группе будет такой, какой она была в этом же году.'
  },
  {
    key: 'Уровень безработицы',
    value: 'Уровень безработицы - отношение численности безработных определенной возрастной группы к численности экономически активного населения соответствующей возрастной группы, в процентах. \nСогласно методологии Международной организации труда (МОТ) к безработным относят людей трудоспособного возраста, которые не имеют работы в течение некоторого периода времени, способны трудиться и предпринимают усилия по поиску работы, но не могут найти ее.'
  }
] 

const InputField = ({inputType, inputPlaceholder, inputValue, handleInputChange, isCheckboxChecked, handleCheckboxChange, handleKeyDown, isError, onQuestionClick, isInfo}) => {
  
  const mapInfoData = () => {
    let data = infoData.find(x => x.key === inputPlaceholder)

    return data.value
  }

  const [questionMarkData, setQuestionMarkData] = useState({
    title: inputPlaceholder,
    text: mapInfoData()
  })

  const handleClick = () => {
    onQuestionClick(questionMarkData);
  };

  return (
    <div className={styles.block}>
      <div className={styles.hidden} aria-hidden={'true'}>
       {inputPlaceholder}
     </div>
      <input
        className={!isCheckboxChecked ? styles.closedInput : isError ? styles.openErrorInput : styles.openNonErrorInput}
        type={inputType}
        placeholder={inputPlaceholder}
        value={inputValue}
        style={inter.style}
        onChange={handleInputChange}
        disabled={!isCheckboxChecked}
        onKeyDown={handleKeyDown}
      />
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={isCheckboxChecked}
        onChange={handleCheckboxChange}
      />
      {isInfo ? <button className={styles.questionMark}
        type='button'
        onClick={handleClick}
      >
        <p className={inter.className} style={{color: 'white', fontSize: '34px'}}>?</p>
      </button> : null }
    </div>
  );
};

//{ backgroundColor: isCheckboxChecked ? 'white' : '#cfd8e6', borderColor: isError ? 'red' : '#ccc'}
export default InputField;