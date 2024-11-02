import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MDBSwitch } from 'mdb-react-ui-kit';
import { changeLanguage } from '../../../../i18n';
import { Form } from 'react-bootstrap';
import UserState from '../../../../state/UserState';
import Avatar from '../../elemets/avatar/Avatar';
import styles from './main.module.css';
import back from './images/back.png';
import right from './images/right.png';
import ApplicationState from '../../../../state/ApplicationState';
import SalesforceManager from '../../widgets/salesforce-manager/SalesforceManager';

const AvatarWithPopup = () => {
    const [openPanel, setOpenPanelState] = useState(0);
    const [isUserPopUpOpen, setPopUpOpenState] = useState(false);
    const [isSalesforceManager, setSalesforceManagerState] = useState(false);
    const { t, i18n } = useTranslation();
    const ref = useRef();

    useEffect(() => {
        const clickHandler = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setPopUpOpenState(false);
            }
        };

        document.addEventListener('click', clickHandler);

        return () => {
            document.removeEventListener('click', clickHandler);
        };
    }, []);

    return (
        <>
            {isSalesforceManager && <SalesforceManager close={() => setSalesforceManagerState(false)} />}
            <div 
                className={styles.user} 
                ref={ref}
            >
                <div onClick={() => setPopUpOpenState(prev => !prev)}>
                    <Avatar
                        name={UserState.user ? UserState.user.email : undefined}
                        color={UserState.user ? UserState.user.color : undefined}
                    />
                </div>
                {isUserPopUpOpen && <div className={styles.userPopUp}>
                    {openPanel === 0 && 
                        <>
                            <Link to={"/login"} className={styles.button}>
                                <span>{t('login')}</span>
                            </Link>
                            <div 
                                className={styles.button} 
                                onClick={() => ApplicationState.SetDarkModeState(!ApplicationState.isDarkMode)}
                            >
                                <span>{t('dark-theme')}</span>
                                <MDBSwitch
                                    checked={ApplicationState.isDarkMode}
                                    onChange={() => {}}
                                />
                            </div>
                            <div 
                                className={styles.button} 
                                onClick={(e) => {
                                    setOpenPanelState(1);
                                    e.stopPropagation();
                                }}
                            >
                                <span>{t('language')} (EN)</span>
                                <img src={right} draggable="false" />
                            </div>
                            <Link to={"/register"} className={styles.button}>
                                <span>{t('register')}</span>
                            </Link>
                            <div className={styles.button} onClick={() => setSalesforceManagerState(true)}>
                                <span>Manage Salesforce</span>
                            </div>
                        </>}
                    {openPanel === 1 && 
                        <>
                            <div 
                                className={styles.back} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenPanelState(0);
                                }}
                            >
                                <img src={back} draggable={false} />
                                <span>Back</span>
                            </div>
                            <div className={styles.button} onClick={() => changeLanguage('en')}>
                                <span>English (UK)</span>
                                <Form.Check
                                    checked={i18n.language === 'en'}
                                    type={'radio'}
                                    onChange={() => {
                                        changeLanguage('en');
                                    }}
                                />
                            </div>
                            <div className={styles.button} onClick={() => changeLanguage('be')}>
                                <span>Беларускі (BE)</span>
                                <Form.Check
                                    checked={i18n.language === 'be'}
                                    type={'radio'}
                                    onChange={() => {
                                        changeLanguage('be');
                                    }}
                                />
                            </div>
                        </>}
                </div>}
            </div>
        </>
    );
}

export default AvatarWithPopup;