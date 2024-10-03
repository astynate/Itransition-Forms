import RegistrationForm from "../../form/Form";
import AccountLayout from "../../layout/AccountLayout";

const LoginPage = () => {
    return (
        <AccountLayout>
            <RegistrationForm
                name='Login'
                button={"Login"}
                inputs={[
                    {placeholder: 'Email', name: "email"},
                    {placeholder: 'Password', name: "password", type: "password"},
                ]}
                action='/api/users/login'
            />
        </AccountLayout>
    );
}

export default LoginPage;