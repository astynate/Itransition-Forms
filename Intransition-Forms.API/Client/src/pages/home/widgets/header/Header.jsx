import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { instance } from '../../../../state/Interceptors';
import { useTranslation } from 'react-i18next';
import back from './images/back.png';
import styles from './main.module.css';
import logo from './images/itransition_logo.svg';
import Wrapper from '../../elemets/wrapper/Wrapper';
import search from './images/search.png';
import form from './images/itransition-form.png';
import UserState from '../../../../state/UserState';
import DateHandler from '../../../../utils/DateHandler';
import AvatarWithPopup from '../../features/avatar-with-popup/AvatarWithPopup';

const Header = ({isSearch = true}) => {
    const [currentPath, setCurrentPath] = useState(0);
    const [timeoutId, setTimeoutId] = useState(undefined);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, SetSearchOpenState] = useState(false);
    const [width, setWidth] = useState(0);
    const { t } = useTranslation();
    
    const paths = ['', 'users'];
    const params = useParams();

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
        const path = paths.findIndex(p => p === params['*']);
        setCurrentPath(path);
    }, [params]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

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
                            <div className={styles.product}>{t('applicationName')}</div>
                        </h1>
                    </Link>
                    {isSearch && 
                        <div className={styles.searchWrapper} active={isSearchOpen ? 'true' : null}>
                            {isSearchOpen && width <= 700 && <img 
                                src={back} 
                                draggable="false" 
                                className={styles.searchImage}
                                onClick={() => SetSearchOpenState(false)}
                            />}
                            <div 
                                className={styles.search} 
                                state={searchResults.length > 0 ? "opened" : null}
                                onClick={() => SetSearchOpenState(true)}
                            >
                                <img 
                                    src={search} 
                                    draggable="false" 
                                    className={styles.searchImage}
                                />
                                <input 
                                    placeholder={t('search')}
                                    onInput={HandlerInput}
                                />
                                <div className={styles.searchResults}>
                                    {searchResults.map((template) => {
                                        const isUserOwner = UserState.user && template.owner.id === UserState.user.id;
                                        const isUserAdmin = UserState.user && UserState.user.admin;

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
                            </div>
                        </div>}
                    <AvatarWithPopup />
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
}

export default Header;