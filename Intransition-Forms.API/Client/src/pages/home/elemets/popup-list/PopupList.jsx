import { useEffect } from 'react';
import styles from './main.module.css';

const PopupList = ({items = [], isOpen = false, setOpenState = () => {}, forwardRef}) => {
    useEffect(() => {
        const CloseList = (event) => {
            if (forwardRef.current && !forwardRef.current.contains(event.target)) {
                setOpenState(false);
            }
        }

        document.addEventListener('click', CloseList);

        return () => {
            document.removeEventListener('click', CloseList);
        }
    }, []);

    if (isOpen === false) {
        return null;
    }

    return (
        <div className={styles.list}>
            {items.map((item, index) => {
                return (
                    <div className={styles.item} key={index} onClick={(event) => item.callback ? item.callback(event) : null}>
                        <span>{item.title}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default PopupList;