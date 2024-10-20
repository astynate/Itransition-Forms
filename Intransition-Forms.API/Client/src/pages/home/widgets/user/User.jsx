import Select from '../../../form/shared/select/Select';
import Avatar from '../../elemets/avatar/Avatar';
import styles from './main.module.css';

const User = () => {
    return (
        <div className={styles.user}>
            <div className={styles.left}>
                <input type='checkbox' />
                <Avatar />
                <span>email</span>
            </div>
            <div className={styles.right}>
                <Select
                    items={['Admin', 'User']}
                    // value={currentHandler}
                    onChange={(event) => {}} 
                />
            </div>
        </div>
    );
}

export default User;