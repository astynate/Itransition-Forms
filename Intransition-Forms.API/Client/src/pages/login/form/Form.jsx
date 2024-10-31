import { useEffect, useRef, useState } from 'react';
import Avatar from '../../home/elemets/avatar/Avatar';
import styles from './main.module.css';
import userState from '../../../state/userState';
import { useNavigate } from 'react-router-dom';
import SimpleInput from '../../../elements/input/SimpleInput';
import SimpleButton from '../../../elements/button/SimpleButton';
import ApplicationState from '../../../state/ApplicationState';
import { instance } from '../../../state/Interceptors';
import FormsState from '../../../state/FormsState';

const RegistrationForm = ({name, button, inputs=[], action='/api/login', isColorPicker = false}) => {
    const [selectedColor, setSelectedColorState] = useState(0);
    const [fields, setFields] = useState([]);
    const [inputsValue, setInputsValue] = useState(inputs);

    let ref = useRef();
    let navigate = useNavigate();

    const SetInputByIndex = (index, func) => {
        setInputsValue(prev => {
            return prev.map((item, i) => {
                if (index === i) {
                    return func(item);
                }

                return item;
            });
        })
    }

    const SendRequest = async () => {
        let form = new FormData();

        if (fields.length !== inputsValue.length && inputsValue.length > 0) {
            SetInputByIndex(0, (item) => {
                item.errorMessage = "This field is required";
                return item;
            });

            return;
        }

        for (let i = 0; i < fields.length; i++) {
            const validationResult = inputsValue[i].validator(fields[i].value);

            if (validationResult.isValid === false) {
                SetInputByIndex(i, (item) => {
                    item.errorMessage = validationResult.error;
                    return item;
                });

                return;
            }

            form.append(fields[i].name, fields[i].value);
        }

        if (isColorPicker) {
            form.append('color', selectedColor);
        }

        await instance.post(action, form)
            .then(response => {
                if (response.status === 200) {
                    const accessToken = response.headers['access-token'];
                    
                    if (accessToken) {
                        localStorage.setItem('Access-Token', accessToken);
                        FormsState.setLatestForms([]);
                    }
                }
        
                return response.data;
            })
            .then(data => {
                if (data) {
                    userState.SetUser(data);
                    navigate('/');
                }
            })
            .catch(error => {
                ApplicationState.AddErrorInQueueByError("Attention!", error);
                console.error(error);
            });
    }

    useEffect(() => {
        const clearInputs = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setInputsValue(prev => {
                    return prev.map(item => {
                        return { ...item, errorMessage: undefined };
                    });
                });
            }
        }

        document.addEventListener("click", clearInputs);
        setInputsValue(inputs);

        return () => {
            document.removeEventListener("click", clearInputs);
        }
    }, [inputs]);

    return (
        <div className={styles.form}>
            <h1>{name}</h1>
            <br />
            {inputsValue.map((input, index) => {
                return (
                    <SimpleInput
                        key={index}
                        type={input.type}
                        placeholder={input.placeholder}
                        autoFocus={index === 0}
                        errorMessage={inputsValue[index].errorMessage}
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
            <div className={styles.bottom}>
                <SimpleButton 
                    forwardRef={ref}
                    title={button}
                    callback={SendRequest} 
                />
            </div>
        </div>
    );
}

export default RegistrationForm;