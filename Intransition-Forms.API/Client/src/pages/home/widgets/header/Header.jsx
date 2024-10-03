import styles from './main.module.css';
import logo from './itransition_logo.svg';
import Wrapper from '../../elemets/wrapper/Wrapper';
import Avatar from '../../elemets/avatar/Avatar';
import { observer } from 'mobx-react-lite';
import userState from '../../../../state/userState';
import search from './search.png';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = observer(({isSearch = true}) => {
    const [isUserPopUpOpen, setPopUpOpenState] = useState(false);
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
                            name={userState.username}
                            color={userState.color}
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
        </div>
    );
});

export default Header;