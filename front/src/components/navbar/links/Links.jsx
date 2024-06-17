"use client"

import Link from "next/link"
import styles from './links.module.css'
import React, { useState, useEffect } from 'react';

import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const proccesLocalStorage = () => {
  let activated = localStorage.getItem('activated');

  if(activated === null){
    localStorage.setItem('activated', 'Предсказание для продуктов');
    return 
  }
}

const Links = () => {
  useEffect(() => {
    proccesLocalStorage()
  }, [])

  const [unrealСrutch, setUnrealCrutch] = useState(localStorage.getItem('activated'))


  const links = [
		{
			title: 'Предсказание для продуктов',
			path: '/',
		},
		{
			title: 'Предсказание для показателей',
			path: '/performance_prediction'
		},
    {
			title: 'Просмотр данных',
			path: '/data_view'
		},
    {
			title: 'О проекте',
			path: '/about'
		}
	];
    
  const setStyle = (title) => {
    if(title === activated) {
      return styles.linkPressed
    }

    return styles.link
  }

  const activated = localStorage.getItem('activated')
  return (
		<div className={styles.links}>
			{links.map(((link, index) => (
        <Link 
          className={setStyle(link.title, activated)} 
          style={inter.style} 
          href={link.path} 
          key={index}
          onClick={() => {localStorage.setItem('activated', link.title); setUnrealCrutch(localStorage.getItem('activated'))}}  
          >
            {link.title}
        </Link>
			)))}    
		</div>
  )
}

export default Links