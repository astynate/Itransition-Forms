import Select from '../../../form/shared/select/Select';
import Avatar from '../../elemets/avatar/Avatar';
import styles from './main.module.css';

const User = ({user, sectedUsers, setSelectedUsers, onChange}) => {
    if (!!user === false) return;

    return (
        <div className={styles.user}>
            <div className={styles.left}>
                <input 
                    type='checkbox' 
                    checked={sectedUsers.includes(user.id)}
                    onChange={(event) => {
                        setSelectedUsers(prev => {
                            if (event.target.checked) {
                                return [...prev, user.id];
                            } else {
                                return prev.filter(e => e !== user.id);
                            }
                        });
                    }}
                />
                <Avatar color={user.color} name={user.email} />
                <span>{user.email}</span>
            </div>
            <div className={styles.right}>
                <div className={styles.users}>
                    {user.isBlocked ? "Blocked" : "Active"}
                </div>
                <Select
                    items={['Admin', 'User']}
                    value={user.isAdmin ? "Admin" : "User"}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default User;