import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { changeLanguage } from './i18n';
import HomePage from '../src/pages/home/layout/HomeLayout';
import Register from './pages/login/pages/register/Register';
import LoginPage from './pages/login/pages/login/LoginPage';
import userState from './state/UserState';
import FormPage from './pages/form/layout/Form';
import FillingPage from './pages/filling/layout/Filling';
import ApplicationState from './state/ApplicationState';
import MessageBox from './widgets/message-box/MessageBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pages/home/layout/main.css';
import './i18n';
import FillingOutResult from './pages/filling-out-result/FillingOutResult';
import UserState from './state/UserState';
import GetSupport from './features/get-support/GetSupport';
import Issues from './pages/issues/layout/Issues';

const App = observer(() => {
    const [title, setErrorTitle] = useState('');
    const [message, setErrorMessage] = useState('');
    const [isError, setErrorState] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('Access-Token');

        if (!userState.user && token) {
            UserState.GetUserData();
        }
    }, [userState.user]);

    useEffect(() => {
        const root = document.querySelector('#root');

        if (!!root === true) {
            root.setAttribute('theme', ApplicationState.isDarkMode ? 'dark' : 'light');
        }
    }, [ApplicationState.isDarkMode]);

    useEffect(() => {
        changeLanguage(localStorage.getItem('language'));
    }, []);

    useEffect(() => {
        const setError = (title, message) => {
            setErrorTitle(title);
            setErrorMessage(message);
            setErrorState(true);
        }

        if (isError === false && ApplicationState.GetCountErrors() > 0) {
            const [title, message] = ApplicationState.GetErrorFromQueue();
            setError(title, message);
            ApplicationState.RemoveErrorFromQueue();
        }
    }, [isError, ApplicationState, ApplicationState.errorQueue.length]);

    return (
        <>
            {isError && <MessageBox 
                title={title} 
                message={message} 
                action={() => setErrorState(false)}
            />}
            <GetSupport />
            <Routes>
                <Route path="/*" element={<HomePage />} />
                <Route path="/form/:id/*" element={<FormPage />} />
                <Route path="/issues" element={<Issues />} />
                <Route path="/filling/:id/*" element={<FillingPage />} />
                <Route path="/filling-out-result/:id?" element={<FillingOutResult />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<h1 style={{margin: 'auto'}}>{'Page is not found :)'}</h1>} />
            </Routes>
        </>
    );
});

export default App;