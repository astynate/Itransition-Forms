import React from 'react';
import styles from './main.module.css';
import Header from '../widgets/header/Header';
import Create from '../widgets/create/Create';
import Wrapper from '../elemets/wrapper/Wrapper';
import './main.css';

const HomePage = () => {
    return (
        <div className={styles.wrapper}>
            <title>Itransition Presintations</title>
            <Header />
            <Create />
            <Wrapper>
            </Wrapper>
        </div>
    );
}

export default HomePage;
