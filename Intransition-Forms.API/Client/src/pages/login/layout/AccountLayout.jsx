import React from 'react';
import styles from './main.module.css';
import Header from '../../home/widgets/header/Header';

const AccountLayout = ({children}) => {
    return (
        <div className={styles.wrapper}>
            <Header isSearch={false} />
            <div className={styles.formWrapper}>
                {children}
            </div>
        </div>
    );
};

export default AccountLayout;