import { useState } from 'react';
import SimpleButton from '../../../../elements/button/SimpleButton';
import SimpleInput from '../../../../elements/input/SimpleInput';
import PopupWindow from '../../../../features/popup-window/PopupWindow';
import styles from './main.module.css';
import { instance } from '../../../../state/Interceptors';
import FormsState from '../../../../state/FormsState';

const RenamePopup = ({setOpenState = () => {}, form, SetSelectedForm = () => {}}) => {
    const [formTitle, setFormTitle] = useState(form ? form.title : null);

    if (form === undefined) { 
        return null; 
    }

    const SendRenameRequest = async () => {
        let formData = new FormData();

        formData.append('id', form.id);
        formData.append('title', formTitle);

        await instance
            .put('/api/forms', formData)
            .then(response => {
                if (response.data) {
                    FormsState.UpdateLatestForms(response.data);

                    setOpenState(false);
                    SetSelectedForm(undefined);
                }
            })
            .catch(error => {
                console.error(error);
                alert("Something went wrong");
            })
    }

    return (
        <PopupWindow>
            <div className={styles.rename}>
                <h2>Rename</h2>
                <SimpleInput 
                    placeholder={'Form name'} 
                    defaulValue={formTitle} 
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    autoFocus={true}
                />
                <br />
                <div className={styles.buttons} >
                    <SimpleButton 
                        title={'Cancel'} 
                        type={'sub'} 
                        callback={() => {
                            setOpenState(false);
                            SetSelectedForm(undefined);
                        }}  
                    />
                    <SimpleButton 
                        title={'Save'} 
                        callback={SendRenameRequest}
                    />
                </div>
            </div>
        </PopupWindow>
    );
}

export default RenamePopup;