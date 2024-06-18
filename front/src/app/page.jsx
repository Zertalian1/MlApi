"use client"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./homepage.module.css"
import axios from "axios";
import React, { useState } from 'react';
import MyPlot from "@/components/plot/Plot";
import InputField from "@/components/inputField/InputField";
import Stripe from "@/components/stripe/Stripe";
import InfoCard from "@/components/infoCard/InfoCard";
import ErrorCard from "@/components/errorCard/ErrorCard";
import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)


const Home = () => {  
  const [isRequestLoading, setIsRequestLoading] = useState(false);    
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [formData, setFormData] = useState({
    product: {
      selectedOption: undefined,
      options: []
    },
    
    selectedYear: {
      value: null,
    },
    
    fields: [
      {
        name: 'Численность населения',
        value: '',
        checkbox: false
      },
      {
        name: 'AOI',
        value: '',
        checkbox: false
      },
      {
        name: 'ВВП',
        value: '',
        checkbox: false
      },
      {
        name: 'Изменение температуры',
        value: '',
        checkbox: false
      },
      {
        name: 'Коэффициент Джинни',
        value: '',
        checkbox: false
      },
      {
        name: 'Средняя продолжительность жизни',
        value: '',
        checkbox: false
      },
      {
        name: 'Уровень безработицы',
        value: '',
        checkbox: false
      },
    ]
  });
  
  const [plotExportDataX, setPlotExportDataX] = useState([]);
  const [plotExportDataY, setPlotExportDataY] = useState([]);
  const [plotImportDataX, setPlotImportDataX] = useState([]);
  const [plotImportDataY, setPlotImportDataY] = useState([]);
  const [plotFoodDataX, setPlotFoodDataX] = useState([]);
  const [plotFoodDataY, setPlotFoodDataY] = useState([]);
  const [plotProductionDataX, setPlotProductionDataX] = useState([]);
  const [plotProductionDataY, setPlotProductionDataY] = useState([]);
  
  const clearErrors = () => {
    setInputError({
      isError: false,
      emptyData: '',
      fieldsError: {
        names: [],
        message: ''
      },
      zeroError: {
        names: [],
        message: ''
      },
      requiredProduct: '',
      requiredYear: '',
      lengthError: {
        names: [],
        message: ''
      },
      startDotError: {
        names: [],
        message: ''
      },
      endDotError: {
        names: [],
        message: ''
      },
    });
  };
  
  const handleKeyDown = (event) => {
    if (event.key === '+' || event.key === '-' || event.key === ',') {
      event.preventDefault();
    }
  };

  const handleRationalKeyDown = (event) => {
    if (event.key === '+' || event.key === '-' || event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  };

  const [inputError, setInputError] = useState({
    isError: false,
    emptyData: '',
    fieldsError: {
      names: [],
      message: ''
    },
    zeroError: {
      names: [],
      message: ''
    },
    requiredProduct: '',
    requiredYear: '',
    lengthError: {
      names: [],
      message: ''
    },
    startDotError: {
      names: [],
      message: ''
    },
    endDotError: {
      names: [],
      message: ''
    },
  });

  const handleFieldCheckboxChange = (fieldName) => {
    clearErrors()
    const updatedFields = formData.fields.map(field => {
      if (field.name === fieldName) {
        return {
          ...field,
          checkbox: !field.checkbox,
          value: ' '
        };
      }
      return field;
    });
    setFormData(prevState => ({
      ...prevState,
      fields: updatedFields
    }));
  };

  const handleFieldValueChange = (fieldName, value) => {
    clearErrors()
    const updatedFields = formData.fields.map(field => {
      if (field.name === fieldName && field.checkbox) {
        return {
          ...field,
          value: value.target.value
        };
      }
      return field;
    });
    setFormData(prevState => ({
      ...prevState,
      fields: updatedFields
    }));
  };

  const handleYearChange = (date) => {
    clearErrors()
    setFormData(prevFormData => ({
      ...prevFormData,
      selectedYear: {
        ...prevFormData.selectedYear,
        value: date 
      }
    }));
  };
  
  const handleDropDownClick = () => {
    clearErrors()
    axios.get("https://192.168.99.26:8080/predict-food-balance")
    .then(response => { 
      setFormData(prevFormData => ({
        ...prevFormData,
        product: {
          ...prevFormData.product,
          options: response.data.products
        }
      }))
    })
  }

  const handleSelect = (option) => {
    clearErrors() 
    setFormData(prevFormData => ({
      ...prevFormData,
      product: {
        ...prevFormData.product,
        selectedOption: option
      }
    }));
  };

  const handleResponse = (response) => {
    let exx = []
    let exy = []
    let imx = []
    let imy = []
    let foodx = []
    let foody = []
    let prodx = []
    let prody = []

    for(let i = 0; i < response.data.length; i++){
      exx[i] = response.data[i].year
      exy[i] = response.data[i].export_quantity

      imx[i] = response.data[i].year
      imy[i] = response.data[i].import_quantity
      
      foodx[i] = response.data[i].year
      foody[i] = response.data[i].food_quantity
      
      prodx[i] = response.data[i].year
      prody[i] = response.data[i].production_quantity
    }

    setPlotExportDataX([...exx])
    setPlotExportDataY([...exy])

    setPlotImportDataX([...imx])
    setPlotImportDataY([...imy])

    setPlotFoodDataX([...foodx])
    setPlotFoodDataY([...foody])

    setPlotProductionDataX([...prodx])
    setPlotProductionDataY([...prody])
  }

  const handlePredictionResponse = (data, request, year) => {
    request.data.push({...data, year: year})
  }

  const handleSubmit = async () => {
    setIsRequestLoading(true);
    clearErrors()
    let errors = {};

    errors.lengthError = {names: [], message: ''};
    errors.startDotError = {names: [], message: ''};
    errors.zeroError = {names: [], message: ''};
    errors.fieldsError = {names: [], message: ''};

    for(let i = 0; i < formData.fields.length; ++i){
      let value = formData.fields[i].value
      if(formData.fields[i].checkbox && (value === '' || value === ' ')){
        errors.fieldsError.names.push(formData.fields[i].name)
        errors.fieldsError.message = 'Все выбранные необязательные параметры должны быть заполнены'
      }

      if(value.startsWith('.')){
        errors.startDotError.names.push(formData.fields[i].name)
        errors.startDotError.message = 'Число не может начинаться с "."'
      }

      if(value.startsWith('0') && value.indexOf('.') === -1){
        errors.zeroError.names.push(formData.fields[i].name)
        errors.zeroError.message = 'Целое число не может начинаться с "0"'
      }

      if (value.includes('.')) {
        const [beforeDot, afterDot] = value.split('.'); 
        if (beforeDot.length > 10 || afterDot.length > 10) { 
          errors.lengthError.names.push(formData.fields[i].name)
          errors.lengthError.message = "Число до или после точки не должно превышать 10 знаков"
        }
      }

      if(value.length > 10) {
        errors.lengthError.names.push(formData.fields[i].name)
        errors.lengthError.message = "Число до или после точки не должно превышать 10 знаков"
      }
    }

    if(formData.product.selectedOption === undefined) {
      errors.requiredProduct = 'Обязательные параметры должны быть заполнены'
    }

    if(formData.selectedYear.value === null) {
      errors.requiredYear = 'Обязательные параметры должны быть заполнены'
    }

    if(errors.lengthError.message === ''){
      delete errors.lengthError
    }
    if(errors.startDotError.message === ''){
      delete errors.startDotError
    }
    if(errors.zeroError.message === ''){
      delete errors.zeroError
    }
    if(errors.fieldsError.message === ''){
      delete errors.fieldsError
    }

    if (Object.keys(errors).length > 0) {
      errors.isError = true;
      setInputError(errors);
      setIsRequestLoading(false);
      return
    }
    
    let request = {
      product: Number(formData.product.selectedOption), 
      data: []
    }
  
    if(Number(formData.selectedYear.value.getFullYear()) > 2021){
      let response = await axios.post("https://192.168.99.26:8080/predict-input-data?range=true",
      {
        year_from: 2021,
        year_to: Number(formData.selectedYear.value.getFullYear() - 1)
      })

      for(let i = 0 ; i < response.data.data.length; ++i){
        handlePredictionResponse(response.data.data[i], request, response.data.data[i].year)
      }
    }

    let predictedYearRespone = await axios.post("https://192.168.99.26:8080/predict-input-data", {year: Number(formData.selectedYear.value.getFullYear())})
    
    let population = formData.fields.find(field => field.name === 'Численность населения').value
    let surface_temperature_change = formData.fields.find(field => field.name === 'Изменение температуры').value
    let life_expectancy = formData.fields.find(field => field.name === 'Средняя продолжительность жизни').value
    let gini = formData.fields.find(field => field.name === 'Коэффициент Джинни').value 
    let agriculture_orientation = formData.fields.find(field => field.name === 'AOI').value
    let unemployment = formData.fields.find(field => field.name === 'Уровень безработицы').value
    let gdp = formData.fields.find(field => field.name === 'ВВП').value

    request.data.push(
      {
        year: Number(formData.selectedYear.value.getFullYear()), 
        population: Number(population === '' || population === ' ' ? predictedYearRespone.data.data[0].population : population), 
        surface_temperature_change: Number(surface_temperature_change === '' || surface_temperature_change === ' ' ? predictedYearRespone.data.data[0].surface_temperature_change : surface_temperature_change),
        life_expectancy: Number(life_expectancy === '' || life_expectancy === ' ' ? predictedYearRespone.data.data[0].life_expectancy : life_expectancy),
        gini: Number(gini === '' || gini === ' ' ? predictedYearRespone.data.data[0].gini : gini),
        agriculture_orientation: Number(agriculture_orientation === '' || agriculture_orientation === ' ' ? predictedYearRespone.data.data[0].agriculture_orientation : agriculture_orientation),
        unemployment: Number(unemployment === '' || unemployment ===' ' ? predictedYearRespone.data.data[0].unemployment : unemployment),
        gdp: Number(gdp === '' || gdp === ' ' ? predictedYearRespone.data.data[0].gdp : gdp),
      }
    )

    axios.post("https://192.168.99.26:8080/predict-food-balance",
    request)
    .then(response => {
      handleResponse(response.data)
    })

    setIsRequestLoading(false);
  };

  const [infoDataCard, setInfoDataCard] = useState({
    title: '',
    text: '',
    isPressed: false
  }) 

  const handleOnQuestionclick = (data) => {
    if(infoDataCard.title !== ''){
      if(infoDataCard.title === data.title){
        if(infoDataCard.isPressed === true){
          setInfoDataCard({
            title: '',
            text: '',
            isPressed: false
          })
          return
        }
      }
    }
    
    setInfoDataCard({
      title: data.title,
      text: data.text,
      isPressed: true
    })
  }

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handleExportToCsv = async () => {
    setIsExportLoading(true)
    let errors = {}
    if(plotExportDataX.length === 0){
      errors.emptyData = 'Перед выгрузкой нужно сделать запрос'
    }
    
    if (Object.keys(errors).length > 0) {
      errors.isError = true;
      setInputError(errors);
      setIsExportLoading(false)
      return
    }

    let request = {
      product: Number(formData.product.selectedOption), 
      data: []
    }
  
    if(Number(formData.selectedYear.value.getFullYear()) > 2021){
      let response = await axios.post("https://192.168.99.26:8080/predict-input-data?range=true",
      {
        year_from: 2021,
        year_to: Number(formData.selectedYear.value.getFullYear() - 1)
      })

      for(let i = 0 ; i < response.data.data.length; ++i){
        handlePredictionResponse(response.data.data[i], request, response.data.data[i].year)
      }
    }

    let predictedYearRespone = await axios.post("https://192.168.99.26:8080/predict-input-data", {year: Number(formData.selectedYear.value.getFullYear())})
    
    let population = formData.fields.find(field => field.name === 'Численность населения').value
    let surface_temperature_change = formData.fields.find(field => field.name === 'Изменение температуры').value
    let life_expectancy = formData.fields.find(field => field.name === 'Средняя продолжительность жизни').value
    let gini = formData.fields.find(field => field.name === 'Коэффициент Джинни').value 
    let agriculture_orientation = formData.fields.find(field => field.name === 'AOI').value
    let unemployment = formData.fields.find(field => field.name === 'Уровень безработицы').value
    let gdp = formData.fields.find(field => field.name === 'ВВП').value

    request.data.push(
      {
        year: Number(formData.selectedYear.value.getFullYear()), 
        population: Number(population === '' || population === ' ' ? predictedYearRespone.data.data[0].population : population), 
        surface_temperature_change: Number(surface_temperature_change === '' || surface_temperature_change === ' ' ? predictedYearRespone.data.data[0].surface_temperature_change : surface_temperature_change),
        life_expectancy: Number(life_expectancy === '' || life_expectancy === ' ' ? predictedYearRespone.data.data[0].life_expectancy : life_expectancy),
        gini: Number(gini === '' || gini === ' ' ? predictedYearRespone.data.data[0].gini : gini),
        agriculture_orientation: Number(agriculture_orientation === '' || agriculture_orientation === ' ' ? predictedYearRespone.data.data[0].agriculture_orientation : agriculture_orientation),
        unemployment: Number(unemployment === '' || unemployment ===' ' ? predictedYearRespone.data.data[0].unemployment : unemployment),
        gdp: Number(gdp === '' || gdp === ' ' ? predictedYearRespone.data.data[0].gdp : gdp),
      }
    )
    
    axios.post("https://192.168.99.26:8080/predict-food-balance?return_csv=true",
    request)
    .then(response => {
      downloadCSV(response.data, "Выгрузка")
    })
    setIsExportLoading(false)
  }

  return (
    <div>  
      <label className={styles.mainText} style={inter.style}>Предсказание потребления, производства, импорта и экспорта<br/>
          основных продуктов питания  
      </label> 
      <Stripe/>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <label className={styles.subText} style={inter.style}>
            Обязательные параметры для запроса
          </label>
          <div className={styles.container}>
            <div className={styles.mainSelect}>
              <label className={styles.secondaryText} style={inter.style}><span title="Обязательное поле" className="red-star">*<style jsx>{`
                .red-star {
                  color: red;
                  font-size: 20px;
                  vertical-align: middle;
                  }
                  `}</style ></span>Выберите продукт:</label>
              <select className={styles["rounded-select"]} 
                style={{ borderColor: inputError.requiredProduct === '' || inputError.requiredProduct === undefined ? '#aaa' : 'red'}} 
                value={formData.product.selectedOption} onClick={() => handleDropDownClick()} onChange={(e) => handleSelect(e.target.value)}>
                <option value={undefined} disabled selected hidden>Не выбрано</option>
                {formData.product.options.map((option) => (
                  <option value={option.product_id} key={option.product_id}>{option.product_name}</option>
                  ))}
              </select>
            </div>
            <div className={styles.mainSelect}>
              <label className={styles.secondaryText} style={inter.style}><span title="Обязательное поле" className="red-star">*<style jsx>{`
                .red-star {
                  color: red;
                  font-size: 20px;
                  vertical-align: middle;
                  }
                  `}</style></span>Выберите год:</label>
              <DatePicker
                className={styles[inputError.requiredYear === '' || inputError.requiredYear === undefined ? "rounded-datePeeker" : "rounded-datePeeker-red"]}
                selected={formData.selectedYear.value}
                onChange={handleYearChange}
                maxDate={new Date(new Date().getFullYear() + 100, 11, 31)}
                showYearPicker
                dateFormat="yyyy"
                />
            </div>
          </div>
          <label className={styles.subText} style={inter.style}>
            Дополнительные параметры для запроса
          </label>
          <div className={styles.container}>
            <div className={styles.form}>
              {formData.fields.map((field, index) => (
                <InputField
                key={index}
                inputType="number"
                inputPlaceholder={field.name}

                isError = {inputError.lengthError !== undefined && inputError.lengthError.names.includes(field.name)
                  || inputError.startDotError !== undefined && inputError.startDotError.names.includes(field.name)
                  || inputError.endDotError !== undefined && inputError.endDotError.names.includes(field.name)
                  || inputError.fieldsError !== undefined && inputError.fieldsError.names.includes(field.name)
                  || inputError.zeroError !== undefined && inputError.zeroError.names.includes(field.name)}
                  inputValue={field.value}
                  handleInputChange={(value) => handleFieldValueChange(field.name, value)}
                  isCheckboxChecked={field.checkbox}
                  handleCheckboxChange={() => handleFieldCheckboxChange(field.name)}
                  handleKeyDown={field.name !== 'Численность населения' ? handleKeyDown : handleRationalKeyDown}
                  onQuestionClick={handleOnQuestionclick}
                  isInfo={true}
                  ></InputField>
                  ))}
            </div>
          </div>  
        </form>
        <div className={styles.infoBlock}>
          {infoDataCard.isPressed ? <InfoCard title={infoDataCard.title} text={infoDataCard.text}/> : null}
          {inputError.isError ? <ErrorCard inputError={inputError}/> : null}      
        </div>
      </div>
      <div className={styles.buttonContainer}>
      <button
          className={styles.requestButton}
          style={inter.style}
          type="button"
          onClick={handleSubmit}
      >
        {isRequestLoading ? (
                <div className={styles.loader}></div>
            ) : (
                'Отправить\n запрос'
            )}
      </button>
      <button
          className={styles.exportButton}
          style={inter.style}
          type="button"
          onClick={handleExportToCsv}
      >
        {isExportLoading ? (
                <div className={styles.loader}></div>
            ) : (
                'Экспорт\n данных'
            )}
      </button>
      </div>
      {plotExportDataX.length !== 0 ? <div className={styles.plot}>
          <MyPlot plotDataX={plotExportDataX}  plotDataY={plotExportDataY} plotTitle={"Экспорт"} plotXaxis={"Экспорт, в тыс. тонн"} plotYaxis={"Год"} ></MyPlot>
          <MyPlot plotDataX={plotImportDataX}  plotDataY={plotImportDataY} plotTitle={"Импорт"} plotXaxis={"Импорт, в тыс. тонн"} plotYaxis={"Год"} ></MyPlot>
          <MyPlot plotDataX={plotFoodDataX}  plotDataY={plotFoodDataY} plotTitle={"Потребление"} plotXaxis={"Потребление, в тыс. тонн"} plotYaxis={"Год"} ></MyPlot>
          <MyPlot plotDataX={plotProductionDataX}  plotDataY={plotProductionDataY} plotTitle={"Производство"} plotXaxis={"Производство, в тыс. тонн"} plotYaxis={"Год"} ></MyPlot>
      </div> : null}
    </div>
  )
};

export default Home;