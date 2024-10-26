import { makeAutoObservable } from "mobx";

class ApplicationState {
    isDarkMode = false;
    errorQueue = [];

    constructor() {
        const defaultDarkModeValue = localStorage.getItem('darkMode');
        this.isDarkMode = defaultDarkModeValue === 'true';
        
        makeAutoObservable(this);
    }

    AddErrorInQueueByError(title, error) {
        if (error && error.response && error.response.data) {
            this.AddErrorInQueue(title, error.response.data);
        } else {
            this.AddErrorInQueue(title, null);
        }
    }

    SetDarkModeState(state) {
        state = !!state;

        this.isDarkMode = state;
        localStorage.setItem('darkMode', state);
    }

    RemoveErrorFromQueue() {
        this.errorQueue  = this.errorQueue.slice(1);
    }

    GetErrorFromQueue() {
        return this.errorQueue[0];
    }

    GetCountErrors() {
        return this.errorQueue.length;
    }
}

export default new ApplicationState();