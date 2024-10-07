import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/home/layout/HomePage';
import { observer } from 'mobx-react-lite';
import Register from './pages/login/pages/register/Register';
import LoginPage from './pages/login/pages/login/LoginPage';
import userState from './state/UserState';
import { instance } from './state/Interceptors';
import FormsState from './state/FormsState';

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

    const GetPopularTemplates = async () => {
        FormsState.setLoadingState(true);

        await instance
            .get('/api/forms')
            .then(response => {
                if (response.data) {
                    FormsState.SetPopularForms(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });

        FormsState.setLoadingState(false);
    }

    useEffect(() => {
        const token = localStorage.getItem('Access-Token');

        if (!userState.user && token) {
            GetUserData();
        }
    }, [userState.user]);

    useEffect(() => {
        GetPopularTemplates();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
    );
});

export default App;