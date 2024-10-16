import styles from './main.module.css';

const RangeAnswer = ({answer, answerValue = {}, setAnswer = () => {}}) => {
    return (
        <input 
            type='number'
            min={answer.minValue}
            max={answer.maxValue}
            defaultValue={answerValue.value ? answerValue.value : answer.minValue}
            className={styles.range}
            onInput={(event) => {
                event.target.value = parseInt(event.target.value);

                if (event.target.value < answer.minValue)
                    event.target.value = answer.minValue;

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