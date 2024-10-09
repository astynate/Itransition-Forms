import styles from './main.module.css';

const SimpleButton = ({callback, title, type = null}) => {
    return (
        <button 
            className={styles.button} 
            onClick={callback}
            type={type}
        >
            {title}
        </button>
    );
}

export default SimpleButton;