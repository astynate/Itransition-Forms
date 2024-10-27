import styles from './main.module.css';

const SimpleButton = ({callback, title, type = null, forwardRef}) => {
    return (
        <button 
            className={styles.button} 
            onClick={callback}
            type={type}
            ref={forwardRef}
        >
            {title}
        </button>
    );
}

export default SimpleButton;