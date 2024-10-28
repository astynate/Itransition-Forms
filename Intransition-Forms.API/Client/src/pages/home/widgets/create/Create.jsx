import Wrapper from '../../elemets/wrapper/Wrapper';
import List from '../../features/list/List';
import FormTemplate from '../../features/form-template/FormTemplate';
import styles from './main.module.css';
import notFound from './images/not-found.png';
import userState from '../../../../state/userState';
import { observer } from 'mobx-react-lite';
import FormsState from '../../../../state/FormsState';
import { instance } from '../../../../state/Interceptors';
import Loading from '../../../../elements/loading/Loading';
import { useTranslation } from 'react-i18next';
import Tag from '../../features/tag/Tag';
import { useEffect } from 'react';

const Create = observer(({currentTag, tags = [], setCurrentTag = () => {}}) => {
    const { t } = useTranslation();

    const CreatePresentation = async (id) => {
        if (!userState.user) return;

        let form = new FormData();

        await instance.post(`/api/forms?templateReference=${id ? id : ''}`, {
            method: "POST",
            body: form
        })
        .then(response => {
            FormsState.setLatestForms([response.data, ...FormsState.latestForms]);
            window.open(`/form/${response.data.id}`, '_blank');
        })
        .catch(error => {
            console.error(error);
            alert('Something went wrong');
        });
    }
    
    useEffect(() => {
        const tag = currentTag >= 0 ? tags[currentTag] : "";
        FormsState.getPopularForms(tag);
    }, [currentTag]);

    return (
        <div className={styles.createWrapper}>
            {FormsState.isPopularTemplatesLoading && 
                <div className={styles.loadingWrapper}>
                    <Loading />
                </div>}
            {FormsState.isPopularTemplatesLoading === false && FormsState.popularForms.length === 0 && !userState.user ?
                <img 
                    src={notFound} 
                    className={styles.notFound} 
                    draggable="false"
                />
            :
                <Wrapper>
                    <div className={styles.tagCloud}>
                        <h1 className={styles.popularTemplates}>{t('popular-templates')}</h1>
                        <div className={styles.tags}>
                            <Tag 
                                name='Without tag' 
                                isActive={currentTag === -1}
                                callback={() => setCurrentTag(-1)}
                            />
                            {tags.map((e, index) => {
                                return <Tag 
                                    name={e} 
                                    key={index} 
                                    isActive={index === currentTag}
                                    callback={() => setCurrentTag(index)}
                                />;
                            })}
                        </div>
                    </div>
                    <List>
                        {!FormsState.isPopularTemplatesLoading && userState.user && <FormTemplate 
                            onClick={() => CreatePresentation(null)}
                        />}
                        {FormsState.isPopularTemplatesLoading && Array.from({ length: 6 }).map((_, index) => {
                            return (
                                <FormTemplate 
                                    key={index}
                                    image={null}
                                    isCreate={false}
                                    name='Loading...'
                                />
                            );
                        })}
                        {FormsState.popularForms.map(form => {
                            return (
                                <FormTemplate 
                                    key={form.id}
                                    image={null}
                                    id={form.id}
                                    name={form.title}
                                    isCreate={false}
                                    onClick={() => CreatePresentation(form.id)}
                                />
                            );
                        })}
                    </List>
                </Wrapper>
            }
        </div>
    );
});

export default Create;