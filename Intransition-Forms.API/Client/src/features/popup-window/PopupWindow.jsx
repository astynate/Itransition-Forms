import styles from './main.module.css';
import closeImage from './images/remove.png';

const PopupWindow = ({children, title, close = () => {}}) => {
    return (
        <div className={styles.popupWindowWrapper}>
            <div className={styles.popupWindow}>
                {title && <div className={styles.header}>
                    <span>{title}</span>
                    <img 
                        src={closeImage} 
                        className={styles.close} 
                        draggable="false" 
                        onClick={() => close()}
                    />
                </div>}
                {children}
            </div>
        </div>
    );
}

export default PopupWindow;