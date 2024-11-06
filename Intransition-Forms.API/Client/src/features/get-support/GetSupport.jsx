import styles from './main.module.css';
import help from './help.png';
import PopupWindow from '../popup-window/PopupWindow';
import Select from '../../pages/form/shared/select/Select';
import SimpleButton from '../../elements/button/SimpleButton';
import { useState } from 'react';
import { instance } from '../../state/Interceptors';

const GetSupport = () => {
    const priorities = ['Low', 'Average', 'High'];
    const [isOpen, setOpenState] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriorities] = useState(priorities[0]);

    const SendReportIssue = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let form = new FormData();

        form.append('title', title);
        form.append('description', description);
        form.append('priority', priority);
        form.append('link', window.location.href);

        await instance
            .post('/api/jira', form)
            .then(_ => {
                setOpenState(false);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>       
            {isOpen && <PopupWindow title={'Report an issue'} close={() => setOpenState(false)}>
                <form className={styles.wrapper} onSubmit={SendReportIssue}>
                    <div className={styles.item}>
                        <span>Priority</span>
                        <div>
                            <Select
                                items={priorities}
                                value={priority}
                                onChange={(e) => setPriorities(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.item}>
                        <span>Title</span>
                        <input 
                            placeholder='Title' 
                            onInput={(e) => setTitle(e.target.value)} 
                            required
                        />
                    </div>
                    <div className={styles.item}>
                        <span>Description</span>
                        <textarea 
                            className={styles.textarea} 
                            placeholder='Description'
                            onInput={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    <div className={styles.item}>
                        <SimpleButton 
                            title={"Report"}
                        />
                    </div>
                </form>
            </PopupWindow>}
            <div className={styles.getSupport} onClick={() => setOpenState(true)}>
                <img src={help} />
            </div>
        </>
    );
}

export default GetSupport;