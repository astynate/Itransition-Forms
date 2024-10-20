import FormWrapper from '../../../form/shared/form-wrapper/FormWrapper';
import User from '../../widgets/user/User';
import styles from './main.module.css';

const Users = () => {
    return (
        <div className={styles.wrapper}>
            <FormWrapper>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <div className={styles.buttonWrapper}>
                            <input type='checkbox' />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.buttonWrapper}>

                        </div>

                        <div className={styles.buttonWrapper}>

                        </div>

                        <div className={styles.buttonWrapper}>

                        </div>
                    </div>
                </div>
                <div className={styles.users}>
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                </div>
            </FormWrapper>
        </div>
    );
}

export default Users;