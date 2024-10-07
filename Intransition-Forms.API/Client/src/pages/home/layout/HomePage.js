import React, { useState } from 'react';
import styles from './main.module.css';
import Header from '../widgets/header/Header';
import Create from '../widgets/create/Create';
import Wrapper from '../elemets/wrapper/Wrapper';
import './main.css';
import PopupList from '../elemets/popup-list/PopupList';

const HomePage = () => {
    const [displayProperty, SetDisplayProperty] = useState([0]);
    const [sortProperty, SetSortProperty] = useState([0]);

    return (
        <div className={styles.wrapper}>
            <Header />
            <Create />
            <Wrapper>
                <div className={styles.header}>
                    <h3>Latest templates</h3>
                    <div className={styles.control}>
                        <PopupList 
                            title={'Display'}
                            items={[
                                { title: "Owner: I'm" },
                                { title: "Owner: Not I'm" },
                                { title: "Completed forms" },
                            ]}
                            selected={displayProperty}
                            setSelected={SetDisplayProperty}
                            isMultimpleChoiseAvailable={true}
                        />
                        <PopupList 
                            title={'A-Z'}
                            isMultimpleChoiseAvailable={false}
                        />
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}

export default HomePage;
