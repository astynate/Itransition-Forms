import React, { useRef, useState } from 'react';
import styles from './main.module.css';
import Header from '../widgets/header/Header';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import Users from '../pages/users/Users';
import './main.css';

const HomeLayout = observer(() => {
    const [headerState, SetHeaderState] = useState(null);
    const headerRef = useRef();
    const wrapperRef = useRef();

    const HandlerScroll = () => {
        if (wrapperRef.current && headerRef.current) {
            const scroll = wrapperRef.current.scrollTop;
            const header = headerRef.current.offsetTop;
            
            SetHeaderState(scroll + 62 > header ? 'sticky' : null);
        }
    }

    return (
        <div className={styles.wrapper} ref={wrapperRef} onScroll={HandlerScroll}>
            <Header />
            <Routes>
                <Route 
                    path='/' 
                    element={<HomePage headerState={headerState} headerRef={headerRef} />} 
                />
                <Route 
                    path='/users' 
                    element={<Users />} 
                />
            </Routes>
        </div>
    );
});

export default HomeLayout;
