import styles from './main.module.css';

const RangeAnswer = ({answer, answerValue = {}, setAnswer = () => {}, isEditable = true}) => {
    return (
        <input 
            type={isEditable === false ? 'text' : 'number'}
            min={answer.minValue}
            max={answer.maxValue}
            defaultValue={answerValue.value ? answerValue.value : answer.minValue}
            className={styles.range}
            onFocus={(event) => {
                if (isEditable === false) {
                    event.target.blur();
                    event.preventDefault();
                }
            }}
            onInput={(event) => {
                if (isEditable === false) {
                    event.preventDefault();
                    return;
                }

                event.target.value = parseInt(event.target.value);

                if (event.target.value > answer.maxValue)
                    event.target.value = answer.maxValue;

                if (event.target.value === '' || event.target.value === 'NaN')
                    event.target.value = 0;

                setAnswer(parseInt(event.target.value));
            }}
        />
    );
}

export default RangeAnswer;