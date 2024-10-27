import React from 'react';
import RegistrationForm from '../../form/Form';
import AccountLayout from '../../layout/AccountLayout';
import { useTranslation } from 'react-i18next';
import ValidateHandler from '../../../../utils/ValidateHandler';

const Register = () => {
    const { t } = useTranslation();

    return (
        <AccountLayout>
            <RegistrationForm
                name={t('register')}
                button={t('sign-up')}
                inputs={[
                    { 
                        placeholder: t('email'), 
                        name: "email", 
                        validator: ValidateHandler.validateEmail 
                    },
                    { 
                        placeholder: t('password'), 
                        name: "password", 
                        type: "password", 
                        validator: ValidateHandler.validatePassword 
                    },
                ]}
                isColorPicker={true}
                action='/api/users/register'
            />
        </AccountLayout>
    );
};

export default Register;