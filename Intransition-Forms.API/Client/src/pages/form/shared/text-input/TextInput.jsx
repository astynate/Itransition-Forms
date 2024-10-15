import { useEffect, useRef } from 'react';
import styles from './main.module.css';

const TextInput = ({
        text, 
        setText = () => {}, 
        isMultiple = false, 
        maxLength, 
        fontSize = 25, 
        fontWeight = 700,
        placeholder,
        isDigitsOnly = false,
        onClick = () => {}
    }) => {

    const textareaRef = useRef();

    useEffect(() => {
        const adjustHeight = () => {
            const value = textareaRef.current.value;
            const newHeight = value.split('\n').length * fontSize + 5;

            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${newHeight}px`;
        }

        adjustHeight();
    }, [text, textareaRef]);
    
    return (
        <textarea
            ref={textareaRef}
            placeholder={placeholder}
            className={styles.input}
            defaultValue={text}
            style={{fontSize: fontSize, fontWeight: fontWeight}}
            rows={isMultiple ? 5 : 1}
            onClick={onClick}
            maxLength={maxLength}
            onInput={(event) => {
                if (isMultiple === false)
                    event.target.value = event.target.value.replace('\n', '');

                if (isDigitsOnly === true)
                    event.target.value = parseInt(event.target.value.replace(/[^0-9]/g, ''));
                
                if (isDigitsOnly && (event.target.value.length === 0 || event.target.value === 'NaN'))
                    event.target.value = 0;

                setText(isDigitsOnly ? parseInt(event.target.value) : event.target.value);
            }}
        >
        </textarea>
    );
}

export default TextInput;