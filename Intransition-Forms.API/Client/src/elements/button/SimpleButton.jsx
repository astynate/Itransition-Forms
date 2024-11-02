import styles from './main.module.css';

const SimpleButton = ({callback, title, type = null, forwardRef, isFillFullWidth = false}) => {
    return (
        <button 
            className={styles.button} 
            onClick={callback}
            type={type}
            style={{width: isFillFullWidth ? "100%" : "fit-content"}}
            ref={forwardRef}
        >
            {title}
        </button>
    );
}

export default SimpleButton;