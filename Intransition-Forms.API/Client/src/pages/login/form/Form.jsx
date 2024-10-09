import { useState } from 'react';
import Avatar from '../../home/elemets/avatar/Avatar';
import styles from './main.module.css';
import userState from '../../../state/UserState';
import { useNavigate } from 'react-router-dom';
import SimpleInput from '../../../elements/input/SimpleInput';
import SimpleButton from '../../../elements/button/SimpleButton';

const RegistrationForm = ({name, button, inputs=[], action='/api/login', isColorPicker = false}) => {
    const [selectedColor, setSelectedColorState] = useState(0);
    const [fields, setFields] = useState([]);
    let navigate = useNavigate();

    const SendRequest = async () => {
        let form = new FormData();

        if (fields.length !== inputs.length && inputs.length > 0) {
            alert(`${inputs[0].placeholder} is required`);
            return;
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
        .then(response => {
            if (response.ok) {
                const accessToken = response.headers.get('Access-Token');
                
                if (accessToken) {
                    localStorage.setItem('Access-Token', accessToken);
                }
            }

            return response.json();
        })
        .then(response => {
            if (response) {
                userState.SetUser(response);
                navigate('/');
            }
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
                    <SimpleInput
                        key={index}
                        type={input.type}
                        placeholder={input.placeholder}
                        autoFocus={index === 0}
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
            <br />
            <br />
            <SimpleButton 
                title={button}
                callback={SendRequest} 
            />
        </div>
    );
}

export default RegistrationForm;