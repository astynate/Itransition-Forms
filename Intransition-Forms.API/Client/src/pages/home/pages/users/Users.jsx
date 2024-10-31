import { useEffect, useRef, useState } from 'react';
import { instance } from '../../../../state/Interceptors';
import FormWrapper from '../../../form/shared/form-wrapper/FormWrapper';
import User from '../../widgets/user/User';
import styles from './main.module.css';
import blockImage from './images/block.png';
import deleteImage from './images/delete.png';
import unblockImage from './images/unblock.png';
import UserState from '../../../../state/userState';
import { useNavigate } from 'react-router-dom';
import UpdateHandler from './scripts/UpdateHandler';
import ApplicationState from '../../../../state/ApplicationState';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isHasMore, setHasMoreState] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const operationHandlers = {
        'Block': UpdateHandler.BlockUser,
        'Unblock': UpdateHandler.UnblockUser,
        'Delete': UpdateHandler.DeleteUser,
        'AddAdminRights': (users, setUsers) => UpdateHandler.UpdateAdminRights(users, setUsers, true),
        'RemoveAdminRights': (users, setUsers) => UpdateHandler.UpdateAdminRights(users, setUsers, false),
    }
    
    const observerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (!UserState.user || UserState.user.isAdmin === false) {
            navigate('/');
        }
    }, []);
    
    useEffect(() => {
        const GetUsers = async () => {
            await instance
                .get(`api/users/all?from=${users.length}&count=${5}`)
                .then(response => {
                    if (response.data) {
                        setUsers(prev => [...prev, ...response.data]);
                        setHasMoreState(response.data.length === 5);
                    }
                })
                .catch(error => {
                    ApplicationState.AddErrorInQueueByError("Attention!", error);
                    console.error(error);
                })
        }

        if (isHasMore === true) {
            GetUsers();
        }
    }, [isHasMore, users.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && isHasMore) {
                setHasMoreState(true);
            }
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [isHasMore]);

    const SendMessageAsync = async (usersToUpdate, operation) => {
        if (usersToUpdate.length === 0) 
            return;

        let form = new FormData();

        for (let i = 0; i < usersToUpdate.length; i++) {
            form.append('users', usersToUpdate[i]);
        }

        form.append('operation', operation);

        await instance
            .put('/api/users', form)
            .then(_ => {
                const leaveOperation = ['Block', 'Delete', 'RemoveAdminRights']

                if (usersToUpdate.includes(UserState.user.id) && leaveOperation.includes(operation)) {
                    UserState.SetUser(undefined);
                    localStorage.removeItem('Access-Token');
                    
                    navigate('/login');
                    return;
                }

                if (operationHandlers[operation]) {
                    operationHandlers[operation](usersToUpdate, setUsers);   
                }

                setSelectedUsers([]);
            })
            .catch(error => {
                ApplicationState.AddErrorInQueueByError("Attention!", error);
                console.error(error);
            });
    }

    return (
        <div className={styles.wrapper}>
            <FormWrapper>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <div className={styles.buttonWrapper} effects='none'>
                            <input 
                                type='checkbox' 
                                checked={users.map(e => e.id).every(id => selectedUsers.includes(id))}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setSelectedUsers(users.map(e => e.id));  
                                    } else {
                                        setSelectedUsers([]); 
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.buttonWrapper} onClick={() => SendMessageAsync(selectedUsers, "Unblock")}>
                            <img src={unblockImage} draggable="false" />
                            <span>Unblock</span>
                        </div>
                        <div className={styles.buttonWrapper} onClick={() => SendMessageAsync(selectedUsers, "Block")}>
                            <img src={blockImage} draggable="false" />
                            <span>Block</span>
                        </div>
                        <div className={styles.buttonWrapper} onClick={() => SendMessageAsync(selectedUsers, "Delete")}>
                            <img src={deleteImage} draggable="false" />
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
                <div className={styles.users}>
                    {users.map(user => {
                        return (
                            <User 
                                key={user.id}
                                user={user}
                                sectedUsers={selectedUsers} 
                                setSelectedUsers={setSelectedUsers}
                                onChange={(event) => {
                                    if (event.target.value === 'Admin') {
                                        SendMessageAsync([user.id], "AddAdminRights");
                                    } else {
                                        SendMessageAsync([user.id], "RemoveAdminRights");
                                    }
                                }}
                            />
                        );
                    })}
                    <div ref={observerRef} style={{ height: '1px' }} />
                </div>
            </FormWrapper>
        </div>
    );
}

export default Users;