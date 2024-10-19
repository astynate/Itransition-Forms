import styles from './main.module.css';
import arrow from './arrow.svg';
import check from './check.png';
import { useEffect, useRef, useState } from 'react';

const Select = ({
        title, 
        items = [], 
        selected = [], 
        setSelected = ([]) => {}, 
        isMultimpleChoiseAvailable
    }) => {

    const [isListOpen, setOpenState] = useState(false);
    const ref = useRef();
    
    useEffect(() => {
        const SetOpenStateFalse = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpenState(false);
            }
        }
        
        document.addEventListener('click', SetOpenStateFalse);

        return () => {
            document.removeEventListener('click', SetOpenStateFalse);
        }
    }, []);
    
    return (
        <div className={styles.popupListWrapper} ref={ref}>
            <div className={styles.titleWrapper} onClick={() => setOpenState(prev => !prev)}>
                <span className={styles.title}>{title}</span>
                <img src={arrow} draggable="false" className={styles.arrow} state={isListOpen ? 'open' : null} />
            </div>
            {isListOpen && <div className={styles.list}>
                {items.map((item, index) => {
                    const isSelected = selected.includes(index) ? 'selected' : null;

                    return (
                        <div 
                            key={index}
                            className={styles.popUpItem}
                            state={isSelected}
                            onClick={() => {
                                if (item.callback) {
                                    item.callback();
                                }

                                setSelected(prev => {
                                    if (!isMultimpleChoiseAvailable)
                                        return [index];

                                    const itemIndex = prev.indexOf(index);
                                
                                    if (itemIndex !== -1) {
                                        return prev.filter((_, i) => i !== itemIndex);
                                    } else {
                                        return [...prev, index];
                                    }
                                });
                            }}
                        >
                            {isSelected ? 
                                <img src={check} />
                            :
                                <div className={styles.placeholder}></div>
                            }
                            <span>{item.title}</span>
                        </div>
                    );
                })}
            </div>}
        </div>
    );
}

export default Select;