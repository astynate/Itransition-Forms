import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { instance } from './state/Interceptors';
import HomePage from '../src/pages/home/layout/HomeLayout';
import Register from './pages/login/pages/register/Register';
import LoginPage from './pages/login/pages/login/LoginPage';
import userState from './state/UserState';
import FormPage from './pages/form/layout/Form';
import FillingPage from './pages/filling/layout/Filling';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pages/home/layout/main.css';
import './i18n';
import ApplicationState from './state/ApplicationState';
import { changeLanguage } from './i18n';

const App = observer(() => {
    const GetUserData = async () => {
        await instance
            .get('/api/users')
            .then(response => {
                if (response.data) {
                    userState.SetUser(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        const token = localStorage.getItem('Access-Token');

        if (!userState.user && token) {
            GetUserData();
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

    return (
        <Routes>
            <Route path="/*" element={<HomePage />} />
            <Route path="/form/:id/*" element={<FormPage />} />
            <Route path="/filling/:id/*" element={<FillingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1 style={{margin: 'auto'}}>{'Page is not found :)'}</h1>} />
        </Routes>
    );
});

export default App;