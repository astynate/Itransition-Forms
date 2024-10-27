import { useTranslation } from "react-i18next";
import RegistrationForm from "../../form/Form";
import AccountLayout from "../../layout/AccountLayout";
import ValidateHandler from "../../../../utils/ValidateHandler";

const LoginPage = () => {
    const { t } = useTranslation();

    return (
        <AccountLayout>
            <RegistrationForm
                name={t('login')}
                button={t('login')}
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
                action='/api/users/login'
            />
        </AccountLayout>
    );
}

export default LoginPage;