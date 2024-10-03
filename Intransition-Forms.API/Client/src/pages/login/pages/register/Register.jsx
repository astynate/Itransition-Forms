import React from 'react';
import RegistrationForm from '../../form/Form';
import AccountLayout from '../../layout/AccountLayout';

const Register = () => {
    return (
        <AccountLayout>
            <RegistrationForm
                name='Registration'
                button={"Sign up"}
                inputs={[
                    {placeholder: 'Email', name: "email"},
                    {placeholder: 'Password', name: "password", type: "password"},
                ]}
                isColorPicker={true}
                action='/api/users/register'
            />
        </AccountLayout>
    );
};

export default Register;