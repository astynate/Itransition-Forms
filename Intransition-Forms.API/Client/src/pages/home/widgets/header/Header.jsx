import styles from './main.module.css';
import logo from './itransition_logo.svg';
import Wrapper from '../../elemets/wrapper/Wrapper';
import Avatar from '../../elemets/avatar/Avatar';
import userState from '../../../../state/UserState';
import search from './search.png';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserState from '../../../../state/UserState';

const Header = observer(({isSearch = true}) => {
    const [isUserPopUpOpen, setPopUpOpenState] = useState(false);
    const [currentPath, setCurrentPath] = useState(0);
    
    const paths = ['', 'users'];

    let params = useParams();
    let ref = useRef();

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
                    {isSearch && <div className={styles.search}>
                        <img src={search} draggable="false" />
                        <input placeholder='Search' />
                    </div>}
                    <div 
                        className={styles.user} 
                        onClick={() => setPopUpOpenState(prev => !prev)}
                        ref={ref}
                    >
                        <Avatar 
                            name={userState.user ? userState.user.email : undefined}
                            color={userState.user ? userState.user.color : undefined}
                        />
                        {isUserPopUpOpen && <div className={styles.userPopUp}>
                            <Link to={"/login"} className={styles.button}>
                                <span>Login</span>
                            </Link>
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