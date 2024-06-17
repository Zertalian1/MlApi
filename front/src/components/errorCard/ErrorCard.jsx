import styles from "./errorCard.module.css"
import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const ErrorCard = ({inputError}) => {
  
  return (
    <div className={`${styles.container} ${inputError.isError ? 'fadeIn' : ''}`}>
      <label className={styles.title} style={inter.style}>Ошибка</label>
      {(inputError.emptyData || inputError.requiredTable || inputError.checkedError || inputError.requiredYear || inputError.requiredProduct || inputError.endDotError || inputError.startDotError || inputError.zeroError || inputError.fieldsError || inputError.lengthError) && 
            (<div className={styles.errorContainer} style={inter.style}>
              {(inputError.requiredYear || inputError.requiredProduct) && <div style={{color: 'red'}}>Обязательные параметры должны быть заполнены</div>}
              {inputError.checkedError && <div style={{color: 'red'}}>{inputError.checkedError}</div>}
              {inputError.endDotError && <div style={{color: 'red'}}>{inputError.endDotError.message}</div>}
              {inputError.startDotError && <div style={{color: 'red'}}>{inputError.startDotError.message}</div>}
              {inputError.zeroError && <div style={{color: 'red'}}>{inputError.zeroError.message}</div>}
              {inputError.lengthError && <div style={{color: 'red'}}>{inputError.lengthError.message}</div>}
              {inputError.fieldsError && <div style={{color: 'red'}}>{inputError.fieldsError.message}</div>}
              {inputError.requiredTable && <div style={{color: 'red'}}>{inputError.requiredTable}</div>}
              {inputError.emptyData && <div style={{color: 'red'}}>{inputError.emptyData}</div>}
            </div>)}
    </div>
  );
};
  
export default ErrorCard;