import PopupWindow from '../../features/popup-window/PopupWindow';
import styles from './main.module.css';

const MessageBox = ({title, message}) => {
    return (
        <PopupWindow>
            <div className={styles.messageBox}>
                <div className={styles.top}>
                    <h1>{title}</h1>
                    <span>{message}</span>
                </div>
                <div className={styles.bottom}>
                    <span>Ok</span>
                </div>
            </div>
        </PopupWindow>
    );
}

export default MessageBox;