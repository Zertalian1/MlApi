
import styles from "./infoCard.module.css"
import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const InfoCard = ({title, text}) => {
  return (
    <div className={styles.container}>
      <label className={styles.title} style={inter.style}>
        {title}
      </label>
      <div 
        className={styles.stripe}
      />
      <p className={styles.text} style={inter.style}>{text}</p>
    </div>
  );
};
  
export default InfoCard;