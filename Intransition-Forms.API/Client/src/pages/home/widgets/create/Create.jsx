import Wrapper from '../../elemets/wrapper/Wrapper';
import List from '../../features/list/List';
import FormTemplate from '../../features/form-template/FormTemplate';
import styles from './main.module.css';
import notFound from './images/not-found.png';
import userState from '../../../../state/UserState';
import { observer } from 'mobx-react-lite';
import FormsState from '../../../../state/FormsState';
import { instance } from '../../../../state/Interceptors';
import Loading from '../../../../elements/loading/Loading';

const Create = observer(({setForms, forms}) => {
    const CreatePresentation = async (id) => {
        let form = new FormData();

        await instance.post(`/api/forms?templateReference=${id ? id : ''}`, {
            method: "POST",
            body: form
        })
        .then(response => {
            FormsState.setLatestForms([response.data, ...forms]);
            window.open(`/form/${response.data.id}`, '_blank');
        })
        .catch(error => {
            console.error(error);
            alert('Something went wrong');
        });
    }
    
    return (
        <div className={styles.createWrapper}>
            {FormsState.isPopularTemplatesLoading && <Loading />}
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