import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/home/layout/HomePage';
import { observer } from 'mobx-react-lite';
import Register from './pages/login/pages/register/Register';
import LoginPage from './pages/login/pages/login/LoginPage';

const App = observer(() => {
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