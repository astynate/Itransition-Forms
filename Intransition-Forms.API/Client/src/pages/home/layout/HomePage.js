import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import Header from '../widgets/header/Header';
import Create from '../widgets/create/Create';
import Wrapper from '../elemets/wrapper/Wrapper';
import Select from '../elemets/select/Select';
import List from '../features/list/List';
import FormModel from '../features/form-model/FormModel';
import FormsState from '../../../state/FormsState';
import RenamePopup from '../widgets/rename/RenamePopup';
import { observer } from 'mobx-react-lite';
import { instance } from '../../../state/Interceptors';
import './main.css';

const HomePage = observer(() => {
    const [displayProperty, SetDisplayProperty] = useState([0, 1]);
    const [sortProperty, SetSortProperty] = useState([0]);
    const [headerState, SetHeaderState] = useState(null);
    const [isRenameWindowOpen, SetRenameOpenState] = useState(false);
    const [selectedForm, SetSelectedForm] = useState(undefined);

    let headerRef = useRef();
    let wrapperRef = useRef();

    const HandlerScroll = () => {
        const scroll = wrapperRef.current.scrollTop;
        const header = headerRef.current.offsetTop;
        
        SetHeaderState(scroll + 62 > header ? 'sticky' : null);
    }

    const GetRecentForms = async () => {
        await instance
            .get(`/api/forms/latest?skip=${FormsState.latestForms.length}&take=5`)
            .then(response => {
                if (response.data && response.data.length) {
                    FormsState.setHasMoreState(response.data.length >= 5);
                    FormsState.setLatestForms([...response.data, ...FormsState.latestForms]);
                } else {
                    FormsState.setHasMoreState(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        GetRecentForms();
    }, [FormsState.latestForms.length])

    return (
        <div className={styles.wrapper} ref={wrapperRef} onScroll={HandlerScroll}>
            <Header />
            {isRenameWindowOpen && 
                <RenamePopup 
                    form={selectedForm}
                    setSelectedForm={SetSelectedForm}
                    setOpenState={SetRenameOpenState} 
                />
            }
            <Create 
                setForm={FormsState.setLatestForms} 
                forms={FormsState.latestForms} 
            />
            <div className={styles.headerWrapper} ref={headerRef} state={headerState}>
                <Wrapper>
                    <div className={styles.header}>
                        <h3>Latest templates</h3>
                        <div className={styles.control}>
                            <Select 
                                title={'Display'}
                                items={[
                                    { title: "My templates" },
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
                    {FormsState.latestForms.map(form => {
                        return (
                            <FormModel 
                                key={form.id}
                                form={form}
                                openRenameForm={() => {
                                    SetRenameOpenState(true);
                                    SetSelectedForm(form);
                                }}
                            />
                        );
                    })}
                </List>
            </Wrapper>
            <br />
            <br />
        </div>
    );
});

export default HomePage;
