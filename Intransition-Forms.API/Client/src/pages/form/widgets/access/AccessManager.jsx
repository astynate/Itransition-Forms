import { useTranslation } from 'react-i18next';
import { instance } from '../../../../state/Interceptors';
import { useEffect, useState } from 'react';
import Block from '../../features/block/Block';
import Select from '../../shared/select/Select';
import styles from './main.module.css';
import InputWithAutocomplition from '../../shared/input-with-autocomplition/InputWithAutocomplition';
import TagModel from '../../shared/tag-model/TagModel';

const AccessManager = ({form, setForm, isEditting={isEditting}}) => {
    const { t } = useTranslation();
    const [userEmail, setUserEmail] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const items = {
        Public: t('public'),
        SelectedUsers: t('selected-users')
    }

    useEffect(() => {
        if (form?.accessType && form.accessType === "Public" && isEditting) {
            setForm(prev => {
                return { ...prev, usersWithFillingOutAccess: [] };
            })
        }
    }, [form?.accessType])

    return (
        <Block>
            <h2 className={styles.title}>Manage access</h2>
            {form.accessType === "SelectedUsers" && <div className={styles.users}>
                {form.usersWithFillingOutAccess.map(user => {
                    return (
                        <TagModel 
                            key={user.id}
                            text={user.email}
                            remove={() => {
                                setForm(prev => {
                                    const updatedUsers = prev.usersWithFillingOutAccess
                                        .filter(u => u.id !== user.id);

                                    return { ...prev, usersWithFillingOutAccess: updatedUsers };
                                })
                            }}
                        />
                    );
                })}
                <InputWithAutocomplition 
                    placeholder='Search a user'
                    value={userEmail}
                    onInput={(text) => setUserEmail(text)}
                    values={searchResult.map(u => u.email)}
                    setValues={setSearchResult}
                    onEnter={(text) => {
                        setForm(prev => {
                            const user = searchResult.find(u => u.email === text);

                            if (user) {
                                const newValue = [...prev.usersWithFillingOutAccess, user];
                            
                                return { 
                                    ...prev, 
                                    usersWithFillingOutAccess: newValue
                                };
                            }

                            return prev;
                        });
                    }}
                    sendRequest={async (text) => {
                        if (!text) {
                            setSearchResult([]);
                            return;
                        }

                        await instance
                            .get(`/api/users/prefix?prefix=${text}`)
                            .then(response => {
                                if (response.data && response.data.length) {
                                    setSearchResult(response.data
                                        .filter(u => u.id !== form.userModelId));
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }}
                />
            </div>}
            <div className={styles.bottom}>
                <div className={styles.select}>
                    <Select 
                        items={[
                            t('public'), 
                            t('selected-users')
                        ]}
                        value={items[form.accessType]}
                        onChange={(e) => {
                            const item = Object.keys(items).find(key => items[key] === e.target.value);
                            
                            if (item) {
                                setForm(prev => {
                                    return { ...prev, accessType: item };
                                })    
                            }
                        }}
                    />
                </div>
            </div>
        </Block>
    );
}

export default AccessManager;