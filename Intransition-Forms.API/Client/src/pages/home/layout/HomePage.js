import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import Header from '../widgets/header/Header';
import Create from '../widgets/create/Create';
import Wrapper from '../elemets/wrapper/Wrapper';
import Select from '../elemets/select/Select';
import './main.css';
import List from '../features/list/List';
import FormModel from '../features/form-model/FormModel';

const HomePage = () => {
    const [displayProperty, SetDisplayProperty] = useState([0, 1, 2]);
    const [sortProperty, SetSortProperty] = useState([0]);
    const [headerState, SetHeaderState] = useState(null);

    let headerRef = useRef();
    let wrapperRef = useRef();

    const HandlerScroll = () => {
        const scroll = wrapperRef.current.scrollTop;
        const header = headerRef.current.offsetTop;
        
        SetHeaderState(scroll + 62 > header ? 'sticky' : null);
    }

    return (
        <div className={styles.wrapper} ref={wrapperRef} onScroll={HandlerScroll}>
            <Header />
            <Create />
            <div className={styles.headerWrapper} ref={headerRef} state={headerState}>
                <Wrapper>
                    <div className={styles.header}>
                        <h3>Latest templates</h3>
                        <div className={styles.control}>
                            <Select 
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
                            <Select 
                                title={'A-Z'}
                                items={[
                                    { title: "New first" },
                                    { title: "Old first" },
                                    { title: "By date ascending" },
                                    { title: "By date decending" },
                                ]}
                                selected={sortProperty}
                                setSelected={SetSortProperty}
                                isMultimpleChoiseAvailable={false}
                            />
                        </div>
                    </div>
                </Wrapper>
            </div>
            <Wrapper>
                <List>
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                    <FormModel />
                </List>
            </Wrapper>
            <br />
            <br />
        </div>
    );
}

export default HomePage;
