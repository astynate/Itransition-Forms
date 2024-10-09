import styles from './main.module.css';

const SimpleInput = ({type, onChange, placeholder, defaulValue, autoFocus}) => {
    return (
        <input
            className={styles.simpleInput}
            type={type ?? "text"}
            placeholder={placeholder}
            onChange={onChange}
            defaultValue={defaulValue}
            autoFocus={autoFocus}
        />
    );
}

export default SimpleInput;