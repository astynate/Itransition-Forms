import styles from './main.module.css';

const SaveChanges = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.loading}></div>
            <span>Save changes</span>
        </div>
    );
}

export default SaveChanges;