import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { instance } from '../../../../state/Interceptors';
import styles from './main.module.css';
import SortTemplates from './scripts/SortTemplates';
import Create from '../../widgets/create/Create';
import FormsState from '../../../../state/FormsState';
import UserState from '../../../../state/userState';
import RenamePopup from '../../widgets/rename/RenamePopup';
import Wrapper from '../../elemets/wrapper/Wrapper';
import Select from '../../elemets/select/Select';
import List from '../../features/list/List';
import FormModel from '../../features/form-model/FormModel';
import { useTranslation } from 'react-i18next';

const HomePage = observer(({headerState, headerRef}) => {
    const [currentTag, setCurrentTag] = useState(-1);
    const [tags, setTags] = useState([]);
    const [displayProperty, SetDisplayProperty] = useState([0, 1]);
    const [sortProperty, SetSortProperty] = useState([0]);
    const [isRenameWindowOpen, SetRenameOpenState] = useState(false);
    const [selectedForm, SetSelectedForm] = useState(undefined);
    const [isViewingTemplates, setIsViewigTemplatesState] = useState(true);
    const [isViewingFillingOusts, setIsViewigFillingOustsState] = useState(true);
    const [sortingType, setSortingType] = useState(0);
    const { t } = useTranslation();

    const sortingTypes = [
        SortTemplates.SortByDateAscending,
        SortTemplates.SortByDateDescending,
        SortTemplates.SortByPopularityAscending,
        SortTemplates.SortByPopularityDescending,
    ];

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

                    const existingIds = new Set(FormsState.latestForms.map(form => form.id));

                    const uniqueTemplates = templates.filter(template => !existingIds.has(template.id));
                    const uniqueFillingOuts = fillingOuts.filter(fillingOut => !existingIds.has(fillingOut.id));

                    const isHasMoreTemplates = templates.length >= 5;
                    const isHasFillingOuts = fillingOuts.length >= 5;

                    FormsState.setHasMoreState(isHasMoreTemplates || isHasFillingOuts);
                    FormsState.setLatestForms([...uniqueTemplates, ...uniqueFillingOuts, ...FormsState.latestForms]);
                } else {
                    FormsState.setHasMoreState(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        const GetTags = async () => {
            await instance
                .get('/api/tags')
                .then(response => {
                    if (response.data) {
                        setTags(response.data);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        GetTags();
    }, []);

    useEffect(() => {
        if (UserState.user) {
            GetRecentForms();
        }
    }, [FormsState.latestForms.length, UserState.user]);

    return (
        <>
            {isRenameWindowOpen && 
                <RenamePopup
                    form={selectedForm}
                    setSelectedForm={SetSelectedForm}
                    setOpenState={SetRenameOpenState} 
                />
            }
            <Create
                tags={tags}
                currentTag={currentTag}
                setCurrentTag={setCurrentTag}
            />
            <div className={styles.headerWrapper} ref={headerRef} state={headerState}>
                <Wrapper>
                    <div className={styles.header}>
                        <h3>{t('latest-templates')}</h3>
                        <div className={styles.control}>
                            <Select
                                title={t('my-templates')}
                                items={[
                                    { title: t('my-templates'), callback: () => setIsViewigTemplatesState(prev => !prev) },
                                    { title: t('completed-forms'), callback: () => setIsViewigFillingOustsState(prev => !prev) },
                                ]}
                                selected={displayProperty}
                                setSelected={SetDisplayProperty}
                                isMultimpleChoiseAvailable={true}
                            />
                            <Select 
                                title={'A-Z'}
                                items={[
                                    { title: t('new-first'), callback: () => setSortingType(0) },
                                    { title: t('old-first'), callback: () => setSortingType(1) },
                                    { title: t('popular-first'), callback: () => setSortingType(2) },
                                    { title: t('popular-last'), callback: () => setSortingType(3) },
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
        </>
    );
});

export default HomePage;
