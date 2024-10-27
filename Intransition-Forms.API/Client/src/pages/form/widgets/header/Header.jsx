import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import eye from './images/eye.png';
import styles from './main.module.css';
import logo from './images/itransition_logo.svg';
import Menu from '../../features/menu/Menu';
import Wrapper from '../../../home/elemets/wrapper/Wrapper';
import SaveChanges from '../../../../elements/save-changes/SaveChanges';
import FormsAPI from '../../api/FormsAPI';
import AvatarWithPopup from '../../../home/features/avatar-with-popup/AvatarWithPopup';
import { useTranslation } from 'react-i18next';

const Header = observer(({form, isSavingChanges = false, setSavingChanges = () => {}, setForm = () => {}}) => {
    const [currentItem, SetCurrentItem] = useState(0);
    const [previousName, setPreviousName] = useState(form ? form.title : null);
    const [timeoutId, setTimeoutId] = useState(undefined);
    
    const routes = ['', 'answers', 'statistic'];
    const { t } = useTranslation();

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        SetCurrentItem(routes
            .findIndex(route => route === params['*']));
    }, [params]);

    return (
        <div className={styles.header}>
            <Wrapper>
                <div className={styles.top}>
                    <div className={styles.left}>
                        <Link to='/' className={styles.logo}>
                            <img src={logo} draggable="false" />
                        </Link>
                        <input 
                            maxLength={25}
                            value={form ? form.title : 'Loading...'}
                            onChange={(event) => {
                                if (form) {
                                    clearTimeout(timeoutId);

                                    const SendRequest = async () => {
                                        setSavingChanges(true);
                                        await FormsAPI.SendRenameRequest(form.id, event.target.value);
                                        setSavingChanges(false);
                                    }

                                    setForm(prev => {
                                        return { ...prev, title: event.target.value };
                                    });

                                    setTimeoutId(setTimeout(SendRequest, 500));
                                }
                            }}
                            onFocus={() => {
                                setPreviousName(form ? form.title : undefined);
                            }}
                            onBlur={async () => {
                                if (form && (!form.title || form.title === '')) {
                                    setForm(prev => {
                                        return { ...prev, title: previousName };
                                    });
                                }
                            }}
                            className={styles.nameInput} 
                        />
                    </div>
                    <div className={styles.right}>
                        {isSavingChanges && <SaveChanges />}
                        <Link to={`/filling/${params.id}`} className={styles.show}>
                            <img src={eye} draggable="false" />
                        </Link>
                        <AvatarWithPopup />
                    </div>
                </div>
            </Wrapper>
            <div className={styles.bottom}>
                <Menu 
                    items={[
                        { title: t('questions'), callback: () => navigate(`/form/${params.id}`) },
                        { title: t('answers'), callback: () => navigate(`/form/${params.id}/answers`) },
                        { title: t('statistic'), callback: () => navigate(`/form/${params.id}/statistic`) }
                    ]}
                    currentItem={currentItem}
                />
            </div>
        </div>
    );
});

export default Header;