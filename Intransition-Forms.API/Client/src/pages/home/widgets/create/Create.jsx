import Wrapper from '../../elemets/wrapper/Wrapper';
import List from '../../features/list/List';
import FormTemplate from '../../features/form-template/FormTemplate';
import styles from './main.module.css';
import notFound from './images/not-found.png';
import userState from '../../../../state/UserState';
import { observer } from 'mobx-react-lite';
import FormsState from '../../../../state/FormsState';
import { instance } from '../../../../state/Interceptors';

const Create = observer(({setPresentations}) => {
    const CreatePresentation = async (id = null) => {
        let form = new FormData();

        form.append('username', userState.username);
        form.append('templateReference', id);

        await instance.post('/api/forms', {
            method: "POST",
            body: form
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
            setPresentations(prev => [response, ...prev]);
            window.open(`/forms/${response.id}`, '_blank');
        })
        .catch(_ => {
            alert('Something went wrong');
        });
    }

    return (
        <div className={styles.createWrapper}>
            {FormsState.isPopularTemplatesLoading && <div className={styles.loader}>
                <div className={styles.line}></div>
            </div>}
            {FormsState.isPopularTemplatesLoading === false && FormsState.popularForms.length === 0 && !userState.user ?
                <img 
                    src={notFound} 
                    className={styles.notFound} 
                    draggable="false"
                />
            :
                <Wrapper>
                    <List>
                        {!FormsState.isPopularTemplatesLoading && userState.user && <FormTemplate 
                            onClick={() => CreatePresentation(null)}
                        />}
                        {FormsState.isPopularTemplatesLoading && Array.from({ length: 6 }).map((_, index) => {
                            return (
                                <FormTemplate 
                                    key={index}
                                    image={null}
                                    name='Loading...'
                                    isCreate={!!userState.user}
                                />
                            );
                        })}
                        {FormsState.popularForms.map(form => {
                            return (
                                <FormTemplate 
                                    key={form.id}
                                    image={null}
                                    name={form.title}
                                    isCreate={false}
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