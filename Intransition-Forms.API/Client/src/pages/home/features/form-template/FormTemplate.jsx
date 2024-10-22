import { useState } from 'react';
import styles from './main.module.css';

const FormTemplate = ({name = 'Empty', image, onClick = () => {}, isCreate = true}) => {
    const [isCreateButtonOpen, setCreateButtonState] = useState(!(!!image));

    return (
        <div
            className={styles.presentationTemplate} 
            onMouseEnter={() => setCreateButtonState(true)}
            onMouseLeave={() => setCreateButtonState(false)}
            onClick={onClick}
        >
            <div className={styles.image}>
                {(isCreateButtonOpen || !(!!image)) && isCreate && 
                    <div className={styles.create}>
                        <div className={styles.line} />
                        <div className={styles.line} />
                    </div>}
                {image && <img src={image} draggable="false" />}
            </div>
            <span className={styles.name}>{name}</span>
        </div>
    );
}

export default FormTemplate;