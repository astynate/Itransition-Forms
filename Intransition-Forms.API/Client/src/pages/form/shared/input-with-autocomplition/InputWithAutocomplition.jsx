import { useEffect, useState } from 'react';
import styles from './main.module.css';

const InputWithAutocomplition = ({
        placeholder = "Enter a new tag", 
        value = "",
        values = [],
        onInput = () => {}, 
        onBlur = () => {},
        setValues = () => {},
        sendRequest = () => {},
        onEnter = () => {}
    }) => {

    const [timeoutId, setTimeoutId] = useState(undefined);

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Enter' && !!value) {
                onEnter(value);
                onInput('');
            }
        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [value, onEnter]);

    return (
        <div className={styles.wrapper}>
            <input 
                placeholder={placeholder}
                maxLength={20}
                value={value}
                onInput={(event) => {
                    clearTimeout(timeoutId);
                    onInput(event.target.value);
                    setTimeoutId(setTimeout(() => sendRequest(event.target.value), 500));
                }} 
                onBlur={onBlur}
            />
            {values.length > 0 && <div className={styles.autocomplition}>
                {values.map((v, index) => {
                    return (
                        <div 
                            key={index} 
                            className={styles.value}
                            onClick={() => {
                                onEnter(v);
                                onInput('');
                                setValues([]);
                            }}
                        >
                            {v}
                        </div>
                    );
                })}
            </div>}
        </div>
    );
}

export default InputWithAutocomplition;