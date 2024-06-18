"use client"
import styles from './dataView.module.css'
import React, { useState } from 'react';
import { Anonymous_Pro } from 'next/font/google'
import Stripe from '@/components/stripe/Stripe';
import ErrorCard from '@/components/errorCard/ErrorCard';
import axios from 'axios';

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const DataView = () => {  
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [tableData, setTableData] = useState([])

  const [formData, setFormData] = useState({
    product: {
      selectedOption: undefined,
      options: []
    },
  })
 
  const [inputError, setInputError] = useState({
    isError: false,
    requiredTable: '',
    emptyData: ''
  });
  
  const clearErrors = () => {
    setInputError({
      isError: false,
      requiredTable: '',
      emptyData: ''
    });
  };

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

  const handleDropDownClick = () => {
    clearErrors()
    axios.get("http://192.168.99.26:8080/predict-food-balance")
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

  const handleTableResponse = (response) => {
    setTableData(response.data)
  }

  const handleTableRequest = async () => {
    setIsRequestLoading(true)
    let errors = {}
    if(formData.product.selectedOption === undefined) {
      errors.requiredTable = 'Обязательные параметры должны быть заполнены'
    }

    if (Object.keys(errors).length > 0) {
      errors.isError = true;
      setInputError(errors);
      setIsRequestLoading(false)
      return
    }

    axios.post("http://192.168.99.26:8080/predict-food-balance", {
      product: Number(formData.product.selectedOption), 
      data: []
    }).then(response => {
      handleTableResponse(response.data)
    })

    setIsRequestLoading(false)
  }

  const createHeaders = () => {
    const rows = [];
    rows.push(
      <tr style={inter.style}>
        <th style={{ border: '1px solid black', padding: '8px' }}>{'Год'}</th>
        <th style={{ border: '1px solid black', padding: '8px' }}>{'Экспорт в тыс. тонн'}</th>
        <th style={{ border: '1px solid black', padding: '8px' }}>{'Импорт в тыс. тонн'}</th>
        <th style={{ border: '1px solid black', padding: '8px' }}>{'Потребление в тыс. тонн'}</th>
        <th style={{ border: '1px solid black', padding: '8px' }}>{'Производство в тыс. тонн'}</th>
      </tr>
    );

    return rows;
  }

  const createRows = () => {
    const rows = []
    for(let i = 0; i < tableData.length; ++i){
      rows.push(
        <tr style={inter.style}>
          <td style={{ border: '1px solid black', padding: '8px' }}>{tableData[i].year}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{tableData[i].export_quantity}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{tableData[i].import_quantity}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{tableData[i].food_quantity}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{tableData[i].production_quantity}</td>
        </tr>
      )
    }

    return rows;
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
    if(tableData.length === 0){
      errors.emptyData = 'Перед выгрузкой нужно сделать запрос'
    }
    
    if (Object.keys(errors).length > 0) {
      errors.isError = true;
      setInputError(errors);
      setIsExportLoading(false)
      return
    }

    axios.post("http://192.168.99.26:8080/predict-food-balance?return_csv=true",
    {
      product: Number(formData.product.selectedOption), 
      data: []
    })
    .then(response => {
      downloadCSV(response.data, "Выгрузка")
    })
    setIsExportLoading(false)
  }

  return (
    <div>  
      <label className={styles.mainText} style={inter.style}>Просмотр данных
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
                  `}</style ></span>Выберите таблицу:</label>
              <select className={styles["rounded-select"]} 
                style={{ borderColor: inputError.requiredTable === '' || inputError.requiredTable === undefined ? '#aaa' : 'red'}} 
                value={formData.product.selectedOption} onClick={() => handleDropDownClick()} onChange={(e) => handleSelect(e.target.value)}>
                <option value={undefined} disabled selected hidden>Не выбрано</option>
                {formData.product.options.map((option) => (
                  <option value={option.product_id} key={option.product_id}>{option.product_name}</option>
                  ))}
              </select>
            </div>
          </div>
        </form>
        <div>
          <div className={styles.buttonContainer}>
              <button
                className={styles.requestButton}
                style={inter.style}
                type="button"
                onClick={handleTableRequest}
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
          <div className={styles.infoBlock}>
            {inputError.isError ? <ErrorCard inputError={inputError}/> : null}
          </div>
        </div>
      </div>
      {tableData.length !== 0 ? <div className={styles.tableContainer}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            {createHeaders()}
          </thead>  
          <tbody>
            {createRows()}
          </tbody>
        </table>
      </div> : null}
    </div>
  )
}

export default DataView