import { useState } from 'react';
import Avatar from '../../home/elemets/avatar/Avatar';
import styles from './main.module.css';

const RegistrationForm = ({name, button, inputs=[], action='/api/login', isColorPicker = false}) => {
    const [selectedColor, setSelectedColorState] = useState(0);
    const [fields, setFields] = useState([]);

    const SendRequest = async () => {
        let form = new FormData();

        if (fields.length !== inputs.length && inputs.length > 0) {
            alert(`${inputs[0].placeholder} is required`);
        }

        for (let i = 0; i < fields.length; i++) {
            if (!fields[i] || !fields[i].name || !fields[i].value) {
                alert(`${inputs[i].name} is required`);
                return;
            }

            form.append(fields[i].name, fields[i].value);
        }

        if (isColorPicker) {
            form.append('color', selectedColor);
        }

        await fetch(action, {
            method: "POST",
            body: form
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className={styles.form}>
            <h1>{name}</h1>
            <br />
            {inputs.map((input, index) => {
                return (
                    <input
                        key={index}
                        required
                        type={input.type ?? "text"}
                        placeholder={input.placeholder}
                        onChange={(event) => {setFields(prev => {
                            prev[index] = {
                                ...inputs[index],
                                value: event.target.value
                            };
                            
                            return prev;
                        })}}
                    />
                );
            })}
            {isColorPicker && <div className={styles.colors}>
                <div 
                    className={styles.color} 
                    state={selectedColor === 0 ? 'selected' : null}
                    onClick={() => {setSelectedColorState(0)}}
                >
                    <Avatar color={0} />
                </div>
                <div 
                    className={styles.color} 
                    state={selectedColor === 1 ? 'selected' : null}
                    onClick={() => {setSelectedColorState(1)}}
                >
                    <Avatar color={1} />
                </div>
                <div 
                    className={styles.color} 
                    state={selectedColor === 2 ? 'selected' : null}
                    onClick={() => {setSelectedColorState(2)}}
                >
                    <Avatar color={2} />
                </div>
            </div>}
            <button 
                className={styles.button} 
                onClick={SendRequest}
            >
                {button}
            </button>
        </div>
    );
}

export default RegistrationForm;