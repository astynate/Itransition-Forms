import styles from './main.module.css';

const RangeAnswer = ({min = 0, max = 100}) => {
    return (
        <input 
            type='number'
            min={0}
            max={100}
            className={styles.range}
            onInput={(event) => {
                event.target.value = parseInt(event.target.value);

                if (event.target.value < min)
                    event.target.value = min;

                if (event.target.value > max)
                    event.target.value = max;

                if (event.target.value === '')
                    event.target.value = 0;
            }}
        />
    );
}

export default RangeAnswer;