import { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { instance } from '../../../state/Interceptors';
import Header from '../widgets/header/Header';
import styles from './main.module.css';
import Questions from '../pages/questions/Questions';
import Answers from '../pages/answers/layout/Answers';
import Loading from '../../../elements/loading/Loading';

const FormPage = () => {
    const [form, setForm] = useState(undefined);
    const [isLoading, setLoadingState] = useState(true);
    const [isSavingChanges, setSavingChangesState] = useState(false);

    let params = useParams();

    const GetFormById = async () => {
        setLoadingState(true);

        await instance
            .get(`/api/forms/${params.id}`)
            .then(response => {
                if (response.data) {
                    setForm(response.data);
                }
            })
            .catch(error => {
                console.error(error);
                alert('Something went wrong');
            })

        setLoadingState(false);
    }
    
    useEffect(() => {
        GetFormById();
    }, [params.id]);

    useEffect(() => {
        console.log(form);
    }, [form]);

    return (
        <div className={styles.form}>
            {isLoading && <Loading />}
            <Header 
                form={form} 
                isLoading={isLoading} 
                setForm={setForm} 
                isSavingChanges={isSavingChanges}
                setSavingChanges={setSavingChangesState}
            />
            <Routes>
                <Route path="/" element={<Questions form={form} setForm={setForm} />} />
                <Route path="/answers" element={<Answers />} />
            </Routes>
        </div>
    );
}

export default FormPage;