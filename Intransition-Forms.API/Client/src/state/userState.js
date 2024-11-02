import { makeAutoObservable } from "mobx";
import { instance } from "./Interceptors";

class UserState {
    user = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    SetUser(user) {
        this.user = user;
    }

    GetUserData = async () => {
        await instance
            .get('/api/users')
            .then(response => {
                if (response.data) {
                    this.user = response.data;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

export default new UserState();