import styles from './main.module.css';

const FormWrapper = ({children, onDragStart = () => {}, isDragAvailable = false}) => {
    return (
        <div 
            className={styles.formWrapper} 
            onDragStart={onDragStart}
            draggable={isDragAvailable}
            id='question'
        >
            {children}
        </div>
    );
}

export default FormWrapper;