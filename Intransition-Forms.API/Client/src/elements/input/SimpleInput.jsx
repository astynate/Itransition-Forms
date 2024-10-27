import styles from './main.module.css';

const SimpleInput = ({errorMessage = undefined, type, onChange, placeholder, defaulValue, autoFocus}) => {
    return (
        <div className={styles.inputWrapper}>
            <input
                className={styles.simpleInput}
                type={type ?? "text"}
                placeholder={placeholder}
                onChange={onChange}
                defaultValue={defaulValue}
                autoFocus={autoFocus}
            />
            {errorMessage && <div className={styles.message}>
                <span>{errorMessage}</span>
            </div>}
        </div>
    );
}

export default SimpleInput;