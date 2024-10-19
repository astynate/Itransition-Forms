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
import SortTemplates from './scripts/SortTemplates';
import UserState from '../../../state/UserState';

const HomePage = observer(() => {
    const [displayProperty, SetDisplayProperty] = useState([0, 1]);
    const [sortProperty, SetSortProperty] = useState([0]);
    const [headerState, SetHeaderState] = useState(null);
    const [isRenameWindowOpen, SetRenameOpenState] = useState(false);
    const [selectedForm, SetSelectedForm] = useState(undefined);
    const [isViewingTemplates, setIsViewigTemplatesState] = useState(true);
    const [isViewingFillingOusts, setIsViewigFillingOustsState] = useState(true);
    const [sortingType, setSortingType] = useState(0);

    const sortingTypes = [
        SortTemplates.SortByDateAscending,
        SortTemplates.SortByDateDescending,
        SortTemplates.SortByPopularityAscending,
        SortTemplates.SortByPopularityDescending,
    ];

    const headerRef = useRef();
    const wrapperRef = useRef();

    const HandlerScroll = () => {
        const scroll = wrapperRef.current.scrollTop;
        const header = headerRef.current.offsetTop;
        
        SetHeaderState(scroll + 62 > header ? 'sticky' : null);
    }

    const GetExistanceState = (element) => {
        if (!!element === false)
            return false;

        const isFillingOut = !!element.answers;

        if (!isViewingFillingOusts && isFillingOut)
            return false;

        if (!isViewingTemplates && !isFillingOut)
            return false;

        return true;
    }

    const GetRecentForms = async () => {
        await instance
            .get(`/api/forms/latest?skip=${FormsState.latestForms.length}&take=5`)
            .then(response => {
                if (response.data && response.data.templates && response.data.fillingOuts) {
                    const fillingOuts = response.data.fillingOuts;
                    const templates = response.data.templates;

                    const isHasMoreTemplates = templates.length >= 5;
                    const isHasFillingOuts = fillingOuts.length >= 5;

                    FormsState.setHasMoreState(isHasMoreTemplates || isHasFillingOuts);
                    FormsState.setLatestForms([...templates, ...fillingOuts, ...FormsState.latestForms]);
                } else {
                    FormsState.setHasMoreState(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (UserState.user) {
            GetRecentForms();
        }
    }, [FormsState.latestForms.length, UserState.user]);

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
                                    { title: "My templates", callback: () => setIsViewigTemplatesState(prev => !prev) },
                                    { title: "Completed forms", callback: () => setIsViewigFillingOustsState(prev => !prev) },
                                ]}
                                selected={displayProperty}
                                setSelected={SetDisplayProperty}
                                isMultimpleChoiseAvailable={true}
                            />
                            <Select 
                                title={'A-Z'}
                                items={[
                                    { title: "New first", callback: () => setSortingType(0) },
                                    { title: "Old first", callback: () => setSortingType(1) },
                                    { title: "Popular first", callback: () => setSortingType(2) },
                                    { title: "Popular last", callback: () => setSortingType(3) },
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
                    {FormsState.latestForms
                        .filter(form => GetExistanceState(form))
                        .sort((a, b) => sortingTypes[sortingType](a, b))
                        .map(form => {
                            const isFilligOut = !!form.answers === true;

                            return (
                                <FormModel 
                                    key={form.id}
                                    form={isFilligOut === true ? form.form : form}
                                    isFilligOut={isFilligOut}
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
