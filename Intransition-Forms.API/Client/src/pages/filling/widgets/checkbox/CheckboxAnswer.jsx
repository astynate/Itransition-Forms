import styles from './main.module.css';

const CheckboxAnswer = ({text = "Checkbox"}) => {
    return (
        <div className={styles.checkbox}>
            <input type='checkbox' />
            <span>{text}</span>
        </div>
    );
}

export default CheckboxAnswer;