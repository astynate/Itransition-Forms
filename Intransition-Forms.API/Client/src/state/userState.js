import { makeAutoObservable } from "mobx";

class UserState {
    user = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    SetUser(user) {
        this.user = user;
    }
}

export default new UserState();