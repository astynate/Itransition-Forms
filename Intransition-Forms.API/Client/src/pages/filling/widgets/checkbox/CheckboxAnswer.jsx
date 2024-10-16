import styles from './main.module.css';

const CheckboxAnswer = ({answer, answerValue = {}, setAnswer = () => {}}) => {
    return (
        <div className={styles.checkbox}>
            <input 
                type='checkbox' 
                defaultChecked={answerValue.value ? answerValue.value : answer.defaultValue}
                value={answerValue.value ? answerValue.value : answer.defaultValue}
                onChange={(e) => setAnswer(!!e.target.checked)} 
            />
            <span>{answer.title}</span>
        </div>
    );
}

export default CheckboxAnswer;