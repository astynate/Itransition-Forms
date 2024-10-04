import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/home/layout/HomePage';
import { observer } from 'mobx-react-lite';
import Register from './pages/login/pages/register/Register';
import LoginPage from './pages/login/pages/login/LoginPage';
import userState from './state/userState';
import { instance } from './state/Interceptors';

const App = observer(() => {
    useEffect(() => {
        const GetUserDate = async () => {
            await instance
                .get('/api/users')
                .catch(error => {
                    console.error(error);
                });
        }

        const token = localStorage.getItem('Access-Token');

        if (!userState.user && token) {
            GetUserDate();
        }
    }, [userState.user]);

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