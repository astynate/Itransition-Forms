import { useEffect } from 'react';
import styles from './main.module.css';

const CheckboxAnswer = ({answer, answerValue = {}, setAnswer = () => {}, isEditable = true}) => {
    return (
        <div className={styles.checkbox}>
            <input 
                type='checkbox' 
                defaultChecked={answerValue.value ? answerValue.value : answer.defaultValue}
                value={answerValue.value ? answerValue.value : answer.defaultValue}
                onChange={(e) => {
                    if (isEditable === true) {
                        setAnswer(!!e.target.checked);
                    } else {
                        e.target.checked = answerValue.value;
                        e.preventDefault();
                    }
                }} 
            />
            <span>{answer.title}</span>
        </div>
    );
}

export default CheckboxAnswer;