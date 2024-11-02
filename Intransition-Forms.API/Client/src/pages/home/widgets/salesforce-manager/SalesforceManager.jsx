import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import PopupWindow from '../../../../features/popup-window/PopupWindow';
import SimpleButton from '../../../../elements/button/SimpleButton';
import SalesforceAPI from '../../../../api/SalesforceAPI';
import UserState from '../../../../state/UserState';
import ApplicationState from '../../../../state/ApplicationState';

const SalesforceManager = observer(({close}) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        SalesforceAPI.CreateUser(
            UserState.user, 
            event.target.first_name.value,
            event.target.last_name.value,
            event.target.description.value,
            event.target.phone.value,
            event.target.date.value
        );
    }

    if (!!UserState.user === false) return;

    return (
        <PopupWindow title={"Salesforce account"} close={close}>
            {UserState.user.account ? 
                <div className={styles.data}>
                    <span>{UserState.user.contact.firstName} {UserState.user.contact.lastName}</span>
                    <span>{UserState.user.account.description}</span>
                    <span>{UserState.user.contact.phone}</span>
                    <span>{UserState.user.contact.email}</span>
                </div>
            : 
                <form className={styles.wrapper} onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <input type='text' placeholder='FirstName' required name='first_name' />
                        <input type='text' placeholder='LastName' required name='last_name' />
                        <input type='text' placeholder='Desciption' required name='description' />
                        <input type='tel' placeholder='Phone number' required name='phone' />
                        <input type='date' required name='date' />
                    </div>
                    <SimpleButton 
                        title={'Create an account'}
                        isFillFullWidth={true}
                    />
                </form>}
        </PopupWindow>
    );
});

export default SalesforceManager;