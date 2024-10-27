class UpdateHandler {
    static UpdateUsers = (users, setUsers, func) => {
        setUsers(prev => {
            return prev.map(user => {
                if (users.includes(user.id)) {
                    user = func(user);
                }

                return user;
            });
        });
    }

    static UpdateAdminRights = (users, setUsers, state) => {
        UpdateHandler.UpdateUsers(users, setUsers, u => {return {...u, isAdmin: state}});
    }

    static BlockUser = (users, setUsers) => {
        UpdateHandler.UpdateUsers(users, setUsers, u => {return {...u, isBlocked: true}});
    }

    static UnblockUser = (users, setUsers) => {
        UpdateHandler.UpdateUsers(users, setUsers, u => {return {...u, isBlocked: false}});
    }

    static DeleteUser = (users, setUsers) => {
        setUsers(prev => {
            return prev.filter(user => users.includes(user.id) === false);
        });
    }
}

export default UpdateHandler;