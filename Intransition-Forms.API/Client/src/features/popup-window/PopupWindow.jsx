import styles from './main.module.css';

const PopupWindow = ({children}) => {
    return (
        <div className={styles.popupWindowWrapper}>
            <div className={styles.popupWindow}>
                {children}
            </div>
        </div>
    );
}

export default PopupWindow;