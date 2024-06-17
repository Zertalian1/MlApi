"use client"

import Stripe from '@/components/stripe/Stripe'
import styles from './about.module.css'
import { Anonymous_Pro } from 'next/font/google'

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
        <div className={styles.container}>
          <p className={styles.text} style={inter.style}>
            Надо придумать сюда текст
          </p>
        </div>
      </div>
    </div>
  )
}

export default About