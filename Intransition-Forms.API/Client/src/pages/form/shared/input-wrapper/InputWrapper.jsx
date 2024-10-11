import styles from './main.module.css';
import remove from './remove.png';

const InputWrapper = ({children}) => {
    return (
        <div className={styles.inputWrapper}>
            <div className={styles.drag}>
                {Array.from({ length: 6 }).map((_, index) => {
                    return (<div key={index} className={styles.point}></div>);
                })}
            </div>
            {children}
            <div className={styles.button}>
                <img src={remove} draggable="false" />
            </div>
        </div>
    );
}

export default InputWrapper;