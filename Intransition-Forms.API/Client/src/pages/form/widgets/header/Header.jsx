import styles from './main.module.css';
import logo from './images/itransition_logo.svg';
import Avatar from '../../../home/elemets/avatar/Avatar';
import Menu from '../../features/menu/Menu';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Wrapper from '../../../home/elemets/wrapper/Wrapper';
import { observer } from 'mobx-react-lite';
import UserState from '../../../../state/UserState';
import SaveChanges from '../../../../elements/save-changes/SaveChanges';
import FormsAPI from '../../api/FormsAPI';

const Header = observer(({form, isSavingChanges = false, setSavingChanges = () => {}, setForm = () => {}}) => {
    const [currentItem, SetCurrentItem] = useState(0);
    const [previousName, setPreviousName] = useState(form ? form.title : null);
    const [timeoutId, setTimeoutId] = useState(undefined);
    const routes = ['', 'answers'];

    let params = useParams();
    let navigate = useNavigate();

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
                                if (!form.title || form.title === '') {
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
                        <Avatar 
                            name={UserState.user ? UserState.user.email : null} 
                            color={UserState.user ? UserState.user.color : null} 
                        />
                    </div>
                </div>
            </Wrapper>
            <div className={styles.bottom}>
                <Menu 
                    items={[
                        { title: 'Questions', callback: () => { navigate(`/form/${params.id}`) } },
                        { title: 'Answers', callback: () => { navigate(`/form/${params.id}/answers`) } },
                    ]}
                    currentItem={currentItem}
                />
            </div>
        </div>
    );
});

export default Header;