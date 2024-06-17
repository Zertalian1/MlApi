"use client"
import React, { useState } from 'react';
import styles from "./predictionField.module.css"
import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const PredictionField = ({isCheckboxChecked, handleCheckboxChange, inputPlaceholder}) => {
  return (
    <div className={styles.block}>
      <div className={!isCheckboxChecked ? styles.closedInput : styles.openInput} style={inter.style}>
        {inputPlaceholder}
      </div>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={isCheckboxChecked}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}

export default PredictionField;