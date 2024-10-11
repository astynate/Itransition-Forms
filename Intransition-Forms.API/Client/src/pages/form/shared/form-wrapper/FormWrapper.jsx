import styles from './main.module.css';

const FormWrapper = ({children}) => {
    return (
        <div className={styles.formWrapper}>
            {children}
        </div>
    );
}

export default FormWrapper;