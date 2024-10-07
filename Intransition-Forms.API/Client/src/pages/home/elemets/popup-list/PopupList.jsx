import styles from './main.module.css';
import arrow from './arrow.svg';
import check from './check.png';
import { useState } from 'react';

const PopupList = ({title, items = [], selected=[], setSelected = ([]) => {}}) => {
    const [isListOpen, setOpenState] = useState(false);
    
    return (
        <div className={styles.popupListWrapper}>
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
                                setSelected(prev => {
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

export default PopupList;