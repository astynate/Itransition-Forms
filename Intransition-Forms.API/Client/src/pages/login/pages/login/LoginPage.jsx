import { useTranslation } from "react-i18next";
import RegistrationForm from "../../form/Form";
import AccountLayout from "../../layout/AccountLayout";

const LoginPage = () => {
    const { t } = useTranslation();

    return (
        <AccountLayout>
            <RegistrationForm
                name={t('login')}
                button={t('login')}
                inputs={[
                    {placeholder: t('email'), name: "email"},
                    {placeholder: t('password'), name: "password", type: "password"},
                ]}
                action='/api/users/login'
            />
        </AccountLayout>
    );
}

export default LoginPage;