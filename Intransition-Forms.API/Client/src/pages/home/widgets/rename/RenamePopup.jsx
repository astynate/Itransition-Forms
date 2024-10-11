import { useState } from 'react';
import SimpleButton from '../../../../elements/button/SimpleButton';
import SimpleInput from '../../../../elements/input/SimpleInput';
import PopupWindow from '../../../../features/popup-window/PopupWindow';
import styles from './main.module.css';
import FormsAPI from '../../../form/api/FormsAPI';

const RenamePopup = ({setOpenState = () => {}, form, SetSelectedForm = () => {}}) => {
    const [formTitle, setFormTitle] = useState(form ? form.title : null);

    if (form === undefined) { 
        return null; 
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
                        callback={() => {
                            FormsAPI.SendRenameRequest(form.id, formTitle);
                            setOpenState(false);
                            SetSelectedForm(undefined);
                        }}
                    />
                </div>
            </div>
        </PopupWindow>
    );
}

export default RenamePopup;