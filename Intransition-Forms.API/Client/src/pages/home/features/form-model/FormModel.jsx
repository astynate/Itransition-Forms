import { useRef, useState } from 'react';
import PopupList from '../../elemets/popup-list/PopupList';
import styles from './main.module.css';
import menu from './menu.png';

const FormModel = ({title = "Form", owner = "Unknown", openRenameForm = () => {}}) => {
    const [isPropertiesListOpen, SetListOpenState] = useState(false);
    let ref = useRef();

    return (
        <div className={styles.formWrapper}>
            <div className={styles.form}>
                <div className={styles.image}>

                </div>
                <div className={styles.information}>
                    <div className={styles.left}>
                        <span className={styles.name}>{title}</span>
                        <span className={styles.owner}>{owner}</span>
                    </div>
                    <button className={styles.button} ref={ref} onClick={() => SetListOpenState(true)}>
                        <img src={menu} draggable="false" className={styles.menu} />
                    </button>
                </div>
            </div>
            <PopupList 
                isOpen={isPropertiesListOpen}
                setOpenState={SetListOpenState}
                forwardRef={ref}
                items={[
                    { title: "Rename", callback: openRenameForm },
                    { title: "Delete", callback: openRenameForm },
                ]}
            />
        </div>
    );
}

export default FormModel;