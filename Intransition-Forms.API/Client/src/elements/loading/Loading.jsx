import styles from './main.module.css';

const Loading = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.line}></div>
        </div>
    );
}

export default Loading;