import { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { instance } from '../../../state/Interceptors';
import Header from '../widgets/header/Header';
import styles from './main.module.css';
import Questions from '../pages/questions/Questions';
import Answers from '../pages/answers/layout/Answers';
import Loading from '../../../elements/loading/Loading';
import FormsAPI from '../api/FormsAPI';

const FormPage = () => {
    const [form, setForm] = useState(undefined);
    const [isLoading, setLoadingState] = useState(true);
    const [timeoutId, setTimeoutId] = useState(undefined);
    const [isSavingChanges, setSavingChangesState] = useState(false);
    const [isEditting, setIsEditingState] = useState(false);

    let params = useParams();
    
    useEffect(() => {
        FormsAPI.GetFormById(
            params.id, 
            setForm, 
            setLoadingState
        );
    }, [params.id]);

    useEffect(() => {
        const SendSaveRequest = async () => {
            setSavingChangesState(true);

            await instance
                .put('/api/forms/save', form, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    setSavingChangesState(false);
                })
                .catch(error => {
                    console.error(error);
                    setSavingChangesState(false);
                });
        }

        if (form && !isEditting) {
            setIsEditingState(true);
        }

        if (form && isEditting) {
            clearTimeout(timeoutId);

            setTimeoutId(setTimeout(() => {
                SendSaveRequest();
            }, 700));
        }

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