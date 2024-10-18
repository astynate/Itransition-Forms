import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
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
    let navigate = useNavigate();
    
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
                .then(_ => {
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
    }, [form]);

    useEffect(() => {
        if (!form && !isLoading) {
            navigate('/');
        }
    }, [form, isLoading]);

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
            {form && 
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <Questions 
                                form={form} 
                                setForm={setForm} 
                            />
                        }
                    />
                    <Route 
                        path="/answers" 
                        element={
                            <Answers 
                                form={form} 
                                setForm={setForm} 
                                setLoadingState={setLoadingState}
                            />
                        } 
                    />
                </Routes>}
        </div>
    );
}

export default FormPage;