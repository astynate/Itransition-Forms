import styles from './main.module.css';
import logo from './images/itransition_logo.svg';
import Wrapper from '../../elemets/wrapper/Wrapper';
import Avatar from '../../elemets/avatar/Avatar';
import userState from '../../../../state/UserState';
import search from './images/search.png';
import form from './images/itransition-form.png';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserState from '../../../../state/UserState';
import { instance } from '../../../../state/Interceptors';
import DateHandler from '../../../../utils/DateHandler';
import { MDBSwitch } from 'mdb-react-ui-kit';
import ApplicationState from '../../../../state/ApplicationState';

const Header = observer(({isSearch = true}) => {
    const [isUserPopUpOpen, setPopUpOpenState] = useState(false);
    const [currentPath, setCurrentPath] = useState(0);
    const [timeoutId, setTimeoutId] = useState(undefined);
    const [searchResults, setSearchResults] = useState([]);
    
    const paths = ['', 'users'];

    let params = useParams();
    let ref = useRef();

    useEffect(() => {
        const SetSearchResultsAsDefault = () => {
            setSearchResults([]);
        }

        document.addEventListener('click', SetSearchResultsAsDefault);
        
        return () => {
            document.removeEventListener('click', SetSearchResultsAsDefault);
        }
    }, []);

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

    useEffect(() => {
        const path = paths.findIndex(p => p === params['*']);
        setCurrentPath(path);
    }, [params]);

    const HandlerInput = (event) => {
        clearTimeout(timeoutId);

        const SendSearchRequest = async () => {
            await instance
                .get(`/api/forms/prefix/${event.target.value}`)
                .then(response => {
                    if (response.data) {
                        setSearchResults(response.data);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } 

        if (event.target.value) {
            setTimeoutId(setTimeout(SendSearchRequest, 500));
        } else {
            setSearchResults([]);
        }
    }

    return (
        <div className={styles.headerWrapper} type={isSearch === false ? 'searchless' : null}>
            <Wrapper>
                <div className={styles.header}>
                    <Link className={styles.left} to={'/'}>
                        <img src={logo} draggable="false" className={styles.logo} />
                        <h1 className={styles.company}>Itransition 
                            <div className={styles.product}>Forms</div>
                        </h1>
                    </Link>
                    {isSearch && <div className={styles.search} state={searchResults.length > 0 ? "opened" : null}>
                        <img 
                            src={search} draggable="false" 
                            className={styles.searchImage}
                        />
                        <input 
                            placeholder='Search' 
                            onInput={HandlerInput}
                        />
                        <div className={styles.searchResults}>
                            {searchResults.map((template) => {
                                const isUserOwner = UserState.user && template.owner.id === UserState.user.id;
                                const isUserAdmin = UserState.user.admin;

                                return (
                                    <Link 
                                        to={`/${isUserOwner || isUserAdmin ? 'form' : 'filling'}/${template.id}`} 
                                        className={styles.template} key={template.id}
                                        onClick={() => setSearchResults([])}
                                    >
                                        <div className={styles.name}>
                                            <img 
                                                src={form} 
                                                className={styles.form} 
                                                draggable="false"
                                            />
                                            <div className={styles.information}>
                                                <span>{template.title}</span>
                                                <span>{template.owner.email}</span>
                                            </div>
                                        </div>
                                        <span className={styles.date}>{DateHandler.Format(template.date)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>}
                    <div 
                        className={styles.user} 
                        ref={ref}
                    >
                        <div onClick={() => setPopUpOpenState(prev => !prev)}>
                            <Avatar 
                                name={userState.user ? userState.user.email : undefined}
                                color={userState.user ? userState.user.color : undefined}
                            />
                        </div>
                        {isUserPopUpOpen && <div className={styles.userPopUp}>
                            <Link to={"/login"} className={styles.button}>
                                <span>Login</span>
                            </Link>
                            <div 
                                className={styles.button} 
                                onClick={() => ApplicationState.SetDarkModeState(!ApplicationState.isDarkMode)}
                            >
                                <span>Dark mode</span>
                                <MDBSwitch
                                    checked={ApplicationState.isDarkMode}
                                    onChange={() => {}}
                                />
                            </div>
                            <Link to={"/register"} className={styles.button}>
                                <span>Register</span>
                            </Link>
                        </div>}
                    </div>
                </div>
            </Wrapper>
            {UserState.user && UserState.user.isAdmin && <div className={styles.menuWrapper}>
                <Wrapper>
                    <div className={styles.menu}>
                        <Link to={'/'} id={currentPath === 0 ? 'active' : null}>Templates</Link>
                        <Link to={'/users'} id={currentPath === 1 ? 'active' : null}>Admin panel</Link>
                    </div>
                </Wrapper>
            </div>}
        </div>
    );
});

export default Header;