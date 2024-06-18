"use client"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./performane.module.css"
import axios from "axios";

import React, { useState } from 'react';
import MyPlot from "@/components/plot/Plot";
import InputField from "@/components/inputField/InputField";

import { Tooltip } from "@nextui-org/react";

import { MdHelpOutline } from 'react-icons/md';
import Stripe from "@/components/stripe/Stripe";
import InfoCard from "@/components/infoCard/InfoCard";
import ErrorCard from "@/components/errorCard/ErrorCard";
import { Anonymous_Pro } from 'next/font/google'
import PredictionField from "@/components/inputPerformanceFiled/PredictionField";

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const PerformancePrediction = () => {  
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const [plotAOIDataX, setPlotAOIDataX] = useState([]);
  const [plotAOIDataY, setPlotAOIDataY] = useState([]);
  
  const [plotGDPDataX, setPlotGDPDataX] = useState([]);
  const [plotGDPDataY, setPlotGDPDataY] = useState([]);
  
  const [plotGiniDataX, setPlotGiniDataX] = useState([]);
  const [plotGiniDataY, setPlotGiniDataY] = useState([]);
  
  const [plotLifeDataX, setPlotLifeDataX] = useState([]);
  const [plotLifeDataY, setPlotLifeDataY] = useState([]);

  const [plotPopulationDataX, setPlotPopulationDataX] = useState([]);
  const [plotPopulationDataY, setPlotPopulationDataY] = useState([]);

  const [plotTempDataX, setPlotTempDataX] = useState([]);
  const [plotTempDataY, setPlotTempDataY] = useState([]);

  const [plotUnemploymentDataX, setPlotUnemploymentDataX] = useState([]);
  const [plotUnemploymentDataY, setPlotUnemploymentDataY] = useState([]);

  const [predictionFileds, setPredictionFields] = useState({
    peopleCount: '',
    AOI: '',
    VVP: '',
    Temp: '',
    Ginn: '',
    Life: '',
    Work: ''
  })

  const [inputError, setInputError] = useState({
    isError: false,
    requiredYear: '',
    checkedError: '',
    emptyData: ''
  });

  const handleYearChange = (date) => {
    clearErrors()
    clearPlots()
    setFormData(prevFormData => ({
      ...prevFormData,
      selectedYear: {
        ...prevFormData.selectedYear,
        value: date 
      }
    }));
  };

  const clearPlots = () => {
    setPlotAOIDataX([])
    setPlotAOIDataY([])
    setPlotGDPDataX([])
    setPlotGDPDataY([])
    setPlotGiniDataX([])
    setPlotGiniDataY([])
    setPlotLifeDataX([])
    setPlotLifeDataY([])
    setPlotPopulationDataX([])
    setPlotPopulationDataY([])
    setPlotTempDataX([])
    setPlotTempDataY([])
    setPlotUnemploymentDataX([])
    setPlotUnemploymentDataY([])
  }

  const handleFieldCheckboxChange = (fieldName) => {
    clearErrors()
    clearPlots()
    setPredictionFields({
      peopleCount: '',
      AOI: '',
      VVP: '',
      Temp: '',
      Ginn: '',
      Life: '',
      Work: ''
    })
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

  const [formData, setFormData] = useState({    
    selectedYear: {
      value: null,
    },
    
    fields: [
      {
        name: 'Численность населения',
        checkbox: false
      },
      {
        name: 'AOI',
        checkbox: false
      },
      {
        name: 'ВВП',
        checkbox: false
      },
      {
        name: 'Изменение температуры',
        checkbox: false
      },
      {
        name: 'Коэффициент Джинни',
        checkbox: false
      },
      {
        name: 'Средняя продолжительность жизни',
        checkbox: false
      },
      {
        name: 'Уровень безработицы',
        checkbox: false
      },
    ]
  })

  const clearErrors = () => {
    setInputError({
      isError: false,
      requiredYear: '',
      checkedError: '',
      emptyData: ''
    });
  };
  
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
    if(plotPopulationDataX.length === 0 &&
      plotAOIDataX.length === 0 &&
      plotGDPDataX.length === 0 &&
      plotGiniDataX.length === 0 &&
      plotLifeDataX.length === 0 &&
      plotTempDataX.length === 0 &&
      plotUnemploymentDataX.length === 0){
      errors.emptyData = 'Перед выгрузкой нужно сделать запрос'
    }
    
    if (Object.keys(errors).length > 0) {
      errors.isError = true;
      setInputError(errors);
      setIsExportLoading(false)
      return
    }

    axios.post("https://sblab-vm06.sblab02.nsu.ru/predict-input-data?range=true&return_csv=true",
    {
      year_from: 1960,
      year_to: Number(formData.selectedYear.value.getFullYear())
    })
    .then(response => {
      downloadCSV(response.data, "Выгрузка")
    })

    setIsExportLoading(false)
  }

  const handlePredictionResponse = (data, request, year) => {
    request.data.push({...data, year: year})
  }

  const handleGraphResponse = (response) => {
    let agriculture_orientationx = []
    let agriculture_orientationy = []
    let gdpx = []
    let gdpy = []
    let ginix = []
    let giniy = []
    let life_expectancyx = []
    let life_expectancyy = []
    let populationx = []
    let populationy = []
    let surface_temperature_changex = []
    let surface_temperature_changey = []
    let unemploymentx = []
    let unemploymenty = []

    for(let i = 0; i < response.data.length; i++){
      agriculture_orientationx[i] = response.data[i].year
      agriculture_orientationy[i] = response.data[i].agriculture_orientation
      
      gdpx[i] = response.data[i].year
      gdpy[i] = response.data[i].gdp
      
      ginix[i] = response.data[i].year
      giniy[i] = response.data[i].gini

      life_expectancyx[i] = response.data[i].year
      life_expectancyy[i] = response.data[i].life_expectancy

      populationx[i] = response.data[i].year
      populationy[i] = response.data[i].population

      surface_temperature_changex[i] = response.data[i].year
      surface_temperature_changey[i] = response.data[i].surface_temperature_change

      unemploymentx[i] = response.data[i].year
      unemploymenty[i] = response.data[i].unemployment
    }

    if(formData.fields[0].checkbox){
      setPlotPopulationDataX([...populationx])
      setPlotPopulationDataY([...populationy])
    }

    if(formData.fields[1].checkbox){
      setPlotAOIDataX([...agriculture_orientationx])
      setPlotAOIDataY([...agriculture_orientationy])
    }

    if(formData.fields[2].checkbox){
      setPlotGDPDataX([...gdpx])
      setPlotGDPDataY([...gdpy])
    }

    if(formData.fields[3].checkbox){
      setPlotGiniDataX([...ginix])
      setPlotGiniDataY([...giniy])
    }

    if(formData.fields[4].checkbox){
      setPlotTempDataX([...surface_temperature_changex])
      setPlotTempDataY([...surface_temperature_changey])
    }

    if(formData.fields[5].checkbox){
      setPlotLifeDataX([...life_expectancyx])
      setPlotLifeDataY([...life_expectancyy])
    }

    if(formData.fields[6].checkbox){
      setPlotUnemploymentDataX([...unemploymentx])
      setPlotUnemploymentDataY([...unemploymenty])
    }
  }

  const handleSubmit = async () => {
    setIsRequestLoading(true)
    clearErrors()
    let errors = {};
    let isNotCheckboxError = false
    for(let i = 0; i < formData.fields.length; ++i){
      isNotCheckboxError ||= formData.fields[i].checkbox;
    }

    if(!isNotCheckboxError){
      errors.checkedError = 'Должен быть выбран хотя бы один необязательный параметр'
    }

    if(formData.selectedYear.value === null) {
      errors.requiredYear = 'Обязательные параметры должны быть заполнены'
    }

    if (Object.keys(errors).length > 0) {
      errors.isError = true;
      setInputError(errors);
      setIsRequestLoading(false)
      return
    }


    let request = {
      data: []
    }
  
    if(Number(formData.selectedYear.value.getFullYear()) > 2021){
      let response = await axios.post("https://sblab-vm06.sblab02.nsu.ru/predict-input-data?range=true",
      {
        year_from: 2021,
        year_to: Number(formData.selectedYear.value.getFullYear() - 1)
      })

      for(let i = 0 ; i < response.data.data.length; ++i){
        handlePredictionResponse(response.data.data[i], request, response.data.data[i].year)
      }
    }

    let predictedYearRespone = await axios.post("https://sblab-vm06.sblab02.nsu.ru/predict-input-data", {year: Number(formData.selectedYear.value.getFullYear())})

    setPredictionFields({
      peopleCount: formData.fields[0].checkbox ? predictedYearRespone.data.data[0].population : '',
      AOI: formData.fields[1].checkbox ? predictedYearRespone.data.data[0].agriculture_orientation : '',
      VVP: formData.fields[2].checkbox ? predictedYearRespone.data.data[0].gdp : '',
      Temp: formData.fields[3].checkbox ? predictedYearRespone.data.data[0].surface_temperature_change : '',
      Ginn: formData.fields[4].checkbox ? predictedYearRespone.data.data[0].gini : '',
      Life: formData.fields[5].checkbox ? predictedYearRespone.data.data[0].life_expectancy : '',
      Work: formData.fields[6].checkbox ? predictedYearRespone.data.data[0].unemployment : ''
    })

    axios.post("https://sblab-vm06.sblab02.nsu.ru/predict-input-data?range=true",
    {
      year_from: 1960,
      year_to: Number(formData.selectedYear.value.getFullYear())
    })
    .then(response => {
      handleGraphResponse(response.data)
    })
    setIsRequestLoading(false)
  };

  return (
    <div>
      <label className={styles.mainText} style={inter.style}>Предсказание показателей, влияющих на продукты  
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
                  `}</style></span>Выберите год:</label>
              <DatePicker
                className={styles[inputError.requiredYear === '' || inputError.requiredYear === undefined ? "rounded-datePeeker" : "rounded-datePeeker-red"]}
                selected={formData.selectedYear.value}
                onChange={handleYearChange}
                showYearPicker
                dateFormat="yyyy"
                />
            </div>
          </div>
          <label className={styles.subText} style={inter.style}>
            Параметры для запроса
          </label>
          <div className={inputError.checkedError === '' || inputError.checkedError === undefined ? styles.container : styles.containerError}>
            <div className={styles.form}>
              {formData.fields.map((field, index) => (
                <PredictionField
                key={index}
                inputPlaceholder={field.name}
                  isCheckboxChecked={field.checkbox}
                  handleCheckboxChange={() => handleFieldCheckboxChange(field.name)}
                  ></PredictionField>
                  ))}
            </div>
          </div>  
        </form>
        <div style={{flexDirection: 'column', width: '600px', marginLeft: '100px', marginTop: '160px'}}>
          <label className={styles.predSubText} style={inter.style}>Полученные данные, после предсказания</label>
          <div className={styles.responseContainer} style={inter.style}>
            <div className={predictionFileds.peopleCount !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.peopleCount !== '' && formData.fields[0].checkbox ? predictionFileds.peopleCount : 'Численность населения'}</div>
            <div className={predictionFileds.AOI !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.AOI !== '' && formData.fields[1].checkbox ? predictionFileds.AOI : 'AOI'}</div>
            <div className={predictionFileds.VVP !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.VVP !== '' && formData.fields[2].checkbox ? predictionFileds.VVP : 'ВВП'}</div>
            <div className={predictionFileds.Temp !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.Temp !== '' && formData.fields[3].checkbox ? predictionFileds.Temp : 'Изменение температуры'}</div>
            <div className={predictionFileds.Ginn !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.Ginn !== '' && formData.fields[4].checkbox ? predictionFileds.Ginn : 'Коэффициент Джинни'}</div>
            <div className={predictionFileds.Life !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.Life !== '' && formData.fields[5].checkbox ? predictionFileds.Life : 'Средняя продолжительность жизни'}</div>
            <div className={predictionFileds.Work !== '' ? styles.responseFieldSet : styles.responseField}>{predictionFileds.Work !== '' && formData.fields[6].checkbox ? predictionFileds.Work : 'Уровень безработицы'}</div>
          </div>
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
      <div style={{paddingLeft: "220px"}}>
        {inputError.isError ? <ErrorCard inputError={inputError}/> : null}
      </div>
      </div>
      {
        plotPopulationDataX.length !== 0 ? 
        <div className={styles.plot}>
            <MyPlot plotDataX={plotPopulationDataX}  plotDataY={plotPopulationDataY} plotTitle={"Численность населения"} plotXaxis={"Человек"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
      {
        plotAOIDataX.length !== 0 ? 
          <div className={styles.plot}>
            <MyPlot plotDataX={plotAOIDataX}  plotDataY={plotAOIDataY} plotTitle={"Ориентация правильтельства на сельское хозяйство"} plotXaxis={"Значение коэффициента"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
      {
        plotGDPDataX.length !== 0 ? 
          <div className={styles.plot}>
            <MyPlot plotDataX={plotGDPDataX}  plotDataY={plotGDPDataY} plotTitle={"ВВП"} plotXaxis={"USD"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
      {
        plotTempDataX.length !== 0 ? 
          <div className={styles.plot}>
            <MyPlot plotDataX={plotTempDataX}  plotDataY={plotTempDataY} plotTitle={"Коэффициент изменения температуры поверхности"} plotXaxis={"Значение коэффициента"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
      {
        plotGiniDataX.length !== 0 ? 
          <div className={styles.plot}>
            <MyPlot plotDataX={plotGiniDataX}  plotDataY={plotGiniDataY} plotTitle={"Коэфициент Джинни"} plotXaxis={"Значение коэффициента"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
      {
        plotLifeDataX.length !== 0 ? 
          <div className={styles.plot}>
            <MyPlot plotDataX={plotLifeDataX}  plotDataY={plotLifeDataY} plotTitle={"Средняя продолжительность жизни"} plotXaxis={"Число лет"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
      {
        plotUnemploymentDataX.length !== 0 ? 
          <div className={styles.plot}>
            <MyPlot plotDataX={plotUnemploymentDataX}  plotDataY={plotUnemploymentDataY} plotTitle={"Уровень безработицы"} plotXaxis={"% от общей рабочей силы"} plotYaxis={"Год"}></MyPlot>
          </div> 
        : null
      }
    </div>
  )
}

export default PerformancePrediction