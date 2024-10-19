import { useRef, useState } from 'react';
import PopupList from '../../elemets/popup-list/PopupList';
import styles from './main.module.css';
import menu from './menu.png';
import { instance } from '../../../../state/Interceptors';
import FormsState from '../../../../state/FormsState';
import { Link } from 'react-router-dom';

const FormModel = ({form = { title: "Form", owner: "Unknown" }, openRenameForm = () => {}, isFilligOut = false}) => {
    const [isPropertiesListOpen, SetListOpenState] = useState(false);
    const ref = useRef();

    const SendDeleteRequest = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (form && form.id) {
            event.preventDefault();
            event.stopPropagation();

            await instance
                .delete(`/api/forms?id=${form.id}`)
                .then(_ => {
                    FormsState.Delete(form.id);
                })
                .catch(error => {
                    console.error(error);
                    alert("Something went wrong");
                });
        }
    }

    return (
        <Link to={`/${isFilligOut ? 'filling' : 'form'}/${form.id}`} className={styles.formWrapper}>
            <div className={styles.form}>
                <div className={styles.image}>

                </div>
                <div className={styles.information}>
                    <div className={styles.left}>
                        <span className={styles.name}>{form.title}</span>
                        {isFilligOut ? 
                                <span className={styles.owner}>Filling out</span>
                            :   <span className={styles.owner}>{form.owner ? form.owner.email : null}</span>}
                    </div>
                    {isFilligOut === false && <button 
                        className={styles.button} 
                        ref={ref} 
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            
                            SetListOpenState(true);
                        }}
                    >
                        <img src={menu} draggable="false" className={styles.menu} />
                    </button>}
                </div>
            </div>
            <PopupList 
                isOpen={isPropertiesListOpen}
                setOpenState={SetListOpenState}
                forwardRef={ref}
                items={[
                    { title: "Rename", callback: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        openRenameForm();
                    }},
                    { title: "Delete", callback: SendDeleteRequest },
                ]}
            />
        </Link>
    );
}

export default FormModel;